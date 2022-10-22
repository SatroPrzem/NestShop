import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  GetListOfProductsResponse,
  RemoveProductFromDbResponse,
} from '../interfaces/shop';
import { BasketService } from '../basket/basket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopItem } from './shop-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
    @InjectRepository(ShopItem)
    private shopItemRepository: Repository<ShopItem>,
  ) {}

  async getProducts(): Promise<GetListOfProductsResponse> {
    return await this.shopItemRepository.find();
  }

  async hasProduct(name: string): Promise<boolean> {
    return (await this.getProducts()).some((item) => item.name === name);
  }

  async getPriceOfProduct(name: string): Promise<number> {
    return (await this.getProducts()).find((item) => item.name === name).price;
  }

  async getOneProduct(id: string): Promise<ShopItem> {
    return this.shopItemRepository.findOneByOrFail({ id: id });
  }

  async removeProduct(id: string): Promise<RemoveProductFromDbResponse> {
    const remove = await this.shopItemRepository.delete(id);
    if (remove.affected)
      return {
        isSuccess: true,
        index: id,
      };
    else return { isSuccess: false };
  }

  async createDummyProduct(): Promise<ShopItem> {
    const newItem = new ShopItem();
    newItem.price = 100;
    newItem.name = 'Sialalalala';
    newItem.description = 'test description';

    await this.shopItemRepository.save(newItem);
    return newItem;
  }

  async addBoughtCounter(id: string) {
    await this.shopItemRepository.update(id, {
      wasEverBought: true,
    });

    const item = await this.shopItemRepository.findOneByOrFail({ id });
    item.boughtCounter++;
    await this.shopItemRepository.save(item);
  }
}
