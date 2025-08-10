import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class OrderDto {
    @IsString()
    @IsOptional()
    userId?: string;

    @IsString()
    @IsOptional()
    sessionId?: string;

    @IsString()
    @IsNotEmpty()
    paymentId: string;

    @IsNumber()
    @IsNotEmpty()
    totalCost: number;

    @IsNumber()
    @IsNotEmpty()
    shippingFee: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    postalCode: string;

    @IsNotEmpty()
    items: OrderItemDto[];
}

export class OrderItemDto {
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