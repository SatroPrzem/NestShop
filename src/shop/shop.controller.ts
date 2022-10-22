import {
  Controller,
  Delete,
  Get,
  HostParam,
  Inject,
  Param,
  Post,
  Redirect,
  Scope,
} from '@nestjs/common';
import {
  CreateProductResponse,
  GetListOfProductsResponse,
  GetOneProductResponse,
  RemoveProductFromDbResponse,
} from '../interfaces/shop';
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
  getListItems(): Promise<GetListOfProductsResponse> {
    return this.shopService.getProducts();
  }

  @Get('/:id')
  getOneProduct(@Param('id') id: string): Promise<GetOneProductResponse> {
    return this.shopService.getOneProduct(id);
  }

  @Delete('/:id')
  removeProduct(@Param('id') id: string): Promise<RemoveProductFromDbResponse> {
    return this.shopService.removeProduct(id);
  }

  @Post('/')
  createNewProduct(): Promise<CreateProductResponse> {
    return this.shopService.createDummyProduct();
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
