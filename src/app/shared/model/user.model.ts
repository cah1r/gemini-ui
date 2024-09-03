export interface CreateUser {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  role: string;
}
