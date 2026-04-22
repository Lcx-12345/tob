import { cleanProducts } from './cleaner';
import { deduplicateProducts } from './deduplicator';
import { sortProductsByPrice } from './sorter';
import { analyzeProducts } from './analyzer';
import { Product, ProcessedResult } from '../types';

/**
 * 处理商品数据
 * @param products 商品列表
 * @returns 处理结果
 */
export function processProducts(products: Product[]): ProcessedResult {
  // 清洗数据
  const cleanedProducts = cleanProducts(products);
  
  // 去重
  const uniqueProducts = deduplicateProducts(cleanedProducts);
  
  // 分析数据
  const result = analyzeProducts(uniqueProducts);
  
  return result;
}
