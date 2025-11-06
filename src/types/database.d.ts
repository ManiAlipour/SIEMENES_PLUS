declare interface User  {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  verified: boolean;
  verificationCode: null | string;
  createdAt: string;
  updatedAt: string;
};
