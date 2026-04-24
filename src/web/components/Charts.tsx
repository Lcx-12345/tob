import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale
} from 'chart.js';
import { Line, Pie, Radar } from 'react-chartjs-2';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale
);

interface ChartsProps {
  priceChartData: any;
  platformChartData: any;
  comparisonChartData: any;
}

const Charts: React.FC<ChartsProps> = ({ priceChartData, platformChartData, comparisonChartData }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">价格分布趋势</h3>
          <Line data={priceChartData.data} options={priceChartData.options} />
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">平台分布</h3>
          <Pie data={platformChartData.data} options={platformChartData.options} />
        </div>
      </div>
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">商品横向对比</h3>
        <Radar data={comparisonChartData.data} options={comparisonChartData.options} />
      </div>
    </div>
  );
};

export default Charts;
