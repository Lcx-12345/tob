import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import ProductList from '../components/ProductList';
import Charts from '../components/Charts';
import { scrapeAllPlatforms, scrapeByPlatform } from '../../scraper';
import { processProducts } from '../../processor';
import { generateVisualizationData } from '../../visualizer';
import { Product, ProcessedResult } from '../../types';

// 示例数据
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 7999,
    sales: 10000,
    shopScore: 4.9,
    url: 'https://example.com/iphone15',
    platform: 'jd',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPhone%2015%20Pro%20smartphone&image_size=square',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    price: 8199,
    sales: 8000,
    shopScore: 4.8,
    url: 'https://example.com/iphone15-taobao',
    platform: 'taobao',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPhone%2015%20Pro%20smartphone&image_size=square',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'iPhone 15 Pro',
    price: 7899,
    sales: 6000,
    shopScore: 4.7,
    url: 'https://example.com/iphone15-pdd',
    platform: 'pdd',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=iPhone%2015%20Pro%20smartphone&image_size=square',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    price: 6999,
    sales: 5000,
    shopScore: 4.8,
    url: 'https://example.com/samsung',
    platform: 'jd',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Samsung%20Galaxy%20S24%20Ultra%20smartphone&image_size=square',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Xiaomi 14 Pro',
    price: 4999,
    sales: 12000,
    shopScore: 4.9,
    url: 'https://example.com/xiaomi',
    platform: 'jd',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Xiaomi%2014%20Pro%20smartphone&image_size=square',
    createdAt: new Date().toISOString()
  }
];

// 处理示例数据
const mockResult = processProducts(mockProducts);
const mockVisualizationData = generateVisualizationData(mockResult);

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(mockResult);
  const [visualizationData, setVisualizationData] = useState<any>(mockVisualizationData);

  const handleSearch = async (keyword: string, platform: string, pages: number) => {
    setIsLoading(true);
    try {
      // 采集数据
      let products;
      if (platform === 'all') {
        products = await scrapeAllPlatforms(keyword, pages);
      } else {
        products = await scrapeByPlatform(platform, keyword, pages);
      }

      // 处理数据
      const processedResult = processProducts(products);
      const visData = generateVisualizationData(processedResult);

      setResult(processedResult);
      setVisualizationData(visData);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">电商商品价格对比工具</h1>
          <p className="mt-2 text-sm text-gray-600">
            从京东、淘宝、拼多多批量采集商品价格，进行对比分析
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">搜索设置</h2>
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>

          <div className="lg:col-span-2">
            {result && (
              <div className="space-y-8">
                <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">搜索结果</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">商品数量</p>
                      <p className="text-xl font-semibold text-gray-900">{result.products.length}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">平均价格</p>
                      <p className="text-xl font-semibold text-gray-900">¥{result.averagePrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">价格范围</p>
                      <p className="text-xl font-semibold text-gray-900">¥{result.priceRange[0]} - ¥{result.priceRange[1]}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">推荐商品</p>
                      <p className="text-xl font-semibold text-gray-900">{result.recommendations.length}</p>
                    </div>
                  </div>
                </div>

                <Charts
                  priceChartData={visualizationData.priceChart}
                  platformChartData={visualizationData.platformChart}
                  comparisonChartData={visualizationData.comparisonChart}
                />

                <ProductList products={result.products.slice(0, 6)} title="商品列表" />
                <ProductList products={result.recommendations} title="性价比推荐" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
