import { Controller, Body, Post, Headers, Req, RawBodyRequest } from "@nestjs/common";
import { Request } from 'express';
import { PaymentService } from "./payment.service";
import { ReceiptData } from "src/types";

@Controller("payment")
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        const res_Obj = await this.paymentService.createPayment(body.amount);
        return res_Obj;
    }

    @Post('stripe-webhook')
    async stripeWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
        await this.paymentService.handleStripeWebhook(signature, req);
        return { received: true };
    }

    @Post('send-email-after-payment')
    async sendEmailAfterPayment(@Body() body: { email: string, receiptData: ReceiptData }) {
        this.paymentService.sendEmailReceipt(body.email, body.receiptData);
    }
}