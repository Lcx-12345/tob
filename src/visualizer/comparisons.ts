import { Product } from '../types';

/**
 * 生成商品横向对比数据
 * @param products 商品列表
 * @returns 对比数据
 */
export function generateProductComparisons(products: Product[]): any {
  // 只取前5个商品进行对比
  const topProducts = products.slice(0, 5);
  
  return {
    products: topProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      sales: product.sales,
      shopScore: product.shopScore,
      platform: product.platform,
      url: product.url,
      image: product.image
    })),
    metrics: ['price', 'sales', 'shopScore'],
    labels: {
      price: '价格',
      sales: '销量',
      shopScore: '店铺评分'
    }
  };
}

/**
 * 计算商品性价比评分
 * @param product 商品
 * @returns 性价比评分
 */
export function calculateValueScore(product: Product): number {
  // 性价比得分 = (销量 * 0.6 + 店铺评分 * 0.4) / 价格
  return (product.sales * 0.6 + product.shopScore * 0.4) / product.price;
}

/**
 * 生成性价比推荐标注
 * @param products 商品列表
 * @returns 带有推荐标注的商品列表
 */
export function generateRecommendations(products: Product[]): any[] {
  return products.map(product => {
    const score = calculateValueScore(product);
    let recommendation = '';
    
    if (score > 10) {
      recommendation = '强烈推荐';
    } else if (score > 5) {
      recommendation = '推荐';
    } else if (score > 1) {
      recommendation = '一般';
    } else {
      recommendation = '不推荐';
    }
    
    return {
      ...product,
      valueScore: score,
      recommendation
    };
  });
}
