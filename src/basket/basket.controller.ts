import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { BasketService } from './basket.service';
import { AddProductDto } from './dto/add-product-dto';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  RemoveProductFromBasketResponse,
  ShowProductsInBasketResponse,
} from '../interfaces/basket';

@Controller('basket')
export class BasketController {
  constructor(@Inject(BasketService) private basketService: BasketService) {}

  @Get('/')
  showProductsInBasket(): Promise<ShowProductsInBasketResponse> {
    return this.basketService.showProductsInBasket();
  }

  @Get('/total-price')
  getTotalPrice(): Promise<GetTotalPriceResponse> {
    return this.basketService.getTotalPrice();
  }

  @Get('/cokolwiek')
  sdawd(): string {
    return 'cokolwiek';
  }

  @Post('/')
  addProductToBasket(
    @Body() item: AddProductDto,
  ): Promise<AddProductToBasketResponse> {
    return this.basketService.addProductToBasket(item);
  }

  @Delete('/all')
  removeAllProductsFromBasket(): Promise<RemoveProductFromBasketResponse> {
    return this.basketService.clearBasket();
  }

  @Delete('/:index')
  removeProductFromBasket(
    @Param('index') id: string,
  ): Promise<RemoveProductFromBasketResponse> {
    return this.basketService.removeProductFromBasket(id);
  }
}
