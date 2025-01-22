import { Injectable, RawBodyRequest } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderService } from "../order/order.service";
import { ProductService } from "../products/product.service";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { ReceiptData } from "../types";
import { Request, Response } from "express";
import Stripe from "stripe";
import * as fs from "fs";

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(private prisma: PrismaService, 
                private configService: ConfigService, 
                private orderService: OrderService, 
                private productService: ProductService) {
        const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY");
        if (!stripeSecretKey) {
            throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables");
        }
        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: "2023-10-16; custom_checkout_beta=v1" as any,
        });
    }

    async createPayment(amountPaid: number): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amountPaid,
                currency: "sgd",
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return paymentIntent;
        } catch (error) {
            console.error("Error creating Stripe Checkout session:", error);
            throw new Error("Failed to create payment session");
        }
    }

    async handleStripeWebhook(signature: string, req: RawBodyRequest<Request>, res: Response): Promise<void> {
        const endpointSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");
        const webUrl = this.configService.get<string>("WEB_URL");
        if (!endpointSecret) {
            throw new Error("STRIPE_WEBHOOK_SECRET is not defined in the environment variables");
        }
        const event = this.stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);

        console.log("Received event:", event.type);
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            // console.log("Payment Intent: ", paymentIntent);
            const order = await this.orderService.getOrder(paymentIntent.id, 10, 5000);
            // console.log("Order: ", order);
            if (!order) {
                console.error("Order not found");
            }
            const receiptData: ReceiptData = {
                name: order.name,
                email: order.email,
                address: order.address,
                phone: order.phone,
                postalCode: order.postalCode,
                purchaseDate: new Date().toLocaleString("en-SG", {
                    timeZone: "Asia/Singapore",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                }),
                receiptId: order.id,
                totalCost: order.totalCost,
                receiptItems: await Promise.all(order.items.map(async (item) => ({
                    price: (await this.productService.getProduct(item.productId)).price * item.quantity,
                    description: (await this.productService.getProduct(item.productId)).name + "【" + (await this.productService.getProduct(item.productId)).options.find(option => option.id === item.optionId).name + "】",
                    quantity: item.quantity,
                }))),
            };
            console.log("Receipt Data: ", receiptData);
            this.sendEmailReceipt(order.email, receiptData);
            console.log("PaymentIntent was successful:", paymentIntent.id);
        } else if (event.type === "payment_intent.payment_failed") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            res.redirect(`${webUrl}/payment-failed?pid=${paymentIntent.id}`);
            console.log("PaymentIntent failed:", paymentIntent.id);
        } else {
            console.warn("Unhandled event type:", event.type);
        }
    }

    sendEmailReceipt(emailToSend: string, receiptData: ReceiptData): void {
        console.log("WHY IS THIS NOT WORKING");
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const emailPassword = this.configService.get<string>("EMAIL_PASSWORD");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPassword,
            },
        } as SMTPTransport.Options);

        const templatePath = "src/payment/receipt-template.html";
        let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

        htmlTemplate = htmlTemplate
            .replace(/{{email}}/g, receiptData.email)
            .replace(/{{address}}/g, receiptData.address)
            .replace(/{{phone}}/g, receiptData.phone)
            .replace(/{{postal_code}}/g, receiptData.postalCode)
            .replace(/{{name}}/g, receiptData.name)
            .replace(/{{purchase_date}}/g, receiptData.purchaseDate)
            .replace(/{{receipt_id}}/g, receiptData.receiptId.slice(0, 13).toUpperCase())
            .replace(/{{total}}/g, receiptData.totalCost.toFixed(2))
            .replace(/{{#each receipt_details}}([\s\S]*?){{\/each}}/g, (match, content) => {
                return receiptData.receiptItems
                    .map((detail: any) => {
                        return content
                            .replace(/{{description}}/g, detail.description)
                            .replace(/{{quantity}}/g, detail.quantity)
                            .replace(/{{price}}/g, detail.price.toFixed(2));
                    })
                    .join("");
            });

        transporter.sendMail(
            {
                from: emailUser,
                to: emailToSend,
                subject: "TA1 E-Receipt",
                html: htmlTemplate,
            } as nodemailer.SendMailOptions,
            (err, info) => {
                if (err) {
                    console.error(err);
                }
                console.log("Email sent successfully", info.response);
            }
        );
    }
}
