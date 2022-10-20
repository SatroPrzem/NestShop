import {
  Controller,
  Get,
  HostParam,
  Inject,
  Param,
  Redirect,
  Scope,
} from '@nestjs/common';
import { GetListOfProductsResponse } from '../interfaces/shop';
import { ShopService } from './shop.service';

@Controller({
  path: '/shop',
  // domyślnie localhost
  // host: ':name.lvh.me',
  scope: Scope.REQUEST,
})
export class ShopController {
  onApplicationShutdown() {
    console.log('kolejność nie ma znaczenia');
  }

  onModuleInit() {
    console.log('module loaded');
  }

  onApplicationBootstrap = () => {
    console.log('whole app ready to work ;)');
  };

  constructor(@Inject(ShopService) private shopService: ShopService) {}

  @Get('/')
  getListItems(): GetListOfProductsResponse {
    return this.shopService.getProducts();
  }

  @Get('/test/:age')
  @Redirect()
  testRedirect(@Param('age') age: string) {
    const url = Number(age) > 18 ? '/site' : '/block';
    return {
      url,
      statusCode: 301,
    };
  }
  @Get('/for-test')
  testRedirect2(@HostParam('name') siteName: string) {
    return `Witaj na sklepie hackerze benhackerze ;) ${siteName}`;
  }
}
