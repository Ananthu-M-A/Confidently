import { Body, Controller, Get, Param, Patch, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Expert } from '../common/schemas/experts.schema';
import { ExpertsService } from './experts.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { LoginCredDTO } from 'src/common/dtos/login-cred.dto';

@Controller('api/expert')
export class ExpertsController {
    constructor(
        private readonly expertsService: ExpertsService,
        private readonly configService: ConfigService
    ) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async authenticateExpert(@Request() req) {
        if (!req.user) {
            throw new UnauthorizedException(`Expert not found`);
        }
        return req.user;
    }

    @Post('login')
    async expertLogin(@Body() expertData: LoginCredDTO) {
        return this.expertsService.expertLogin(expertData);
    }

    @Get('profile/:expertId')
    async getExpert(@Param('expertId') expertId: string) {
        return this.expertsService.getExpert(expertId);
    }

    @Put('profile/:expertId')
    async updateExpert(
        @Param('expertId') expertId: string,
        @Body() expertData: Partial<Expert>) {
        return this.expertsService.updateExpert(expertId, expertData);
    }

    @Patch('availability/:expertId')
    async updateAvailability(
        @Request() req,
        @Body('availability') slot: string,
        @Param('expertId') expertId: string) {
        return this.expertsService.updateAvailability(expertId, slot);
    }

    @Get('dashboard/:expertId')
    async loadDashboard(@Param('expertId') expertId: string) {
        return this.expertsService.loadDashboard(expertId);
    }

    @Post('interviews/:interview_id/feedback')
    async submitFeedback(
        @Param('interview_id') interviewId: string,
        @Body('feedback') feedback: any
    ) {
        return this.expertsService.submitFeedback(interviewId, feedback);
    }
}