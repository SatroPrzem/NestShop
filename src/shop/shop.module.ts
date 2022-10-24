import { forwardRef, Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { BasketModule } from '../basket/basket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopItem } from './shop-item.entity';
import { ShopSet } from './shop-set.entity';
import { ShopItemDetails } from './shop-item-details.entity';

@Module({
  imports: [
    forwardRef(() => BasketModule),
    TypeOrmModule.forFeature([ShopItem, ShopSet, ShopItemDetails]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
