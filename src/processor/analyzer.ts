import { Product, ProcessedResult } from '../types';
import { sortProductsByPrice } from './sorter';

/**
 * 分析商品数据
 * @param products 商品列表
 * @returns 分析结果
 */
export function analyzeProducts(products: Product[]): ProcessedResult {
  // 按价格排序
  const sortedProducts = sortProductsByPrice(products);
  
  // 计算平均价格
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const averagePrice = products.length > 0 ? totalPrice / products.length : 0;
  
  // 计算价格范围
  const prices = products.map(p => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceRange: [number, number] = [minPrice, maxPrice];
  
  // 找出最低价商品
  const cheapest = sortedProducts[0] || null;
  
  // 计算性价比推荐
  const recommendations = calculateRecommendations(products);
  
  // 计算平台分布
  const platformDistribution = calculatePlatformDistribution(products);
  
  return {
    products: sortedProducts,
    cheapest,
    averagePrice,
    priceRange,
    recommendations,
    platformDistribution
  };
}

/**
 * 计算性价比推荐
 * @param products 商品列表
 * @returns 性价比推荐商品列表
 */
function calculateRecommendations(products: Product[]): Product[] {
  // 计算每个商品的性价比得分
  const productsWithScore = products.map(product => {
    // 性价比得分 = (销量 * 0.6 + 店铺评分 * 0.4) / 价格
    const score = (product.sales * 0.6 + product.shopScore * 0.4) / product.price;
    return { ...product, score };
  });
  
  // 按性价比得分排序，取前5个
  return productsWithScore
    .sort((a, b) => (b as any).score - (a as any).score)
    .slice(0, 5);
}

/**
 * 计算平台分布
 * @param products 商品列表
 * @returns 平台分布
 */
function calculatePlatformDistribution(products: Product[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  products.forEach(product => {
    if (distribution[product.platform]) {
      distribution[product.platform]++;
    } else {
      distribution[product.platform] = 1;
    }
  });
  
  return distribution;
}
