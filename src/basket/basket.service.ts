import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common';
import { AddProductDto } from './dto/add-product-dto';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  RemoveProductFromBasketResponse,
  ShowProductsInBasketResponse,
} from '../interfaces/basket';
import { ShopService } from 'src/shop/shop.service';

@Injectable({
  // scope: Scope.REQUEST,
})
export class BasketService {
  private itemsInBasket: AddProductDto[] = [];

  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
  ) {}

  addProductToBasket(item: AddProductDto): AddProductToBasketResponse {
    const { count, name, id } = item;
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

    this.shopService.addBoughtCounter(id);

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

  async getTotalPrice(): Promise<GetTotalPriceResponse> {
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

    const sum = (
      await Promise.all(
        this.itemsInBasket.map(
          async (item) =>
            (await this.shopService.getPriceOfProduct(item.name)) *
            item.count *
            1.23,
        ),
      )
    ).reduce((prev, curr) => prev + curr, 0);
    return sum > 100 ? sum * 0.95 : sum;
  }
}
