
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/types';

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, quantity: number) => void;
  searchProducts: (query: string) => Product[];
  getLowStockProducts: () => Product[];
  getProductsByCategory: (category: ProductCategory) => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Mock initial products
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Johnnie Walker Black Label',
    brand: 'Johnnie Walker',
    category: 'Whisky',
    size: '750ml',
    price: 2500,
    stock: 25,
    minStock: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Smirnoff Vodka',
    brand: 'Smirnoff',
    category: 'Vodka',
    size: '750ml',
    price: 1800,
    stock: 30,
    minStock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Tusker Lager',
    brand: 'Tusker',
    category: 'Beer',
    size: '500ml',
    price: 200,
    stock: 100,
    minStock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Coca Cola',
    brand: 'Coca Cola',
    category: 'Soft Drinks',
    size: '500ml',
    price: 80,
    stock: 3,
    minStock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const savedProducts = localStorage.getItem('pos_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateStock = (id: string, quantity: number) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, stock: Math.max(0, product.stock - quantity), updatedAt: new Date().toISOString() }
        : product
    ));
  };

  const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getLowStockProducts = (): Product[] => {
    return products.filter(product => product.stock <= product.minStock);
  };

  const getProductsByCategory = (category: ProductCategory): Product[] => {
    return products.filter(product => product.category === category);
  };

  return (
    <InventoryContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      searchProducts,
      getLowStockProducts,
      getProductsByCategory
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
