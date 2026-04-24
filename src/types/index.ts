export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  url: string;
  duration: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  bio: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  releaseDate: string;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: string;
}

export interface Image {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: string;
  width: number;
  height: number;
  size: number;
}

// 电商商品数据结构
export interface Product {
  id: string;           // 商品唯一标识
  name: string;         // 商品名称
  price: number;        // 商品价格
  sales: number;        // 销量
  shopScore: number;    // 店铺评分
  url: string;          // 商品链接
  platform: string;     // 电商平台
  image: string;        // 商品图片
  createdAt: string;    // 采集时间
}

// 处理结果数据结构
export interface ProcessedResult {
  products: Product[];                // 处理后的商品列表
  cheapest: Product;                  // 最低价商品
  averagePrice: number;               // 平均价格
  priceRange: [number, number];       // 价格范围
  recommendations: Product[];         // 性价比推荐
  platformDistribution: Record<string, number>; // 平台分布
}