import { Category } from '../types';

export const categories: Category[] = [
  { id: 'all', name: 'All', slug: 'all', icon: 'LayoutGrid', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', productCount: 22 },
  { id: 'electronics', name: 'Electronics', slug: 'electronics', icon: 'Cpu', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', productCount: 5 },
  { id: 'mobiles', name: 'Mobiles', slug: 'mobiles', icon: 'Smartphone', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', productCount: 1 },
  { id: 'computers', name: 'Computers', slug: 'computers', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', productCount: 3 },
  { id: 'fashion', name: 'Fashion', slug: 'fashion', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop', productCount: 3 },
  { id: 'home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'Home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', productCount: 3 },
  { id: 'beauty', name: 'Beauty', slug: 'beauty', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', productCount: 2 },
  { id: 'grocery', name: 'Grocery', slug: 'grocery', icon: 'ShoppingBasket', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', productCount: 2 },
  { id: 'books', name: 'Books', slug: 'books', icon: 'BookOpen', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop', productCount: 2 },
  { id: 'sports', name: 'Sports', slug: 'sports', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba5a57d4?w=400&h=300&fit=crop', productCount: 2 },
  { id: 'offers', name: 'Offers', slug: 'offers', icon: 'Tag', image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=300&fit=crop', productCount: 8 },
];

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find(c => c.slug === slug);
