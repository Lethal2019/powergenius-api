import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

    async signIn(username: string, pass: string): Promise<{ access_token: string, user: Partial<User>}> {
        const user = await this.userService.findOne(username);

        if (!user) {
            throw new UnauthorizedException('user not found');
        }

        const res = await bcrypt.compare(pass, user?.password);

        if(!res) {
            throw new UnauthorizedException
            ('username or password does not match');            
        }
        const payload = { sub: user.id, username: user.username };

        console.log("Returning user:", user);
        const { password, ...userWithoutPassword } = user ?? {};
        return {
          access_token: await this.jwtService.signAsync(payload),
          user: userWithoutPassword,
        };


        return {
            access_token: await this.jwtService.signAsync(payload),
            user: userWithoutPassword,
        };
    }

    async sendPasswordResetEmail(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
    
        const token = await this.jwtService.signAsync(
          { sub: user.id },
          { expiresIn: '15m' }
        );

    // Integrate with an email service like nodemailer or SendGrid
    console.log(`Password reset link: http://localhost:3000/reset-password?token=${token}`);

    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updatePassword(payload.sub, hashedPassword);
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
