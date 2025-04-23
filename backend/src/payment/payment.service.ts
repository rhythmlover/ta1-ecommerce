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
import { Auth } from "googleapis";
import { v2 as cloudinary } from "cloudinary";
import { PdfService, PdfFileOptions } from 'nestjs-html2pdf'

@Injectable()
export class PaymentService {
    private stripe: Stripe;
    private oAuth2Client: Auth.OAuth2Client;
    private readonly cloudinaryConfig = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    };

    constructor(private prisma: PrismaService,
        private configService: ConfigService,
        private orderService: OrderService,
        private productService: ProductService) {
        const isDevEnv = this.configService.get<string>("ENV") === 'development';
        const stripeSecretKey = isDevEnv ? this.configService.get<string>("STRIPE_SECRET_KEY_TEST") : this.configService.get<string>("STRIPE_SECRET_KEY_LIVE");
        if (isDevEnv) {
            console.log("Using Testing Stripe Secret Key")
        } else {
            console.log("Using Live Stripe Secret Key")
        }
        if (!stripeSecretKey) {
            throw new Error("STRIPE_SECRET_KEY (TEST/LIVE) is not defined in the environment variables");
        }
        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: "2025-03-31.basil" as any,
        });
        this.oAuth2Client = new Auth.OAuth2Client({
            clientId: this.configService.get<string>("CLIENT_ID"),
            clientSecret: this.configService.get<string>("CLIENT_SECRET"),
            redirectUri: this.configService.get<string>("REDIRECT_URI"),
        });
        this.oAuth2Client.setCredentials({
            refresh_token: this.configService.get<string>("REFRESH_TOKEN"),
        });
    }

    async createInvoice(receiptData: ReceiptData): Promise<void> {
        const templatePath = "src/payment/invoice-template.html";
        const pdfService = new PdfService();
        let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

        htmlTemplate = htmlTemplate
            .replace(/{{email}}/g, receiptData.email)
            .replace(/{{address}}/g, receiptData.address)
            .replace(/{{phone}}/g, receiptData.phone)
            .replace(/{{postal_code}}/g, receiptData.postalCode)
            .replace(/{{name}}/g, receiptData.name)
            .replace(/{{purchase_date}}/g, receiptData.purchaseDate)
            .replace(/{{receipt_id}}/g, receiptData.receiptId.slice(0, 13).toUpperCase())
            .replace(/{{subtotal}}/g, receiptData.totalCost.toFixed(2))
            .replace(/{{total}}/g, receiptData.totalCost.toFixed(2))
            .replace(/{{payment_method}}/g, receiptData.paymentMethod)
            .replace(/{{payment_date}}/g, receiptData.paymentDate)
            .replace(/{{shipping_fee}}/g, "0.00") // Hard-coded for shipping fee to be free of charge as for now
            .replace(/{{#each invoice_details}}([\s\S]*?){{\/each}}/g, (match, content) => {
                return receiptData.receiptItems
                    .map((detail: any) => {
                        return content
                            .replace(/{{description}}/g, detail.description)
                            .replace(/{{quantity}}/g, detail.quantity)
                            .replace(/{{price}}/g, detail.price.toFixed(2))
                            .replace(/{{item_total}}/g, (detail.price * detail.quantity).toFixed(2));
                    })
                    .join("");
            });
        const options: PdfFileOptions = {
            html: htmlTemplate,
            pdfOptions: {
                path: "src/payment/invoice.pdf",
                format: "A4",
                margin: {
                    top: "0.5in",
                    right: "0.5in",
                    bottom: "0.5in",
                    left: "0.5in",
                },
                printBackground: true,
            },
        }

        await pdfService.createPdf(options);
        console.log("PDF invoice created successfully for receipt ID: ", receiptData.receiptId);
    }

    async uploadInvoiceToCloudinary(invoice_id: string): Promise<string> {
        try {
            const { cloud_name, api_key, api_secret } = this.cloudinaryConfig;
            const filePath = "src/payment/invoice.pdf";
            cloudinary.config({
                cloud_name: cloud_name,
                api_key: api_key,
                api_secret: api_secret,
            });

            const result = await cloudinary.uploader.upload(filePath, {
                resource_type: "auto",
                public_id: "invoice-" + invoice_id,
                unique_filename: true,
                folder: "invoices",
                format: "pdf",
                overwrite: true,
            });

            fs.unlinkSync(filePath);
            console.log("Invoice uploaded to Cloudinary successfully: ", result.secure_url);
            return result.secure_url;
        } catch (error) {
            console.error("Error uploading invoice to Cloudinary:", error);
            throw new Error("Failed to upload invoice to Cloudinary");
        }
    }

    async getPayment(paymentId: string): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
            return paymentIntent;
        } catch (error) {
            console.error("Error retrieving payment intent:", error);
            throw new Error("Failed to retrieve payment intent");
        }
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

    async getCharge(chargeId: string): Promise<Stripe.Charge> {
        try {
            const charge = await this.stripe.charges.retrieve(chargeId);
            return charge;
        } catch (error) {
            console.error("Error retrieving charge:", error);
            throw new Error("Failed to retrieve charge");
        }
    }

    async handleStripeWebhook(signature: string, req: RawBodyRequest<Request>, res: Response): Promise<void> {
        let stripeWebhookSecret = "";
        if (this.configService.get<string>("ENV") === 'development') {
            stripeWebhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET_TEST");
            console.log("Using Testing Webhook Secret")
        } else {
            stripeWebhookSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET_LIVE");
            console.log("Using Live Webhook Secret")
        }
        const event = this.stripe.webhooks.constructEvent(req.rawBody, signature, stripeWebhookSecret);
        console.log("Received event: ", event.type);
        if (event.type === "payment_intent.succeeded") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("Payment Intent: ", paymentIntent);
            const order = await this.orderService.getOrder(paymentIntent.id, 10, 5000);
            const charge = await this.getCharge(paymentIntent.latest_charge as string);

            let paymentMethod = '';
            const paymentDate = new Date(charge.created * 1000).toLocaleString("en-SG", {
                timeZone: "Asia/Singapore",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            });

            switch (charge.payment_method_details?.type) {
                case 'card':
                    let brand = charge.payment_method_details?.card?.brand || '--';
                    brand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();

                    let last4 = charge.payment_method_details?.card?.last4 || '--';
                    paymentMethod = `${brand} ending in ${last4}`;
                    break;
                case 'paynow':
                    paymentMethod = 'PayNow';
                    break;
            }

            if (!order) {
                console.error("Order not found");
            }

            if (!order.email || !order.address || !order.phone || !order.postalCode) {
                await this.sendErrorEmail("Missing Order Information for Order ID: " + paymentIntent.id + ". Please contact Nigel to check with the Stripe Dashboard in case of a need for a refund.");
                console.error("Missing Order Information for Order ID: " + paymentIntent.id + ". Please contact Nigel to check with the Stripe Dashboard in case of a need for a refund.");
                return;
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
                    hour12: false,
                }),
                paymentMethod: paymentMethod,
                paymentDate: paymentDate,
                receiptId: order.id,
                totalCost: order.totalCost,
                receiptItems: await Promise.all(order.items.map(async (item) => ({
                    price: (await this.productService.getProduct(item.productId)).price * item.quantity,
                    description: (await this.productService.getProduct(item.productId)).name + "【" + (await this.productService.getProduct(item.productId)).options.find(option => option.id === item.optionId).name + "】",
                    quantity: item.quantity,
                }))),
            };
            console.log("Receipt Data: ", receiptData);
            await this.sendEmailReceipt(order.email, receiptData);
            await this.createInvoice(receiptData);
            await this.uploadInvoiceToCloudinary(receiptData.receiptId);
            res.status(201).send("Payment succeeded with ID: " + paymentIntent.id);
            console.log("PaymentIntent was successful: ", paymentIntent.id);
        } else if (event.type === "payment_intent.payment_failed") {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            res.status(400).send("Payment failed with ID: " + paymentIntent.id);
            console.warn("PaymentIntent failed: ", paymentIntent.id);
        } else {
            console.warn("Unhandled event type: ", event.type);
        }
    }

    async sendErrorEmail(error: string): Promise<void> {
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const infoEmailUser = this.configService.get<string>("INFO_EMAIL_USER");
        const emailClientID = this.configService.get<string>("CLIENT_ID");
        const emailClientSecret = this.configService.get<string>("CLIENT_SECRET");
        const refreshToken = this.configService.get<string>("REFRESH_TOKEN");
        const accessToken = await this.oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: emailUser,
                clientId: emailClientID,
                clientSecret: emailClientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken.token as string,
            },
            tls: {
                rejectUnauthorized: true,
            }
        } as SMTPTransport.Options);

        transporter.sendMail({
            from: infoEmailUser,
            to: infoEmailUser,
            subject: "TA1 Error: Missing Order Information",
            text: `Error: ${error}`,
        } as nodemailer.SendMailOptions, (err, info) => {
            if (err) {
                console.error(err);
            }
            console.log("Error email sent successfully", info.response);
        });
    }

    async sendEmailReceipt(emailToSend: string, receiptData: ReceiptData): Promise<void> {
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const infoEmailUser = this.configService.get<string>("INFO_EMAIL_USER");
        const emailClientID = this.configService.get<string>("CLIENT_ID");
        const emailClientSecret = this.configService.get<string>("CLIENT_SECRET");
        const refreshToken = this.configService.get<string>("REFRESH_TOKEN");
        const accessToken = await this.oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: emailUser,
                clientId: emailClientID,
                clientSecret: emailClientSecret,
                refreshToken: refreshToken,
                accessToken: accessToken.token as string,
            },
            tls: {
                rejectUnauthorized: true,
            }
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
            .replace(/{{payment_method}}/g, receiptData.paymentMethod)
            .replace(/{{payment_date}}/g, receiptData.paymentDate)
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
                from: infoEmailUser,
                to: emailToSend,
                subject: "TA1 E-Receipt",
                html: htmlTemplate,
            } as nodemailer.SendMailOptions,
            (err, info) => {
                if (err) {
                    console.error(err);
                }
                console.log("Email receipt sent successfully", info.response);
            }
        );
    }
}
