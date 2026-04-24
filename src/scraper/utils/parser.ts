import * as cheerio from 'cheerio';
import { Product } from '../../types';

/**
 * 解析HTML页面
 * @param html HTML内容
 * @returns Cheerio实例
 */
export function parseHtml(html: string) {
  return cheerio.load(html);
}

/**
 * 提取商品信息
 * @param $ Cheerio实例
 * @param platform 电商平台
 * @returns 商品列表
 */
export function extractProducts($: cheerio.CheerioAPI, platform: string): Product[] {
  const products: Product[] = [];
  
  // 根据不同平台使用不同的选择器
  switch (platform) {
    case 'jd':
      // 京东商品选择器
      $('.gl-item').each((index, element) => {
        const product = extractJdProduct($, element);
        if (product) {
          products.push(product);
        }
      });
      break;
    case 'taobao':
      // 淘宝商品选择器
      $('.item').each((index, element) => {
        const product = extractTaobaoProduct($, element);
        if (product) {
          products.push(product);
        }
      });
      break;
    case 'pdd':
      // 拼多多商品选择器
      $('.goods-list-item').each((index, element) => {
        const product = extractPddProduct($, element);
        if (product) {
          products.push(product);
        }
      });
      break;
    default:
      break;
  }
  
  return products;
}

/**
 * 提取京东商品信息
 * @param $ Cheerio实例
 * @param element 商品元素
 * @returns 商品信息
 */
function extractJdProduct($: cheerio.CheerioAPI, element: any): Product | null {
  try {
    const $element = $(element);
    
    // 提取商品链接
    const url = $element.find('.p-img a').attr('href') || '';
    const fullUrl = url.startsWith('http') ? url : `https://item.jd.com${url}`;
    
    // 提取商品ID
    const id = url.match(/(\d+).html/)?.[1] || `jd_${Date.now()}_${Math.random()}`;
    
    // 提取商品名称
    const name = $element.find('.p-name em').text().trim();
    
    // 提取商品价格
    const priceText = $element.find('.p-price i').text().trim();
    const price = parseFloat(priceText) || 0;
    
    // 提取销量
    const salesText = $element.find('.p-commit a').text().trim();
    const sales = parseSales(salesText);
    
    // 提取店铺评分
    const shopScore = 0; // 京东需要额外请求获取店铺评分
    
    // 提取商品图片
    const image = $element.find('.p-img img').attr('src') || '';
    const fullImage = image.startsWith('http') ? image : `https:${image}`;
    
    return {
      id,
      name,
      price,
      sales,
      shopScore,
      url: fullUrl,
      platform: 'jd',
      image: fullImage,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('解析京东商品失败:', error);
    return null;
  }
}

/**
 * 提取淘宝商品信息
 * @param $ Cheerio实例
 * @param element 商品元素
 * @returns 商品信息
 */
function extractTaobaoProduct($: cheerio.CheerioAPI, element: any): Product | null {
  try {
    const $element = $(element);
    
    // 提取商品链接
    const url = $element.find('.pic a').attr('href') || '';
    const fullUrl = url.startsWith('http') ? url : `https:${url}`;
    
    // 提取商品ID
    const id = `taobao_${Date.now()}_${Math.random()}`;
    
    // 提取商品名称
    const name = $element.find('.title a').text().trim();
    
    // 提取商品价格
    const priceText = $element.find('.price strong').text().trim();
    const price = parseFloat(priceText) || 0;
    
    // 提取销量
    const salesText = $element.find('.deal-cnt').text().trim();
    const sales = parseSales(salesText);
    
    // 提取店铺评分
    const shopScore = 0; // 淘宝需要额外请求获取店铺评分
    
    // 提取商品图片
    const image = $element.find('.pic img').attr('src') || '';
    const fullImage = image.startsWith('http') ? image : `https:${image}`;
    
    return {
      id,
      name,
      price,
      sales,
      shopScore,
      url: fullUrl,
      platform: 'taobao',
      image: fullImage,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('解析淘宝商品失败:', error);
    return null;
  }
}

/**
 * 提取拼多多商品信息
 * @param $ Cheerio实例
 * @param element 商品元素
 * @returns 商品信息
 */
function extractPddProduct($: cheerio.CheerioAPI, element: any): Product | null {
  try {
    const $element = $(element);
    
    // 提取商品链接
    const url = $element.find('a').attr('href') || '';
    const fullUrl = url.startsWith('http') ? url : `https://mobile.yangkeduo.com${url}`;
    
    // 提取商品ID
    const id = `pdd_${Date.now()}_${Math.random()}`;
    
    // 提取商品名称
    const name = $element.find('.goods-title').text().trim();
    
    // 提取商品价格
    const priceText = $element.find('.goods-price').text().trim();
    const price = parseFloat(priceText.replace('¥', '')) || 0;
    
    // 提取销量
    const salesText = $element.find('.goods-sales').text().trim();
    const sales = parseSales(salesText);
    
    // 提取店铺评分
    const shopScore = 0; // 拼多多需要额外请求获取店铺评分
    
    // 提取商品图片
    const image = $element.find('.goods-image img').attr('src') || '';
    const fullImage = image.startsWith('http') ? image : `https:${image}`;
    
    return {
      id,
      name,
      price,
      sales,
      shopScore,
      url: fullUrl,
      platform: 'pdd',
      image: fullImage,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('解析拼多多商品失败:', error);
    return null;
  }
}

/**
 * 解析销量文本
 * @param salesText 销量文本
 * @returns 销量数值
 */
function parseSales(salesText: string): number {
  const match = salesText.match(/(\d+(?:\.\d+)?)\s*(万|千)?/);
  if (match) {
    let value = parseFloat(match[1]);
    const unit = match[2];
    
    if (unit === '万') {
      value *= 10000;
    } else if (unit === '千') {
      value *= 1000;
    }
    
    return Math.round(value);
  }
  return 0;
}
