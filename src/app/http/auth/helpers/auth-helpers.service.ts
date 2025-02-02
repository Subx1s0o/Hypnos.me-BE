import { PrismaService } from '@/libs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CartCleaned, CartOriginal } from 'src/types';
import { TokensResponse } from '../types/tokens-response.type';

@Injectable()
export class AuthHelpersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  generateTokens(id: string): TokensResponse {
    const accessToken = this.jwtService.sign({ id }, { expiresIn: '30m' });
    const refreshToken = this.jwtService.sign({ id }, { expiresIn: '5d' });
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(
        new Date().setMinutes(new Date().getMinutes() + 30),
      ),
      refreshTokenValidUntil: new Date(
        new Date().setDate(new Date().getDate() + 5),
      ),
    };
  }

  async getReferrerId(referralCode?: string): Promise<string | null> {
    if (!referralCode) return null;

    const referrer = await this.prismaService.users.findUnique({
      where: { referredCode: referralCode },
    });
    return referrer ? referrer.id : null;
  }

  cleanCartData(cart: CartOriginal): CartCleaned {
    const cleanedItems = cart.items.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ id, cartId, productId, ...cleanedItem }) => {
        const { product, ...itemWithoutProductId } = cleanedItem;

        return {
          ...itemWithoutProductId,
          product: {
            ...product,
          },
        };
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, userId, ...cleanedCart } = cart;

    return {
      ...cleanedCart,
      items: cleanedItems,
    };
  }

  async updateCart(
    userId: string,
    cartItems: { productId: string; quantity: number }[],
  ): Promise<CartOriginal> {
    const userCart = await this.prismaService.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (userCart) {
      for (const item of cartItems) {
        const existingItem = userCart.items.find(
          (cartItem) => cartItem.productId === item.productId,
        );

        if (existingItem) {
          await this.prismaService.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await this.prismaService.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }
      return userCart;
    }
  }
}
