import { IsString, IsNotEmpty, IsNumber, IsOptional, isString } from "class-validator";

export class InquiryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsString()
    orderNo: string;
}