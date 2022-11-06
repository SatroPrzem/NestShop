import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  GetListOfProductsResponse,
  GetPaginatedListOfProductsResponse,
  RemoveProductFromDbResponse,
} from '../interfaces/shop';
import { BasketService } from '../basket/basket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopItem } from './shop-item.entity';
import { DataSource, getConnection, Repository } from 'typeorm';
import { ShopItemDetails } from './shop-item-details.entity';

@Injectable()
export class ShopService {
  constructor(
    @Inject(forwardRef(() => BasketService))
    private basketService: BasketService,
    @InjectRepository(ShopItem)
    private shopItemRepository: Repository<ShopItem>,
    @Inject(DataSource) private dataSource: DataSource,
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

    const details = new ShopItemDetails();
    details.color = 'green';
    details.width = 200;

    await details.save();

    newItem.details = details;

    // same thing for training
    // await this.shopItemRepository.save(newItem);
    await newItem.save();

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

  async findProducts() {
    return await ShopItem.find({
      where: {
        description: 'Polskie',
      },
    });
  }

  async findSthProducts(sth: string) {
    const data = await this.dataSource
      .createQueryBuilder()
      .select('shopItem')
      .from(ShopItem, 'shopItem')
      .where('shopItem.description LIKE :searchTerm', {
        searchTerm: `%${sth}%`,
      })
      .getMany();

    return data;
    // return await ShopItem.findBy({
    //   description: sth,
    // });
  }

  async showPaginatedPage(
    pageNumber: number,
  ): Promise<GetPaginatedListOfProductsResponse> {
    const maxPerPage = 3;
    const currentPage = pageNumber;

    const [items, count] = await ShopItem.findAndCount({
      relations: ['details'],
      skip: maxPerPage * (currentPage - 1),
      take: maxPerPage,
    });

    const pagesCount = Math.ceil(count / maxPerPage);

    return {
      items,
      pagesCount,
    };
  }
}
