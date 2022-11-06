import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShopItemDetails } from './shop-item-details.entity';
import { JoinColumn } from 'typeorm';
import { ShopSet } from './shop-set.entity';
import { JoinTable } from 'typeorm';
import { ShopItemInterface } from '../interfaces/shop';
import { ItemInBasket } from 'src/basket/item-in-basket.entity';

@Entity()
export class ShopItem extends BaseEntity implements ShopItemInterface {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    length: 44,
  })
  name: string;
  @Column({
    length: 9999,
    default: null,
    nullable: true,
  })
  description: string | null;
  @Column({
    type: 'float',
    precision: 6,
    scale: 2,
  })
  price: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    default: 0,
  })
  boughtCounter: number;

  @Column({
    default: false,
  })
  wasEverBought: boolean;

  @OneToOne((type) => ShopItemDetails, { eager: true })
  @JoinColumn()
  details: ShopItemDetails;

  /* Subprodukt */
  @ManyToOne((type) => ShopItem, (entity) => entity.subShopItems)
  mainShopItem: ShopItem;

  /* Produkt Główny */
  @OneToMany((type) => ShopItem, (entity) => entity.mainShopItem)
  subShopItems: ShopItem[];

  @ManyToMany((type) => ShopSet, (entity) => entity.items)
  @JoinTable()
  sets: ShopSet[];

  @OneToOne((type) => ItemInBasket, (entity) => entity.shopItem)
  itemInBasket: ItemInBasket;
}
