import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CartDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    totalCost: number;
}

export class CartItemDto {
    @IsOptional()
    @IsString()
    cartId: string;

    @IsOptional()
    @IsString()
    productId: string;

    @IsOptional()
    @IsString()
    optionId: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}