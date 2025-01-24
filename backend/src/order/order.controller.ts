import { Controller, Param, Body, Post, Get } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dto";

@Controller("order")
export class OrderController {
    constructor(private orderService: OrderService) {}
    
    @Post('create')
    createOrderInfo(@Body() orderInfo: OrderDto) {
        return this.orderService.createOrder(orderInfo);
    }

    @Get('get/:paymentId')
    getOrderInfo(@Param("paymentId") paymentId: string) {
        return this.orderService.getOrder(paymentId);
    }

    @Get('get-order-id/:paymentId')
    getOrderId(@Param("paymentId") paymentId: string) {
        return this.orderService.getOrderId(paymentId);
    }

    @Get('get-order-timestamp/:paymentId')
    getOrderTimestamp(@Param("paymentId") paymentId: string) {
        return this.orderService.getOrderTimestamp(paymentId);
    }

    @Post('send-order-to-inhouse-email/:paymentId')
    sendToInhouseEmail(@Param("paymentId") paymentId: string) {
        return this.orderService.sendOrderToInHouseEmail(paymentId);
    }
}