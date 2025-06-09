export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  price: number;
  description: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerLocation: string;
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}