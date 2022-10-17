import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetListOfProductsResponse } from '../interfaces/shop';
import { BasketService } from '../basket/basket.service';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
  ) {}

  getProducts(): GetListOfProductsResponse {
    return [
      {
        name: 'ogórki kiszone',
        description: 'Fantastyczne kiszone ogórki ',
        price: 8.49,
      },
      {
        name: 'ogórki gruntowe',
        description: 'Prosto z ziemi ',
        price: 5.2,
      },
      {
        name: 'ogórki afrykańskie',
        description: 'Bardzo egzotyczne ogórki ',
        price: 9.99,
      },
    ];
  }

  hasProduct(name: string): boolean {
    return this.getProducts().some((item) => item.name === name);
  }

  getPriceOfProduct(name: string): number {
    return this.getProducts().find((item) => item.name === name).price;
  }
}
