import { MEDIA_STATUS } from 'src/libs/entities/constans';

export type MediaStatusType = (typeof MEDIA_STATUS)[keyof typeof MEDIA_STATUS];
