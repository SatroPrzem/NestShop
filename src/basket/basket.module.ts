import { forwardRef, Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { ShopModule } from '../shop/shop.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemInBasket } from './item-in-basket.entity';

@Module({
  imports: [
    forwardRef(() => ShopModule),
    TypeOrmModule.forFeature([ItemInBasket]),
  ],
  controllers: [BasketController],
  providers: [BasketService],
  exports: [BasketService],
})
export class BasketModule {}
