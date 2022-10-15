import { Injectable } from '@nestjs/common';
import { GetListOfProductsResponse } from '../interfaces/shop';

@Injectable()
export class ShopService {
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
}
