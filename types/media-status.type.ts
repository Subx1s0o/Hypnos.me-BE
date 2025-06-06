import { MEDIA_STATUS } from '@/core/constans/MEDIA_STATUS';

export type MediaStatusType = (typeof MEDIA_STATUS)[keyof typeof MEDIA_STATUS];
