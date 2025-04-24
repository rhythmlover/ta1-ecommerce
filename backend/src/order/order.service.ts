import { Injectable, ForbiddenException, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { ProductService } from "../products/product.service";
import { OrderDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { Auth } from "googleapis";
import * as fs from "fs";
import type { ReceiptData } from "../types";

@Injectable()
export class OrderService {
    private oAuth2Client: Auth.OAuth2Client;
    private logger = new Logger("OrderService");

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private productService: ProductService
    ) {
        this.oAuth2Client = new Auth.OAuth2Client({
            clientId: this.configService.get<string>("CLIENT_ID"),
            clientSecret: this.configService.get<string>("CLIENT_SECRET"),
            redirectUri: this.configService.get<string>("REDIRECT_URI"),
        });
        this.oAuth2Client.setCredentials({
            refresh_token: this.configService.get<string>("REFRESH_TOKEN"),
        });
    }

    async getAllOrders() {
        return this.prisma.order.findMany({
            select: {
                id: true,
                totalCost: true,
                paymentId: true,
                userId: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                postalCode: true,
                orderFulfilled: true,
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
    }

    async updateOrderToFulfilled(orderId: string) {
        return this.prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                orderFulfilled: true,
            },
        });
    }

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
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    this.logger.error("Order already exists.");
                    throw new ForbiddenException("Order already exists.");
                }
            }
        }
    }

    async sendOrderToInHouseEmail(paymentId: string) {
        const order = await this.getOrder(paymentId);
        const receiptData: ReceiptData = {
            name: order.name,
            email: order.email,
            address: order.address,
            phone: order.phone,
            postalCode: order.postalCode,
            purchaseDate: new Date().toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour12: false,
            }),
            purchaseDateAndTime: new Date().toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
            }),
            receiptId: order.id.toUpperCase(),
            totalCost: order.totalCost,
            paymentMethod: "",
            paymentDate: "",
            receiptItems: await Promise.all(
                order.items.map(async (item) => ({
                    price:
                        (await this.productService.getProduct(item.productId)).price *
                        item.quantity,
                    description:
                        (await this.productService.getProduct(item.productId)).name +
                        " [" +
                        (
                            await this.productService.getProduct(item.productId)
                        ).options.find((option) => option.id === item.optionId).name +
                        "] ",
                    quantity: item.quantity,
                }))
            ),
        };
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const ordersEmailUser = this.configService.get<string>("ORDERS_EMAIL_USER");
        const emailClientID = this.configService.get<string>("CLIENT_ID");
        const emailClientSecret = this.configService.get<string>("CLIENT_SECRET");
        const refreshToken = this.configService.get<string>("REFRESH_TOKEN");
        const accessToken = await this.oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: emailUser,
                clientId: emailClientID,
                clientSecret: emailClientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken.token as string,
            },
            tls: {
                rejectUnauthorized: true,
            },
        } as SMTPTransport.Options);

        const templatePath = "src/order/order-template.html";
        let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
        const mailBy = new Date(receiptData.purchaseDate);
        mailBy.setDate(mailBy.getDate() + 3);

        htmlTemplate = htmlTemplate
            .replace(/{{orderId}}/g, receiptData.receiptId)
            .replace(/{{email}}/g, receiptData.email)
            .replace(/{{address}}/g, receiptData.address)
            .replace(/{{phone}}/g, receiptData.phone)
            .replace(/{{postal_code}}/g, receiptData.postalCode)
            .replace(/{{name}}/g, receiptData.name)
            .replace(/{{purchase_date}}/g, receiptData.purchaseDateAndTime)
            .replace(/{{mail_by}}/g, mailBy.toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
                year: "numeric",
                month: "short",
                day: "numeric",
            }))
            .replace(/{{receipt_id}}/g, receiptData.receiptId.slice(0, 13).toUpperCase())
            .replace(/{{total}}/g, receiptData.totalCost.toFixed(2))
            .replace(/{{#each receipt_details}}([\s\S]*?){{\/each}}/g, (match, content) => {
                return receiptData.receiptItems
                    .map((detail: any) => {
                        return content
                            .replace(/{{description}}/g, detail.description)
                            .replace(/{{quantity}}/g, detail.quantity)
                            .replace(/{{price}}/g, detail.price.toFixed(2));
                    })
                    .join("");
            });

        transporter.sendMail(
            {
                from: ordersEmailUser,
                to: ordersEmailUser,
                subject: "Order Placed, ID: " + receiptData.receiptId,
                html: htmlTemplate,
            } as nodemailer.SendMailOptions,
            (err, info) => {
                if (err) {
                    console.error(err);
                }
                console.log("Email inhouse order sent successfully", info.response);
            }
        );
        return { message: "Email sent successfully" };
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
                    orderFulfilled: true,
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

    async getOrdersByUser(userId: string) {
        return this.prisma.order.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                totalCost: true,
                paymentId: true,
                userId: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                postalCode: true,
                orderFulfilled: true,
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
    }
}
