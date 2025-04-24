import { Controller, Body, Post, Headers, Req, Res, RawBodyRequest } from "@nestjs/common";
import { Request, Response } from 'express';
import { PaymentService } from "./payment.service";
// import { ReceiptData } from "src/types";

@Controller("payment")
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post('get-payment-intent')
    async getPaymentIntent(@Body() body: { paymentIntentId: string }) {
        const res_Obj = await this.paymentService.getPayment(body.paymentIntentId);
        return res_Obj;
    }

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        const res_Obj = await this.paymentService.createPayment(body.amount);
        return res_Obj;
    }

    @Post('get-payment-method')
    async getPaymentMethod(@Body() body: { paymentMethodId: string }) {
        const res_Obj = await this.paymentService.getPaymentMethod(body.paymentMethodId);
        return res_Obj;
    }
    
    @Post('get-charge')
    async getCharge(@Body() body: { chargeId: string }) {
        const res_Obj = await this.paymentService.getCharge(body.chargeId);
        return res_Obj;
    }

    @Post('stripe-webhook')
    async stripeWebhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>, @Res() res: Response) {
        await this.paymentService.handleStripeWebhook(signature, req, res);
        return { received: true };
    }

    // @Post('test-invoice')
    // async testInvoice(@Body() body: { receiptData: ReceiptData }) {
    //     const res_Obj = await this.paymentService.testInvoice(body.receiptData);
    //     return res_Obj;
    // }
}