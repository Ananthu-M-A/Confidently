import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/common/schemas/users.schema';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async registerUser(userData: Partial<User>): Promise<{ user: Partial<UserDocument>; token: string }> {
        const { email } = userData;
        let user = await this.userModel.findOne({ email });
        if (user) {
            Object.assign(user, userData);
            await user.save();
            throw new Error("Email already exists");
        } else {
            user = new this.userModel(userData);
            await user.save();
        }
        const payload = { username: user.fullname, sub: user._id };
        return {
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                subscription: user.subscription,
                active: user.active
            },
            token: this.jwtService.sign(payload)
        };
    }

    async loginUser(userData: Partial<User>): Promise<Object> {
        const { email, password } = userData;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return null;
        }
        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            return null;
        }
        const payload = { username: user.fullname, sub: user._id };
        return { token: this.jwtService.sign(payload) };
    }

    async logoutUser(email: string): Promise<String> {
        return "User logged out"
    }

    async resetUser(userData: Partial<User>): Promise<String> {
        const { email } = userData;
        let user = await this.userModel.findOne({ email });
        if (user) {
            Object.assign(user, { password: this.configService.get<string>('CONFIDENTLY_DEFAULT_PASSWORD') });
            await user.save();

            return "Password reset email sent";
        } else {
            return "User not found";
        }
    }

    async validateUser(userData: Partial<User>): Promise<object> {
        const { email, password } = userData;
        const existingUser = await this.userModel.findOne({ email });
        if (!existingUser) {
            return null;
        }
        const passwordMatched = await compare(password, existingUser.password);

        if (!passwordMatched) {
            return null;
        }
        return { username: existingUser.email, id: existingUser._id };
    }
}
