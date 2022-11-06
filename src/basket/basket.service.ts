import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AddProductDto } from './dto/add-product-dto';
import {
  AddProductToBasketResponse,
  GetTotalPriceResponse,
  RemoveProductFromBasketResponse,
} from '../interfaces/basket';
import { ShopService } from 'src/shop/shop.service';
import { ItemInBasket } from './item-in-basket.entity';

@Injectable({
  // scope: Scope.REQUEST,
})
export class BasketService {
  constructor(
    @Inject(forwardRef(() => ShopService)) private shopService: ShopService,
  ) {}

  async addProductToBasket(
    item: AddProductDto,
  ): Promise<AddProductToBasketResponse> {
    const { count, id } = item;

    const shopItem = await this.shopService.getOneItem(id);

    if (
      typeof id !== 'string' ||
      id === '' ||
      typeof count !== 'number' ||
      count <= 0 ||
      !shopItem
    ) {
      return { isSuccess: false };
    }
    const newItem = new ItemInBasket();
    newItem.count = count;
    await newItem.save();

    newItem.shopItem = shopItem;
    await newItem.save();

    await this.shopService.addBoughtCounter(id);

    return {
      isSuccess: true,
      id: newItem.id,
    };
  }

  async removeProductFromBasket(
    id: string,
  ): Promise<RemoveProductFromBasketResponse> {
    const item = await ItemInBasket.findOneOrFail({
      where: { id: id },
    });
    if (item) {
      await ItemInBasket.delete(id);
      return { isSuccess: true };
    }
    return { isSuccess: false };
  }

  async showProductsInBasket(): Promise<ItemInBasket[]> {
    return ItemInBasket.find({
      relations: ['shopItem'],
    });
  }

  async getTotalPrice(): Promise<GetTotalPriceResponse> {
    // if (
    //   !this.itemsInBasket.every((item) =>
    //     this.shopService.hasProduct(item.name),
    //   )
    // ) {
    //   const alternativeBasket = this.itemsInBasket.filter((item) =>
    //     this.shopService.hasProduct(item.name),
    //   );
    //   return {
    //     isSuccess: false,
    //     alternativeBasket: alternativeBasket,
    //   };
    // }

    const items = await this.showProductsInBasket();

    const sum = (
      await Promise.all(
        items.map(async (item) => item.shopItem.price * item.count * 1.23),
      )
    ).reduce((prev, curr) => prev + curr, 0);
    return Number((sum > 100 ? sum * 0.95 : sum).toFixed(2));
  }

  async clearBasket() {
    await ItemInBasket.delete({});
    return { isSuccess: true };
  }
}
