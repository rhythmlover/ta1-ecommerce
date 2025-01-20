import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CartItemDto } from "./dto";

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async displayUserCart(userId: string) {
        return this.prisma.cart.findFirst({
            where: {
                userId,
            },
            select: {
                id: true,
                totalCost: true,
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                handle: true,
                                price: true,
                                imageUrl: true,
                            },
                        },
                        option: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async createCart(userId: string) {
        const cart = await this.prisma.cart.create({
            data: {
                userId,
                totalCost: 0,
            },
        });
        return cart;
    }

    async addCartItem(dto: CartItemDto) {
        const cartItem = await this.prisma.cartItem.create({
            data: {
                quantity: dto.quantity,
                optionId: dto.optionId,
                productId: dto.productId,
                cartId: dto.cartId,
            },
        });
        return cartItem;
    }

    async updateCartItem(id: string, dto: CartItemDto) {
        return this.prisma.cartItem.update({
            where: {
                id,
            },
            data: {
                quantity: dto.quantity,
            },
        });
    }

    async deleteCartItem(id: string) {
        return this.prisma.cartItem.delete({
            where: {
                id,
            },
        });
    }

    async updateTotalCost(cartId: string, total_cost: number) {
        return this.prisma.cart.update({
            where: {
                id: cartId,
            },
            data: {
                totalCost: total_cost,
            },
        });
    }

    async clearCart(cartId: string) {
        return this.prisma.cartItem.deleteMany({
            where: {
                cartId,
            },
        });
    }
}