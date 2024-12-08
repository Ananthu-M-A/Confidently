import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../common/schemas/admin.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Expert, ExpertDocument } from 'src/common/schemas/experts.schema';
import { User, UserDocument } from 'src/common/schemas/users.schema';
import { EmailService } from 'src/email/email.service';
import { Interview, InterviewDocument } from 'src/common/schemas/interview.schema';
import { ConfigService } from '@nestjs/config';
import { LoginCredDto } from 'src/common/dto/login-cred.dto';
import { StatsDto } from 'src/common/dto/stats.dto';

@Injectable()
export class AdminService {

    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
        @InjectModel(Expert.name) private readonly expertModel: Model<ExpertDocument>, @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Interview.name) private readonly interviewModel: Model<InterviewDocument>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService) { }


    async adminLogin(adminData: LoginCredDto): Promise<string> {
        try {
            const { email, password } = adminData;
            const admin = await this.adminModel.findOne({ email });
            if (!admin) {
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            }
            const passwordMatched = await compare(password, admin.password);
            if (!passwordMatched) {
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            }
            const payload = { username: admin.email, sub: admin._id };
            const token = this.jwtService.sign(payload);
            return token;
        } catch (error) {
            console.log("Login Error:", error);
            throw new InternalServerErrorException(`Login Error`)
        }
    }

    async getUsers(): Promise<User[]> {
        let users = await this.userModel.find({},
            { _id: 0, fullname: 1, email: 1, subscription: 1, active: 1 });
        if (!users) {
            return [];
        }
        return users;
    }

    async updateUserStatus(userData: Partial<LoginCredDto>): Promise<Partial<LoginCredDto>> {
        try {
            const { email } = userData;
            let existingUser = await this.userModel.findOne({ email });
            if (!existingUser) {
                throw new NotFoundException(`User not found`);
            }
            Object.assign(existingUser, { active: !existingUser.active });
            await existingUser.save();
            return { email: existingUser.email };
        } catch (error) {
            console.log("User Status Updation Error:", error);
            throw new InternalServerErrorException(`User Status Updation Error`);
        }

    }

    async getExperts(): Promise<Expert[]> {
        let experts = await this.expertModel.find({},
            { _id: 0, fullname: 1, email: 1, specialization: 1, active: 1 });
        if (!experts) {
            return [];
        }
        return experts;
    }

    async updateExpertStatus(expertData: Partial<LoginCredDto>): Promise<Partial<LoginCredDto>> {
        try {
            const { email } = expertData;
            let existingExpert = await this.expertModel.findOne({ email });
            if (!existingExpert) {
                throw new NotFoundException(`Expert not found`);
            }
            Object.assign(existingExpert, { active: !existingExpert.active });
            await existingExpert.save();
            return { email: existingExpert.email };
        } catch (error) {
            console.log("Expert Status Updation Error:", error);
            throw new InternalServerErrorException(`Expert Status Updation Error`);
        }

    }

    async addExpert(expertData: Partial<Expert>): Promise<Expert> {
        const { email, fullname, yearsOfExperience } = expertData;
        let existingExpert = await this.expertModel.findOne({ email });
        if (existingExpert) {
            throw new Error("Email already exists");
        }
        const password = "Expert@" + yearsOfExperience + fullname.substring(0, 3);
        const hashedPassword = await hash(password, 10);
        await this.emailService.sendExpertMail(email, password);
        Object.assign(expertData, { password: hashedPassword })
        const newExpert = new this.expertModel(expertData);
        await newExpert.save();
        return (newExpert);
    }

    getInterviewData() {

    }

    async getStatistics(): Promise<StatsDto> {
        const totalUsers = await this.userModel.countDocuments();
        const totalExperts = await this.expertModel.countDocuments();
        const totalInterviews = await this.interviewModel.countDocuments();
        const totalProUsers = await this.userModel.find({ subscription: true }).countDocuments();
        const avgRating = 4.5;
        const totalRevanue = totalProUsers * this.configService.get<number>('SUBSCRIPTION_FEE');
        return { totalUsers, totalExperts, totalInterviews, avgRating, totalRevanue };
    }
}
