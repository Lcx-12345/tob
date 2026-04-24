import { Product } from '../types';

/**
 * 按价格从低到高排序商品
 * @param products 商品列表
 * @returns 排序后的商品列表
 */
export function sortProductsByPrice(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.price - b.price);
}

/**
 * 按销量从高到低排序商品
 * @param products 商品列表
 * @returns 排序后的商品列表
 */
export function sortProductsBySales(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.sales - a.sales);
}

/**
 * 按店铺评分从高到低排序商品
 * @param products 商品列表
 * @returns 排序后的商品列表
 */
export function sortProductsByShopScore(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.shopScore - a.shopScore);
}
