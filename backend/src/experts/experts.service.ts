import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Expert, ExpertDocument } from '../common/schemas/experts.schema';
import { Model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginCredDTO } from 'src/common/dtos/login-cred.dto';
import { ExpertDTO } from 'src/common/dtos/expert.dto';
import { Interview, InterviewDocument } from 'src/common/schemas/interview.schema';

@Injectable()
export class ExpertsService {

    constructor(
        @InjectModel(Expert.name) private readonly expertModel: Model<ExpertDocument>,
        @InjectModel(Interview.name) private readonly interviewModel: Model<InterviewDocument>,
        private readonly jwtService: JwtService
    ) { }

    async expertLogin(expertData: LoginCredDTO): Promise<{
        token: string,
        expertData: {
            userId: Object,
            username: string,
            active: boolean
        }
    }> {
        try {
            const { email, password } = expertData;
            const expert = await this.expertModel.findOne({ email });
            if (!expert)
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            const passwordMatched = await compare(password, expert.password);
            if (!passwordMatched)
                throw new UnauthorizedException(`Email or password entered is incorrect`);
            const payload = { username: expert.fullname, sub: expert._id };
            return {
                token: this.jwtService.sign(payload),
                expertData: {
                    userId: expert._id,
                    username: expert.fullname,
                    active: expert.active
                }
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            console.log("Login Error:", error);
            throw new InternalServerErrorException(`Login Error`);
        }

    }

    async getExpert(expertId: string): Promise<Partial<ExpertDTO>> {
        try {
            const expert = await this.expertModel.findOne({ _id: expertId });
            return { fullname: expert.fullname, email: expert.email, specialization: expert.specialization, yearsOfExperience: expert.yearsOfExperience };
        } catch (error) {
            console.log("Expert Profile Loading Error:", error);
            throw new InternalServerErrorException(`Expert Profile Loading Error`);
        }

    }

    async updateExpert(expertId: string, updateData: Partial<ExpertDTO>): Promise<object> {
        try {
            const expert = await this.expertModel.findByIdAndUpdate(expertId, updateData, { new: true });
            return { id: expert._id }
        } catch (error) {
            console.log("Expert Profile Updation Error:", error);
            throw new InternalServerErrorException(`Expert Profile Updation Error`);
        }

    }

    async updateAvailability(expertId: string, slot: string): Promise<object> {
        try {
            const expert = await this.expertModel.findById(expertId);
            const newSlot = new Date(slot);

            const bookedSlots = expert.availability.some((existingSlot: Date) => {
                const existingSlotTime = new Date(existingSlot).getTime();
                const newSlotTime = newSlot.getTime();
                return Math.abs(existingSlotTime - newSlotTime) < 60 * 60 * 1000;
            });

            if (bookedSlots) {
                throw new ConflictException(`Slot already added!`);
            }

            const updateExpert = await this.expertModel.findByIdAndUpdate(expertId, { $push: { availability: newSlot } });
            return updateExpert.availability;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            console.log("Expert Slot Updation Error:", error);
            throw new InternalServerErrorException(`Expert Slot Updation Error`);
        }

    }

    async loadDashboard(expertId: string): Promise<Object> {
        try {
            const expert = await this.expertModel.findOne({ _id: expertId });
            const interviews = await this.interviewModel.find({
                expertId: expert._id,
                $or: [
                    { status: "scheduled" },
                    { status: "active" },
                ]
            }).sort({time: 1})
            return { interviews, expert };
        } catch (error) {
            console.log("Interviews Loading Error:", error);
            throw new InternalServerErrorException(`Interviews Loading Error`);
        }
    }

    async submitFeedback(interviewId: string, feedback: any): Promise<string> {
        try {
            return `Feedback for interview ${interviewId} submitted.`;
        } catch (error) {
            console.log("Submitting Feedback Error:", error);
            throw new InternalServerErrorException(`Submitting Feedback Error`);
        }
    }
}