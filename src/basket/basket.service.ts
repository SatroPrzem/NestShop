import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AddProductDto } from './dto/add-product-dto';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  RemoveProductFromBasketResponse,
  ShowProductsInBasketResponse,
} from '../interfaces/basket';
import { ShopService } from 'src/shop/shop.service';

@Injectable()
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
  ) {}

  private itemsInBasket: AddProductDto[] = [];

  addProductToBasket(item: AddProductDto): AddProductToBasketResponse {
    const { count, name } = item;
    if (
      typeof name !== 'string' ||
      name === '' ||
      typeof count !== 'number' ||
      count <= 0 ||
      !this.shopService.hasProduct(item.name)
    ) {
      return { isSuccess: false };
    }

    this.itemsInBasket.push(item);

    return {
      isSuccess: true,
      index: this.itemsInBasket.length - 1,
    };
  }

  removeProductFromBasket(index: number): RemoveProductFromBasketResponse {
    if (index < 0 || index >= this.itemsInBasket.length) {
      return { isSuccess: false };
    }
    this.itemsInBasket.splice(index, 1);
    return { isSuccess: true };
  }

  showProductsInBasket(): ShowProductsInBasketResponse {
    return this.itemsInBasket;
  }

  getTotalPrice(): GetTotalPriceResponse {
    if (
      !this.itemsInBasket.every((item) =>
        this.shopService.hasProduct(item.name),
      )
    ) {
      const alternativeBasket = this.itemsInBasket.filter((item) =>
        this.shopService.hasProduct(item.name),
      );
      return {
        isSuccess: false,
        alternativeBasket: alternativeBasket,
      };
    }

    return this.itemsInBasket
      .map(
        (item) =>
          this.shopService.getPriceOfProduct(item.name) * item.count * 1.23,
      )
      .reduce((prev, curr) => prev + curr, 0);
  }

  countPromo(): number {
    return this.getTotalPrice() > 10 ? 1 : 0;
  }
}
