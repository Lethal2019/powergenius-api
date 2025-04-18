import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback.entity';
import { CreateFeedbackDto } from './create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  createFeedback(dto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(dto);
    return this.feedbackRepository.save(feedback);
  }

  findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({ order: { date_received: 'DESC' } });
  }

  findOne(id: number): Promise<Feedback> {
    return this.feedbackRepository.findOneBy({ id });
  }

  async delete(id: number): Promise<void> {
    await this.feedbackRepository.delete(id);
  }
}
