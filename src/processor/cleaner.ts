import { Product } from '../types';

/**
 * 清洗商品数据
 * @param products 商品列表
 * @returns 清洗后的商品列表
 */
export function cleanProducts(products: Product[]): Product[] {
  return products.filter(product => {
    // 过滤掉无效商品
    if (!product.name || product.name.trim() === '') {
      return false;
    }
    
    if (product.price <= 0) {
      return false;
    }
    
    if (!product.url || product.url.trim() === '') {
      return false;
    }
    
    // 统一数据格式
    product.name = product.name.trim();
    product.url = product.url.trim();
    product.platform = product.platform.toLowerCase();
    
    // 处理缺失值
    if (!product.image) {
      product.image = '';
    }
    
    if (!product.createdAt) {
      product.createdAt = new Date().toISOString();
    }
    
    return true;
  });
}
