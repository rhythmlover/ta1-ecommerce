import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) {}

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
}
