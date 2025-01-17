import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

type TUser = {
    username: string,
    email: string,
    phone_number: number,
    password: string,
}
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        ){}

        findAll(): Promise<User[]> {
            return this.userRepository.find();
        }

        findOne(username: string): Promise<User | null> {
            return this.userRepository.findOneBy({ username });
        }

        async create(user: TUser): Promise<User | null> {
            if(user['password']){

                const salt = await bcrypt.genSalt(10);

                const hashedPassword = await bcrypt.hash(user['password'], salt);

                const {password, ...otherProperties} = user;
                return this.userRepository.save({password: hashedPassword, ...otherProperties});
            }
            return this.userRepository.save(user);
        }

        findUsernameNopassword(username: string): Promise<User | null> {
            return this.userRepository.findOne({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    phone_number: true,
                    password: false,
                },
                where:{username}
            });
        }
        async removeEventListener(username: string): Promise <void> {
            await this.userRepository.delete(username);
        }

}