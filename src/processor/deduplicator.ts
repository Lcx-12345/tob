import { Product } from '../types';

/**
 * 去重商品数据
 * @param products 商品列表
 * @returns 去重后的商品列表
 */
export function deduplicateProducts(products: Product[]): Product[] {
  const uniqueProducts: Record<string, Product> = {};
  
  products.forEach(product => {
    // 生成唯一键：平台 + 商品名称（去除空格和特殊字符）
    const key = `${product.platform}_${product.name.replace(/\s+/g, '').toLowerCase()}`;
    
    // 如果商品不存在，或者存在但当前商品价格更低，则更新
    if (!uniqueProducts[key] || product.price < uniqueProducts[key].price) {
      uniqueProducts[key] = product;
    }
  });
  
  // 转换为数组
  return Object.values(uniqueProducts);
}
