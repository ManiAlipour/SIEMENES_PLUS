declare interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  verified: boolean;
  verificationCode: null | string;
  createdAt: string;
  updatedAt: string;
}

declare interface UserRedux {
  id: string;
  role: string;
  verified: boolean;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface StatsObject {
  monthlyViews: any[];
  popularProducts: any[];
  topSearches: any[];
  eventStats: any[];
  overview: Overview;
  trendStats: TrendStats;
}

interface TrendStats {
  viewsGrowth: string;
  activeUsersGrowth: string;
}

interface Overview {
  totalViews: number;
  totalProductViews: number;
  totalSearches: number;
  totalInteractions: number;
  activeUsersDaily: number;
  activeUsersMonthly: number;
}

declare interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  modelNumber: string;
  image: string;
  description: string;
  specifications: object;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
