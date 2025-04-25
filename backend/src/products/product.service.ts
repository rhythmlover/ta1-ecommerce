import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ProductDto } from "./dto";

@Injectable({})
export class ProductService {
    constructor(private prisma: PrismaService) { }

    getProducts() {
        return this.prisma.product.findMany({
            orderBy: [
                { priority: 'asc' }, // Sort by priority first (lower numbers first)
                { createdAt: 'desc' }, // Sort by creation date for products without priority
            ],
        });
    }

    async addProduct(dto: ProductDto) {
        const product = await this.prisma.product.create({
            data: {
                name: dto.name,
                handle: dto.handle,
                price: dto.price,
                description: dto.description,
                imageUrl: dto.imageUrl,
            },
        });

        return product;
    }
    async getProduct(id: string) {
        return this.prisma.product.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                handle: true,
                price: true,
                description: true,
                imageUrl: true,
                createdAt: false,
                updatedAt: false,
                options: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        productId: true,
                        imageUrl: true,
                    },
                },
            }
        });
    }

    async getProductByHandle(handle: string) {
        return this.prisma.product.findFirst({
            where: {
                handle,
            },
            select: {
                id: true,
                name: true,
                handle: true,
                price: true,
                description: true,
                imageUrl: true,
                createdAt: false,
                updatedAt: false,
                options: {
                    select: {
                        id: true,
                        name: true,
                        quantity: true,
                        productId: true,
                        imageUrl: true,
                    },
                },
            }
        });
    }
}
