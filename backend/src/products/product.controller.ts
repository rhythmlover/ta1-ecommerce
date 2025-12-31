import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDto } from "./dto";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { AdminGuard } from "src/auth/guard/admin.guard";

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('get-all')
    getProducts() {
        return this.productService.getProducts();
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Post('add')
    addProduct(@Body() dto: ProductDto) {
        return this.productService.addProduct(dto);
    }

    @Get('get/:id')
    getProduct(@Param('id') id: string) {
        return this.productService.getProduct(id);
    }

    @Get('get-by-handle/:handle')
    getProductByHandle(@Param('handle') handle: string) {
        return this.productService.getProductByHandle(handle);
    }
}
