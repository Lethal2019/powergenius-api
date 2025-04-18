import { Body, Controller, Delete, Get, Param, Post, NotFoundException, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Public } from 'src/auth/SkipAuth';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

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
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':username')
  async update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateByUsername(
      username,
      updateUserDto,
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  @Public()
  @Delete(':username')
  async delete(@Param('username') username: string): Promise<{ message: string }> {
    await this.userService.delete(username);
    return { message: `User with username ${username} has been successfully deleted.` };
  }
}
