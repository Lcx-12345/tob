import { Command } from 'commander';
import { scrapeAllPlatforms, scrapeByPlatform } from '../scraper';
import { processProducts } from '../processor';
import { generateVisualizationData } from '../visualizer';

/**
 * 定义命令行命令
 * @returns Command实例
 */
export function defineCommands() {
  const program = new Command();
  
  program
    .name('price-scraper')
    .description('电商商品价格自动化采集与对比工具')
    .version('1.0.0');
  
  // 搜索命令
  program
    .command('search')
    .description('搜索商品并采集价格信息')
    .option('-k, --keyword <keyword>', '搜索关键词', '手机')
    .option('-p, --platform <platform>', '电商平台 (jd, taobao, pdd, all)', 'all')
    .option('-n, --pages <number>', '页码数', '1')
    .option('-o, --output <file>', '输出文件路径')
    .action(async (options) => {
      const { keyword, platform, pages, output } = options;
      
      console.log(`正在搜索关键词: ${keyword}`);
      console.log(`平台: ${platform}`);
      console.log(`页码数: ${pages}`);
      
      try {
        // 采集数据
        let products;
        if (platform === 'all') {
          products = await scrapeAllPlatforms(keyword, parseInt(pages));
        } else {
          products = await scrapeByPlatform(platform, keyword, parseInt(pages));
        }
        
        console.log(`采集到 ${products.length} 个商品`);
        
        // 处理数据
        const result = processProducts(products);
        
        console.log(`处理后剩余 ${result.products.length} 个商品`);
        console.log(`平均价格: ¥${result.averagePrice.toFixed(2)}`);
        console.log(`价格范围: ¥${result.priceRange[0]} - ¥${result.priceRange[1]}`);
        
        if (result.cheapest) {
          console.log(`最低价商品: ${result.cheapest.name} - ¥${result.cheapest.price}`);
        }
        
        // 生成可视化数据
        const visualizationData = generateVisualizationData(result);
        
        // 输出结果
        if (output) {
          require('fs').writeFileSync(output, JSON.stringify({
            result,
            visualizationData
          }, null, 2));
          console.log(`结果已输出到: ${output}`);
        } else {
          console.log('\n推荐商品:');
          result.recommendations.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ¥${product.price} (${product.platform})`);
          });
        }
        
      } catch (error) {
        console.error('执行失败:', error);
      }
    });
  
  return program;
}
