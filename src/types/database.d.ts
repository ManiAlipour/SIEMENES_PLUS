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