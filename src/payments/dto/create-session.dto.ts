export class CreateSessionDto {
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}
