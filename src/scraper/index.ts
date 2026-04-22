import { scrapeJd } from './platforms/jd';
import { scrapeTaobao } from './platforms/taobao';
import { scrapePdd } from './platforms/pdd';
import { Product } from '../types';

/**
 * 从所有平台采集商品信息
 * @param keyword 搜索关键词
 * @param pages 页码数
 * @returns 商品列表
 */
export async function scrapeAllPlatforms(keyword: string, pages: number = 1): Promise<Product[]> {
  try {
    // 并行采集所有平台
    const [jdProducts, taobaoProducts, pddProducts] = await Promise.all([
      scrapeJd(keyword, pages),
      scrapeTaobao(keyword, pages),
      scrapePdd(keyword, pages)
    ]);
    
    // 合并结果
    return [...jdProducts, ...taobaoProducts, ...pddProducts];
  } catch (error) {
    console.error('采集失败:', error);
    return [];
  }
}

/**
 * 从指定平台采集商品信息
 * @param platform 平台名称
 * @param keyword 搜索关键词
 * @param pages 页码数
 * @returns 商品列表
 */
export async function scrapeByPlatform(platform: string, keyword: string, pages: number = 1): Promise<Product[]> {
  try {
    switch (platform) {
      case 'jd':
        return await scrapeJd(keyword, pages);
      case 'taobao':
        return await scrapeTaobao(keyword, pages);
      case 'pdd':
        return await scrapePdd(keyword, pages);
      default:
        return [];
    }
  } catch (error) {
    console.error(`${platform}采集失败:`, error);
    return [];
  }
}
