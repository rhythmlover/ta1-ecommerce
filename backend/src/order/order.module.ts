import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { ProductModule } from "src/products/product.module";

@Module({
    exports: [OrderService],
    imports: [ProductModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}