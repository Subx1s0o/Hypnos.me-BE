import { PrismaService } from '@lib/common';
import { Process, Processor } from '@nestjs/bull';
import { BadGatewayException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { Job } from 'bull';
import { User } from 'src/types';

@Injectable()
@Processor('referral-queue')
export class ReferralProcessor {
  constructor(private readonly prisma: PrismaService) {}

  @Process('processReferral')
  async processReferral(job: Job<{ user: User }>) {
    const { user } = job.data;

    try {
      await this.prisma.users.update({
        where: { id: user.referredBy },
        data: {
          bonuses: { increment: 20 },
          bonusesHistory: {
            push: {
              receivedDate: new Date(),
              amount: 20,
              description: 'Somebody used your referral code!',
            },
          },
        },
      });
    } catch (error) {
      throw new BadGatewayException('Error while updating bonuses to referrer');
    }

    try {
      await this.prisma.users.update({
        where: { id: user.id },
        data: {
          bonuses: { increment: 20 },
          bonusesHistory: {
            push: {
              receivedDate: new Date(),
              amount: 20,
              description: 'Added from redeeming referral code',
            },
          },
        },
      });
    } catch (error) {
      throw new BadGatewayException('Error while updating bonuses to user');
    }
  }
}
