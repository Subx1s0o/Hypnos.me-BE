import { Inject, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripe: Stripe) {}

  async createCheckoutSession(
    products: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>,
  ) {
    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100, // Stripe expects amounts in cents
      },
      quantity: product.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://your-website.com/success',
      cancel_url: 'https://your-website.com/cancel',
    });

    return { url: session.url};
  }

  async handleWebhook(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(session);
    }
  }
}
