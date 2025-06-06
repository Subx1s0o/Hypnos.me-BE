import { ReferralProcessor } from './referrals/referral.processor';
import { ViewedProcessor } from './products/processors/viwed.processor';

export const WORKER_PROCESSORS = [ReferralProcessor, ViewedProcessor];

export const WORKER_SCHEDULERS = [];
