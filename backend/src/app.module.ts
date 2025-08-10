import { Module } from "@nestjs/common";
import { ProductModule } from "./products/product.module";
import { PrismaModule } from "./prisma/prisma.module";
import { CartModule } from "./cart/cart.module";
import { AuthModule } from "./auth/auth.module";
import { PaymentModule } from "./payment/payment.module";
import { OrderModule } from "./order/order.module";
import { MiscModule } from "./misc/misc.module";
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        ProductModule,
        PrismaModule,
        CartModule,
        AuthModule,
        PaymentModule,
        OrderModule,
        MiscModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
    ],
})
export class AppModule {}
