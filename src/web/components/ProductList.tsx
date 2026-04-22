import React from 'react';
import { Product } from '../../types';

interface ProductListProps {
  products: Product[];
  title: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, title }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-48"
                />
              ) : (
                <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                  <span className="text-gray-400">暂无图片</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h4>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-semibold text-red-600">
                  ¥{product.price}
                </p>
                <span className="text-xs text-gray-500">
                  {product.platform === 'jd' ? '京东' : product.platform === 'taobao' ? '淘宝' : '拼多多'}
                </span>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="mr-2">销量: {product.sales}</span>
                <span>评分: {product.shopScore || '暂无'}</span>
              </div>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                查看详情
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
