import { MEDIA_STATUS } from '@lib/entities/constans';

export type MediaStatusType = (typeof MEDIA_STATUS)[keyof typeof MEDIA_STATUS];
