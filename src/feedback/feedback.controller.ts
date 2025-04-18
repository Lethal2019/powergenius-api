import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './create-feedback.dto';
import { Public } from 'src/auth/SkipAuth';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Public()
  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.feedbackService.findOne(+id);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.feedbackService.delete(+id);
  }
}
