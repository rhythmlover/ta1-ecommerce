import { Controller, Param, Body, Post, Get, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderDto } from "./dto";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { AdminGuard } from "src/auth/guard/admin.guard";

@Controller("order")
export class OrderController {
    constructor(private orderService: OrderService) {}
    
    @Post('create')
    createOrderInfo(@Body() orderInfo: OrderDto) {
        return this.orderService.createOrder(orderInfo);
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Get('get-all')
    getAllOrders() {
        return this.orderService.getAllOrders();
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Post('update-order-fulfilled/:orderId')
    updateOrderToFulfilled(@Param("orderId") orderId: string) {
        return this.orderService.updateOrderToFulfilled(orderId);
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

    @UseGuards(JwtGuard, AdminGuard)
    @Post('send-order-to-inhouse-email/:paymentId')
    sendToInhouseEmail(@Param("paymentId") paymentId: string) {
        return this.orderService.sendOrderToInHouseEmail(paymentId);
    }

    @UseGuards(JwtGuard)
    @Get('get-orders-by-user/:userId')
    getOrdersByUser(@Param("userId") userId: string) {
        return this.orderService.getOrdersByUser(userId);
    }
}