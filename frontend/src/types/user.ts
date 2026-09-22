export type UserRole = 'ROLE_ADMIN' | 'ROLE_CUSTOMER';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}
