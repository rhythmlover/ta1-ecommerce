import { Controller, Param, Body, Post, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, ResetPasswordDto } from "./dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signUp(@Body() dto: AuthDto) {
        return this.authService.signUp(dto);
    }

    @Post('signin')
    signIn(@Body() dto: AuthDto) {
        return this.authService.signIn(dto);
    }

    @Post('request-password-reset')
    requestPasswordReset(@Body() dto: ResetPasswordDto) {
        return this.authService.requestPasswordReset(dto);
    }

    @Post('verify-reset-password/:id')
    verifyResetPassword(@Param("id") id: string) {
        return this.authService.verifyPasswordReset(id);
    }

    @Post('reset-password')
    resetPassword(@Body() body: { dto: AuthDto, id: string }) {
        return this.authService.resetPassword(body.dto, body.id);
    }

    @Post('request-email-verification/:email')
    requestEmailVerification(@Param("email") email: string) {
        return this.authService.requestEmailVerification(email);
    }

    @Post('verify-email')
    verifyUserEmail(@Body() body: { id: string, email: string }) {
        return this.authService.verifyEmail(body.id, body.email);
    }

    @Get('get-user-details/:id')
    getUserDetails(@Param("id") id: string) {
        return this.authService.getUserDetails(id);
    }
}