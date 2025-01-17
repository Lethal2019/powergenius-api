import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Public } from 'src/auth/SkipAuth';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Public()
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('username') username: string): Promise<User> {
        return this.userService.findOne(username);
    }

    @Public()
    @Post()
    create(@Body() user: User): Promise<User> {
        return this.userService.create(user);
    }
    @Delete()
    remove(@Param('username') username: string): Promise<void> {
        return this.userService.removeEventListener(username);
    }
}
