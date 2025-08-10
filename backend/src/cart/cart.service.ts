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

    async displaySessionCart(sessionId: string) {
        return this.prisma.cart.findFirst({
            where: {
                sessionId,
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
        // Check if a cart already exists for this user
        const existingCart = await this.prisma.cart.findFirst({
            where: {
                userId,
            },
        });

        if (existingCart) {
            // Return existing cart if found
            return existingCart;
        }

        // Create new cart if none exists
        const cart = await this.prisma.cart.create({
            data: {
                userId,
                totalCost: 0,
            },
        });
        return cart;
    }

    async createSessionCart(sessionId: string) {
        // Check if a cart already exists for this session
        const existingCart = await this.prisma.cart.findFirst({
            where: {
                sessionId,
            },
        });

        if (existingCart) {
            // Return existing cart if found
            return existingCart;
        }

        // Create new cart if none exists
        const cart = await this.prisma.cart.create({
            data: {
                sessionId,
                totalCost: 0,
            },
        });
        return cart;
    }

    async mergeSessionCartToUserCart(sessionId: string, userId: string) {
        // Find session cart
        const sessionCart = await this.prisma.cart.findFirst({
            where: { sessionId },
            include: { items: true }
        });

        if (!sessionCart || sessionCart.items.length === 0) {
            return null;
        }

        // Find or create user cart
        let userCart = await this.prisma.cart.findFirst({
            where: { userId },
            include: { items: true }
        });

        if (!userCart) {
            userCart = await this.prisma.cart.create({
                data: {
                    userId,
                    totalCost: 0,
                },
                include: { items: true }
            });
        }

        // Merge session cart items into user cart
        for (const sessionItem of sessionCart.items) {
            // Check if item already exists in user cart
            const existingItem = userCart.items.find(
                item => item.productId === sessionItem.productId && item.optionId === sessionItem.optionId
            );

            if (existingItem) {
                // Update quantity
                await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + sessionItem.quantity }
                });
            } else {
                // Add new item to user cart
                await this.prisma.cartItem.create({
                    data: {
                        quantity: sessionItem.quantity,
                        optionId: sessionItem.optionId,
                        productId: sessionItem.productId,
                        cartId: userCart.id,
                    }
                });
            }
        }

        // Delete session cart
        await this.prisma.cartItem.deleteMany({
            where: { cartId: sessionCart.id }
        });
        await this.prisma.cart.delete({
            where: { id: sessionCart.id }
        });

        return userCart;
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
                cartId: cartId,
            },
        });
    }

    async cleanupInactiveCarts(daysOld: number = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        // Delete cart items first (foreign key constraint)
        const cartsToDelete = await this.prisma.cart.findMany({
            where: {
                updatedAt: {
                    lt: cutoffDate
                },
                // Only cleanup session carts (guest carts) to preserve user carts
                sessionId: {
                    not: null
                }
            },
            select: {
                id: true
            }
        });

        const cartIds = cartsToDelete.map(cart => cart.id);

        if (cartIds.length > 0) {
            // Delete cart items first
            await this.prisma.cartItem.deleteMany({
                where: {
                    cartId: {
                        in: cartIds
                    }
                }
            });

            // Then delete the carts
            const deletedCarts = await this.prisma.cart.deleteMany({
                where: {
                    id: {
                        in: cartIds
                    }
                }
            });

            console.log(`Cleaned up ${deletedCarts.count} inactive guest carts older than ${daysOld} days`);
            return deletedCarts.count;
        }

        return 0;
    }

    async cleanupEmptyCarts() {
        // Find carts with no items
        const emptyCarts = await this.prisma.cart.findMany({
            where: {
                items: {
                    none: {}
                },
                // Only cleanup session carts
                sessionId: {
                    not: null
                }
            },
            select: {
                id: true
            }
        });

        if (emptyCarts.length > 0) {
            const cartIds = emptyCarts.map(cart => cart.id);
            
            const deletedCarts = await this.prisma.cart.deleteMany({
                where: {
                    id: {
                        in: cartIds
                    }
                }
            });

            console.log(`Cleaned up ${deletedCarts.count} empty guest carts`);
            return deletedCarts.count;
        }

        return 0;
    }

    async cleanupAllGuestCarts() {
        // Find all guest carts (carts with sessionId)
        const guestCarts = await this.prisma.cart.findMany({
            where: {
                sessionId: {
                    not: null
                }
            },
            select: {
                id: true,
                sessionId: true
            }
        });

        if (guestCarts.length > 0) {
            const cartIds = guestCarts.map(cart => cart.id);
            
            // Delete cart items first (foreign key constraint)
            await this.prisma.cartItem.deleteMany({
                where: {
                    cartId: {
                        in: cartIds
                    }
                }
            });

            // Then delete all guest carts
            const deletedCarts = await this.prisma.cart.deleteMany({
                where: {
                    id: {
                        in: cartIds
                    }
                }
            });

            console.log(`Cleaned up ALL ${deletedCarts.count} guest carts`);
            return deletedCarts.count;
        }

        console.log('No guest carts found to cleanup');
        return 0;
    }
}