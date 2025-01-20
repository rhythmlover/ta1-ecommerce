import { IsString, IsNumber, IsUrl, IsNotEmpty } from 'class-validator';

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    handle: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;
}