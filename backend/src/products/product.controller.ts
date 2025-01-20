import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDto } from "./dto";

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('get-all')
    getProducts() {
        return this.productService.getProducts();
    }

    @Post('add')
    addProduct(@Body() dto: ProductDto) {
        return this.productService.addProduct(dto);
    }

    @Get('get/:id')
    getProduct(@Param('id') id: string) {
        return this.productService.getProduct(id);
    }
}
