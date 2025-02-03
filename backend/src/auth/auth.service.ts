import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { AuthDto, ResetPasswordDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import * as argon from "argon2";
import { Auth } from "googleapis";

@Injectable()
export class AuthService {
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

    async signUp(dto: AuthDto) {
        const hash = await argon.hash(dto.password);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email.toLowerCase(),
                    password: hash,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                },
            });

            await this.requestEmailVerification(user.email);

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Email already in use.");
                }
            }
            throw error;
        }
    }

    async signIn(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email.toLowerCase(),
            },
        });

        if (!user) {
            throw new ForbiddenException("No such account found.");
        }

        const valid = await argon.verify(user.password, dto.password);

        if (!user.verified) {
            throw new ForbiddenException("Email not verified.");
        }

        if (!valid) {
            throw new ForbiddenException("Invalid account or password.");
        }

        delete user.password;
        return user;
    }

    async requestEmailVerification(email: string) {
        const emailObj = await this.prisma.emailVerification.create({
            data: {
                email: email.toLowerCase(),
                expiresAt: new Date(Date.now() + 600000),
            },
            select: {
                id: true,
                email: true,
            },
        });

        await this.sendEmailVerificationEmail(emailObj.email, emailObj.id);
        return { message: "Email sent successfully" };
    }

    async sendEmailVerificationEmail(email: string, id: string) {
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const emailClientID = this.configService.get<string>("CLIENT_ID");
        const emailClientSecret = this.configService.get<string>("CLIENT_SECRET");
        const refreshToken = this.configService.get<string>("REFRESH_TOKEN");
        const webUrl = this.configService.get<string>("WEB_URL");
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

        transporter.sendMail(
            {
                from: emailUser,
                to: email,
                subject: "TA1 Email Verification",
                html: `<a href="${webUrl}/verify-email?id=${id}&email=${email}">Click here to verify email</a>`,
            } as nodemailer.SendMailOptions,
            (err, info) => {
                if (err) {
                    console.error(err);
                }
                console.log("Email sent successfully", info.response);
            }
        );
    }

    async verifyEmail(id: string, email: string) {
        const emailVerification = await this.prisma.emailVerification.findUnique({
            where: {
                id,
            },
        });

        if (!emailVerification) {
            throw new ForbiddenException("Invalid request.");
        }

        if (emailVerification.validated) {
            throw new ForbiddenException("Request has already been validated.");
        }

        if (emailVerification.expiresAt < new Date()) {
            throw new ForbiddenException("Request expired.");
        }

        await this.prisma.user.update({
            where: {
                email: email.toLowerCase(),
            },
            data: {
                verified: true,
            },
        });

        await this.prisma.emailVerification.update({
            where: {
                id,
            },
            data: {
                validated: true,
            },
        });

        return { message: "Verification Successful" };
    }

    async requestPasswordReset(dto: ResetPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email.toLowerCase(),
            },
        });

        if (!user) {
            throw new ForbiddenException("No such account found.");
        }

        const emailObj = await this.prisma.forgetPassword.create({
            data: {
                email: user.email.toLowerCase(),
                expiresAt: new Date(Date.now() + 600000),
            },
            select: {
                id: true,
                email: true,
            },
        });

        this.sendForgetPasswordEmail(emailObj.email, emailObj.id);
        return { message: "Email sent successfully" };
    }

    async sendForgetPasswordEmail(email: string, id: string) {
        const emailUser = this.configService.get<string>("EMAIL_USER");
        const emailClientID = this.configService.get<string>("CLIENT_ID");
        const emailClientSecret = this.configService.get<string>("CLIENT_SECRET");
        const refreshToken = this.configService.get<string>("REFRESH_TOKEN");
        const webUrl = this.configService.get<string>("WEB_URL");
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

        transporter.sendMail(
            {
                from: emailUser,
                to: email,
                subject: "TA1 Forget Password Request",
                html: `<a href="${webUrl}/reset-password?id=${id}&email=${email}">Click here to reset password</a>`,
            } as nodemailer.SendMailOptions,
            (err, info) => {
                if (err) {
                    console.error(err);
                }
                console.log("Email sent successfully", info.response);
            }
        );
    }

    async verifyPasswordReset(id: string) {
        const forgetPasswordReq = await this.prisma.forgetPassword.findUnique({
            where: {
                id,
            },
        });

        if (!forgetPasswordReq) {
            throw new ForbiddenException("Invalid request.");
        }

        if (forgetPasswordReq.validated) {
            throw new ForbiddenException("Request has already been validated.");
        }

        if (forgetPasswordReq.expiresAt < new Date()) {
            throw new ForbiddenException("Request expired.");
        }

        return { message: "Verification Successful" };
    }

    async resetPassword(dto: AuthDto, id: string) {
        console.log(dto.password);
        const hash = await argon.hash(dto.password);

        await this.prisma.user.update({
            where: {
                email: dto.email.toLowerCase(),
            },
            data: {
                password: hash,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        await this.prisma.forgetPassword.update({
            where: {
                id: id,
            },
            data: {
                validated: true,
            },
        });

        return { message: "Password reset successful" };
    }
}
