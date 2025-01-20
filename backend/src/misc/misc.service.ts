import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { InquiryDto } from "./dto";
import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class MiscService {
    constructor(private prisma: PrismaService, private configService: ConfigService) {}

    sendInquiry(dto: InquiryDto) {
        console.log("Sending email to", dto.email);
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const emailPassword = this.configService.get<string>("EMAIL_PASSWORD");
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: true,
                auth: {
                    user: emailUser,
                    pass: emailPassword,
                },
            } as SMTPTransport.Options);
    
            if (dto.orderNo === undefined) {
                dto.orderNo = "N/A";
            }

            transporter.sendMail(
                {
                    from: emailUser,
                    to: dto.email,
                    subject: "Inquiry Email from " + dto.name + ", Order No.: " + dto.orderNo,
                    html: dto.message,
                } as nodemailer.SendMailOptions,
                (err, info) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log("Email sent successfully", info.response);
                }
            );
            return { message: "Email sent successfully" };
        } catch (error) {
            console.error(error);
        }
    }
}
