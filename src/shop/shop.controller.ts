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
  GetPaginatedListOfProductsResponse,
  RemoveProductFromDbResponse,
} from '../interfaces/shop';
import { ShopService } from './shop.service';

@Controller({
  path: '/shop',
  // domyślnie localhost
  // host: ':name.lvh.me',
  // scope: Scope.REQUEST,
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

  @Post('/')
  createNewProduct(): Promise<CreateProductResponse> {
    return this.shopService.createDummyProduct();
  }
  @Get('/find')
  testFindItem(): Promise<GetListOfProductsResponse> {
    return this.shopService.findProducts();
  }
  @Get('/find/:sth')
  testFindSthItem(
    @Param('sth') sth: string,
  ): Promise<GetListOfProductsResponse> {
    return this.shopService.findSthProducts(sth);
  }
  @Get('/page/')
  showFirstPaginatedPage(): Promise<GetPaginatedListOfProductsResponse> {
    const PageNumber = 1;
    return this.shopService.showPaginatedPage(PageNumber);
  }
  @Get('/page/:pageNumber')
  showPaginatedPage(
    @Param('pageNumber') pageNumber: number,
  ): Promise<GetPaginatedListOfProductsResponse> {
    return this.shopService.showPaginatedPage(pageNumber);
  }

  @Get('/:id')
  getOneProduct(@Param('id') id: string): Promise<GetOneProductResponse> {
    return this.shopService.getOneProduct(id);
  }

  @Delete('/:id')
  removeProduct(@Param('id') id: string): Promise<RemoveProductFromDbResponse> {
    return this.shopService.removeProduct(id);
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
