import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { InquiryDto } from "./dto";
import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { Auth } from "googleapis";

@Injectable()
export class MiscService {
    private oAuth2Client: Auth.OAuth2Client;

    constructor(private prisma: PrismaService, private configService: ConfigService) {
        this.oAuth2Client = new Auth.OAuth2Client({
            clientId: this.configService.get<string>("CLIENT_ID"),
            clientSecret: this.configService.get<string>("CLIENT_SECRET"),
            redirectUri: this.configService.get<string>("REDIRECT_URI"),
        });
        this.oAuth2Client.setCredentials({
            refresh_token: this.configService.get<string>("REFRESH_TOKEN"),
        });
    }

    async sendInquiry(dto: InquiryDto) {
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
            },
        } as SMTPTransport.Options);

        if (dto.orderNo === '') {
            dto.orderNo = "N/A";
        }

        const inquiryHtml = `
            <h2>Inquiry Email from ${dto.name}</h2>
            <p><b>Order No.:</b> ${dto.orderNo}</p>
            <p><b>Email:</b> ${dto.email}</p><br>
            <p>${dto.message}</p>
        `;

        transporter.sendMail(
            {
                from: infoEmailUser,
                to: infoEmailUser,
                subject: "Inquiry Email from " + dto.name + ", Order No.: " + dto.orderNo,
                html: inquiryHtml,
            } as nodemailer.SendMailOptions,
            (err, info) => {
                if (err) {
                    console.error(err);
                }
                console.log("Email inquiry sent successfully", info.response);
            }
        );

        const userCopyInquiryHtml = `
            <h2>Hi ${dto.name}. We have received your message and will get back to you soon.</h2>
            <p><b>Order No.:</b> ${dto.orderNo}</p>
            <p><b>Email:</b> ${dto.email}</p>
            <p><b>Message:</b></p>
            <p>${dto.message}</p><br>
            <p>Cheers,</p>
            <p>Together As One</p>
        `;

        transporter.sendMail(
            {
                from: infoEmailUser,
                to: dto.email,
                subject: "Thank you for your inquiry.",
                html: userCopyInquiryHtml,
            } as nodemailer.SendMailOptions,
            (err, info) => {
                if (err) {
                    console.error(err);
                }
                console.log("Email inquiry customer copy sent successfully", info.response);
            }
        );
        return { message: "Email sent successfully" };
    }

    async getAnnouncement() {
        return await this.prisma.announcement.findUnique({
            where: { id: "cm8oxpozl0000ubysly7ozorg" },
            select: { content: true },
        });
    }
}
