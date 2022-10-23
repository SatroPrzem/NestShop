export interface ShopItem {
  name: string;
  description: string;
  price: number;
}

export type GetListOfProductsResponse = ShopItem[];

export type GetOneProductResponse = ShopItem;

export type RemoveProductFromDbResponse =
  | {
      isSuccess: true;
      index: string;
    }
  | {
      isSuccess: false;
    };

export type CreateProductResponse = ShopItem;

export interface GetPaginatedListOfProductsResponse {
  items: ShopItem[];
  pagesCount: number;
}
