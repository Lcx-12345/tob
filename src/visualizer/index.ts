import { generatePriceChartData, generatePlatformChartData, generateComparisonChartData } from './charts';
import { generateProductComparisons, generateRecommendations } from './comparisons';
import { Product, ProcessedResult } from '../types';

/**
 * 生成可视化数据
 * @param result 处理结果
 * @returns 可视化数据
 */
export function generateVisualizationData(result: ProcessedResult) {
  return {
    priceChart: {
      data: generatePriceChartData(result.products),
      options: {
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
      }
    },
    platformChart: {
      data: generatePlatformChartData(result.platformDistribution),
      options: {
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
      }
    },
    comparisonChart: {
      data: generateComparisonChartData(result.products),
      options: {
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
      }
    },
    productComparisons: generateProductComparisons(result.products),
    recommendations: generateRecommendations(result.recommendations)
  };
}
