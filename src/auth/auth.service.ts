import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async signIn(username: string, pass: string): Promise<{ access_token: string}> {
        const user = await this.userService.findOne(username);

        if (!user) {
            throw new UnauthorizedException('user not found');
        }

        const res = await bcrypt.compare(pass, user?.password);

        if(!res) {
            throw new UnauthorizedException('username or password does not match');
        }
        const payload = { sub: user.id, username: user.username };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
