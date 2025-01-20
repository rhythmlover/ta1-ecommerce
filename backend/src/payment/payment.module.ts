import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { OrderModule } from "src/order/order.module";
import { ProductModule } from "src/products/product.module";

@Module({
    imports: [OrderModule, ProductModule],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}