import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { ProductService } from "../products/product.service";
import { OrderDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private productService: ProductService
    ) {}

    async createOrder(dto: OrderDto) {
        try {
            const order = await this.prisma.order.create({
                data: {
                    totalCost: dto.totalCost,
                    userId: dto.userId,
                    paymentId: dto.paymentId,
                    name: dto.name,
                    email: dto.email,
                    address: dto.address,
                    postalCode: dto.postalCode,
                    phone: dto.phone,
                    items: {
                        create: dto.items.map((item) => ({
                            optionId: item.optionId,
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    },
                },
            });
            await this.sendOrderToInHouseEmail(dto.paymentId);
            return order;
        } catch (error) {
            console.log(error);
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Payment Intent has previously been used");
                }
            }
        }
    }

    async sendOrderToInHouseEmail(paymentId: string) {
        const order = await this.getOrder(paymentId);
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const emailPassword = this.configService.get<string>("EMAIL_PASSWORD");
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: true,
                auth: {
                    user: emailUser,
                    pass: emailPassword,
                },
            } as SMTPTransport.Options);

            const orderHTML = `
            <h1>Order #${order.id.toUpperCase()}</h1>
            <h2>Order Details</h2>
            <p>Name: ${order.name}</p>
            <p>Email: ${order.email}</p>
            <p>Phone: +${order.phone}</p>
            <p>Address: ${order.address}</p>
            <p>Postal Code: ${order.postalCode}</p>
            <h2>Items</h2>
            <ul>
            ${(
                await Promise.all(
                    order.items.map(async (item) => {
                        const product = await this.productService.getProduct(item.productId);
                        const option = product.options.find(
                            (option) => option.id === item.optionId
                        );
                        return `
                            <li>
                                <p>Name: ${product.name}</p>
                                <p>Option: ${option ? option.name : "N/A"}</p>
                                <p>Quantity: ${item.quantity}</p>
                                <p>Price: $${product.price * item.quantity}</p>
                            </li>
                        `;
                    })
                )
            ).join("")}
            </ul>
            <h2>Total Cost</h2>
            <p>$${(order.totalCost).toFixed(2)}</p>
        `;
            console.log("Order HTML: ", orderHTML);

            transporter.sendMail(
                {
                    from: emailUser,
                    to: emailUser,
                    subject: "Order Placed, ID: " + order.id,
                    html: orderHTML,
                } as nodemailer.SendMailOptions,
                (err, info) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log("Email sent successfully", info.response);
                }
            );
            return { message: "Email sent successfully" };
        } catch (error) {
            console.error(error);
        }
    }

    async getOrder(paymentId: string, retries: number = 1, delay: number = 0) {
        for (let i = 0; i < retries; i++) {
            console.log("Retrying order retrieval " + i);
            const order = await this.prisma.order.findUnique({
                where: {
                    paymentId: paymentId,
                },
                select: {
                    id: true,
                    totalCost: true,
                    userId: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    postalCode: true,
                    items: {
                        select: {
                            quantity: true,
                            productId: true,
                            optionId: true,
                        },
                    },
                    createdAt: true,
                },
            });
            if (order) {
                return order;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
        return null;
    }

    async getOrderId(paymentId: string) {
        console.log("Getting order id for payment id: ", paymentId);
        const order = await this.prisma.order.findUnique({
            where: {
                paymentId: paymentId,
            },
            select: {
                id: true,
            },
        });

        return order;
    }

    async getOrderTimestamp(paymentId: string) {
        console.log("Getting order timestamp for payment id: ", paymentId);
        const order = await this.prisma.order.findUnique({
            where: {
                paymentId: paymentId,
            },
            select: {
                createdAt: true,
            },
        });

        return order;
    }
}
