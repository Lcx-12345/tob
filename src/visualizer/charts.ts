import { ChartData, ChartOptions } from 'chart.js';
import { Product, ProcessedResult } from '../types';

/**
 * 生成价格趋势图表数据
 * @param products 商品列表
 * @returns 图表数据
 */
export function generatePriceChartData(products: Product[]): ChartData<'line'> {
  // 按价格分组
  const priceRanges = [
    { min: 0, max: 100, label: '0-100元' },
    { min: 100, max: 500, label: '100-500元' },
    { min: 500, max: 1000, label: '500-1000元' },
    { min: 1000, max: 5000, label: '1000-5000元' },
    { min: 5000, max: Infinity, label: '5000元以上' }
  ];
  
  // 计算每个价格区间的商品数量
  const counts = priceRanges.map(range => {
    return products.filter(p => p.price >= range.min && p.price < range.max).length;
  });
  
  return {
    labels: priceRanges.map(r => r.label),
    datasets: [
      {
        label: '商品数量',
        data: counts,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  };
}

/**
 * 生成平台分布图表数据
 * @param platformDistribution 平台分布
 * @returns 图表数据
 */
export function generatePlatformChartData(platformDistribution: Record<string, number>): ChartData<'pie'> {
  const platforms = Object.keys(platformDistribution);
  const counts = Object.values(platformDistribution);
  
  // 平台颜色映射
  const colors = {
    jd: 'rgb(255, 99, 132)',
    taobao: 'rgb(54, 162, 235)',
    pdd: 'rgb(255, 206, 86)'
  };
  
  return {
    labels: platforms.map(p => {
      switch (p) {
        case 'jd': return '京东';
        case 'taobao': return '淘宝';
        case 'pdd': return '拼多多';
        default: return p;
      }
    }),
    datasets: [
      {
        data: counts,
        backgroundColor: platforms.map(p => colors[p as keyof typeof colors] || 'rgb(153, 102, 255)'),
        borderWidth: 1
      }
    ]
  };
}

/**
 * 生成商品横向对比图表数据
 * @param products 商品列表（最多5个）
 * @returns 图表数据
 */
export function generateComparisonChartData(products: Product[]): ChartData<'radar'> {
  // 只取前5个商品
  const topProducts = products.slice(0, 5);
  
  // 归一化数据
  const maxPrice = Math.max(...topProducts.map(p => p.price));
  const maxSales = Math.max(...topProducts.map(p => p.sales || 1));
  const maxScore = Math.max(...topProducts.map(p => p.shopScore || 1));
  
  return {
    labels: ['价格', '销量', '店铺评分'],
    datasets: topProducts.map((product, index) => {
      const colors = [
        { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.2)' },
        { border: 'rgb(54, 162, 235)', background: 'rgba(54, 162, 235, 0.2)' },
        { border: 'rgb(255, 206, 86)', background: 'rgba(255, 206, 86, 0.2)' },
        { border: 'rgb(75, 192, 192)', background: 'rgba(75, 192, 192, 0.2)' },
        { border: 'rgb(153, 102, 255)', background: 'rgba(153, 102, 255, 0.2)' }
      ];
      
      const color = colors[index % colors.length];
      
      return {
        label: product.name.length > 10 ? product.name.substring(0, 10) + '...' : product.name,
        data: [
          1 - (product.price / maxPrice), // 价格越低得分越高
          (product.sales || 0) / maxSales,
          (product.shopScore || 0) / maxScore
        ],
        borderColor: color.border,
        backgroundColor: color.background
      };
    })
  };
}

/**
 * 生成价格趋势图表选项
 * @returns 图表选项
 */
export function generatePriceChartOptions(): ChartOptions<'line'> {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '价格分布趋势'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '商品数量'
        }
      }
    }
  };
}

/**
 * 生成平台分布图表选项
 * @returns 图表选项
 */
export function generatePlatformChartOptions(): ChartOptions<'pie'> {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '平台分布'
      }
    }
  };
}

/**
 * 生成商品横向对比图表选项
 * @returns 图表选项
 */
export function generateComparisonChartOptions(): ChartOptions<'radar'> {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '商品横向对比'
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 1
      }
    }
  };
}
