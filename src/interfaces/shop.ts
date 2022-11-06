export interface ShopItemInterface {
  name: string;
  description: string;
  price: number;
}

export type GetListOfProductsResponse = ShopItemInterface[];

export type GetOneProductResponse = ShopItemInterface;

export type RemoveProductFromDbResponse =
  | {
      isSuccess: true;
      index: string;
    }
  | {
      isSuccess: false;
    };

export type CreateProductResponse = ShopItemInterface;

export interface GetPaginatedListOfProductsResponse {
  items: ShopItemInterface[];
  pagesCount: number;
}
