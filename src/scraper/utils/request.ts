import axios from 'axios';

// 检查是否在浏览器环境中
const isBrowser = typeof window !== 'undefined';

// 模拟浏览器请求头
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// 延迟函数，用于控制请求频率
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 发送HTTP请求
 * @param url 请求URL
 * @param options 请求选项
 * @returns 响应数据
 */
export async function sendRequest(url: string, options: any = {}) {
  try {
    // 随机延迟，避免被封
    await delay(Math.random() * 2000 + 1000);
    
    const response = await axios({
      url,
      headers: HEADERS,
      timeout: 30000,
      ...options
    });
    
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

/**
 * 使用Puppeteer获取动态页面
 * @param url 页面URL
 * @param options 选项
 * @returns 页面内容
 */
export async function getDynamicPage(url: string, options: any = {}) {
  // 在浏览器环境中，返回空字符串
  if (isBrowser) {
    return '';
  }
  
  // 只在Node.js环境中使用Puppeteer
  const puppeteer = await import('puppeteer');
  let browser: any = null;
  
  try {
    // 启动浏览器
    browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080'
      ],
      ...options
    });
    
    // 创建页面
    const page = await browser.newPage();
    
    // 设置请求头
    await page.setExtraHTTPHeaders(HEADERS);
    
    // 访问页面
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // 随机延迟
    await delay(Math.random() * 3000 + 2000);
    
    // 获取页面内容
    const content = await page.content();
    
    return content;
  } catch (error) {
    console.error('获取动态页面失败:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
