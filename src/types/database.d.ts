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
