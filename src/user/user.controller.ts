import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Public } from 'src/auth/SkipAuth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Public()
  @Get(':username')
  findOne(@Param('username') username: string): Promise<User> {
    return this.userService.findOne(username);
  }

  @Public()
  @Post()
  create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Public()
  @Delete(':username')
  async delete(@Param('username') username: string): Promise<{ message: string }> {
    await this.userService.delete(username);
    return { message: `User with username ${username} has been successfully deleted.` };
  }
}
