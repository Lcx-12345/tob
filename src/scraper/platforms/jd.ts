import { sendRequest, getDynamicPage } from '../utils/request';
import { parseHtml, extractProducts } from '../utils/parser';
import { Product } from '../../types';

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined';

/**
 * 从京东采集商品信息
 * @param keyword 搜索关键词
 * @param page 页码
 * @returns 商品列表
 */
export async function scrapeJd(keyword: string, page: number = 1): Promise<Product[]> {
  // 在浏览器环境中，返回模拟数据
  if (isBrowser) {
    return generateMockProducts('jd', keyword);
  }
  
  try {
    // 构建搜索URL
    const url = `https://search.jd.com/Search?keyword=${encodeURIComponent(keyword)}&page=${page * 2 - 1}`;
    
    // 获取页面内容
    const html = await sendRequest(url);
    
    // 解析页面
    const $ = parseHtml(html);
    
    // 提取商品信息
    const products = extractProducts($, 'jd');
    
    return products;
  } catch (error) {
    console.error('京东采集失败:', error);
    return [];
  }
}

/**
 * 生成模拟商品数据
 * @param platform 平台
 * @param keyword 关键词
 * @returns 模拟商品列表
 */
function generateMockProducts(platform: string, keyword: string): Product[] {
  const mockProducts: Product[] = [
    {
      id: `${platform}_1`,
      name: `${keyword} - ${platform} 商品1`,
      price: 2199,
      sales: 1200,
      shopScore: 4.9,
      url: `https://${platform}.com/product1`,
      platform,
      image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(keyword + ' product')}&image_size=square`,
      createdAt: new Date().toISOString()
    },
    {
      id: `${platform}_2`,
      name: `${keyword} - ${platform} 商品2`,
      price: 3299,
      sales: 700,
      shopScore: 5.0,
      url: `https://${platform}.com/product2`,
      platform,
      image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(keyword + ' product')}&image_size=square`,
      createdAt: new Date().toISOString()
    },
    {
      id: `${platform}_3`,
      name: `${keyword} - ${platform} 商品3`,
      price: 1699,
      sales: 1400,
      shopScore: 4.8,
      url: `https://${platform}.com/product3`,
      platform,
      image: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(keyword + ' product')}&image_size=square`,
      createdAt: new Date().toISOString()
    }
  ];
  
  return mockProducts;
}
