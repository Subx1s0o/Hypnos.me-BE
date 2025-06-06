import { Process } from '@nestjs/bull';
import { BadGatewayException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { User } from 'types';
import { UserRepository } from '@/database/repositories/user.repository';

@Injectable()
export class ReferralProcessor {
  constructor(private readonly userRepository: UserRepository) {}

  @Process('processReferral')
  async processReferral(user: User) {
    try {
      await this.userRepository.update({
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
      await this.userRepository.update({
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
