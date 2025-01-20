import { Controller, Param, Body, Post } from "@nestjs/common";
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
}