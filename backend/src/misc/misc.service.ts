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

        if (dto.orderNo === undefined) {
            dto.orderNo = "N/A";
        }

        transporter.sendMail(
            {
                from: dto.email,
                to: emailUser,
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
    }
}
