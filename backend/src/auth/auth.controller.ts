import { Body, Controller, Get, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from 'src/common/schemas/users.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }

    @Post('register')
    async userRegister(@Body() userData: User) {
        return this.authService.userRegister(userData);
    }

    @Post('login')
    async userLogin(@Body() userData: Partial<object>) {
        return this.authService.userLogin(userData);
    }

    @Post('reset-password')
    async resetPassword(@Body() userData: Partial<User>) {
        return this.authService.resetPassword(userData);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async authenticateUser(@Request() req) {
        return req.user;
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const { firstName, lastName, email } = req.user;
        try {
            const result = await this.authService.userRegister({
                fullname: `${firstName} ${lastName}`,
                email,
                password: this.configService.get<string>('CONFIDENTLY_DEFAULT_PASSWORD'),
                subscription: false,
                active: true
            });
            const frontendURL = this.configService.get<string>('FRONTEND_URL');
            const redirectUrl = new URL(`${frontendURL}/auth/callback`);
            redirectUrl.searchParams.append('token', result.token);
            redirectUrl.searchParams.append('user', JSON.stringify(result.user));
            res.redirect(redirectUrl.toString());
        } catch (error) {
            const frontendURL = this.configService.get<string>('FRONTEND_URL');
            const errorUrl = new URL(`${frontendURL}/auth/callback`);
            errorUrl.searchParams.append('error', error.message);
            res.redirect(errorUrl.toString());
        }
    }

    @Get('linkedin')
    @UseGuards(AuthGuard('linkedin'))
    async linkedinLogin() {
        console.log("1111111111111");
    }

    @Get('linkedin/callback')
    @UseGuards(AuthGuard('linkedin'))
    async linkedinLoginCallback(@Req() req) {
        console.log("222222222222");
        return { user: req.user };
    }
}
