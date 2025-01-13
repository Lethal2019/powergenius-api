import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        ){}

        findAll(): Promise<User[]> {
            return this.userRepository.find();
        }

        findOne(id: number): Promise<User> {
            return this.userRepository.findOneBy({ id });
        }

        create(user: User): Promise<User> {
            return this.userRepository.save(user);
        }

        async removeEventListener(id: number): Promise <void> {
            await this.userRepository.delete(id);
        }

}