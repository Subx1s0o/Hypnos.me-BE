import { ProductsController } from './products/products.controller';
import { PaymentsController } from './payments/payments.controller';
import { ReviewsController } from './reviews/reviews.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { PromocodesController } from './promocodes/promocodes.controller';
import { RecomendationsController } from './recomendations/recomendations.controller';

export const GATEWAY_COMPONENTS = [
  ProductsController,
  ReviewsController,
  PaymentsController,
  UserController,
  AuthController,
  PromocodesController,
  RecomendationsController,
];
