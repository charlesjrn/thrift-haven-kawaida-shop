
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sale, SaleItem } from '@/types';

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
  getSalesByDateRange: (startDate: string, endDate: string) => Sale[];
  getSalesByCashier: (cashierId: string) => Sale[];
  getTodaysSales: () => Sale[];
  getTotalSales: () => number;
  getBestSellingProducts: () => { productName: string; quantitySold: number; revenue: number }[];
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const savedSales = localStorage.getItem('pos_sales');
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pos_sales', JSON.stringify(sales));
  }, [sales]);

  const addSale = (saleData: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...saleData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setSales(prev => [...prev, newSale]);
  };

  const getSalesByDateRange = (startDate: string, endDate: string): Sale[] => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.timestamp).toISOString().split('T')[0];
      return saleDate >= startDate && saleDate <= endDate;
    });
  };

  const getSalesByCashier = (cashierId: string): Sale[] => {
    return sales.filter(sale => sale.cashierId === cashierId);
  };

  const getTodaysSales = (): Sale[] => {
    const today = new Date().toISOString().split('T')[0];
    return getSalesByDateRange(today, today);
  };

  const getTotalSales = (): number => {
    return sales.reduce((total, sale) => total + sale.totalAmount, 0);
  };

  const getBestSellingProducts = () => {
    const productStats: { [key: string]: { quantitySold: number; revenue: number } } = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (productStats[item.productName]) {
          productStats[item.productName].quantitySold += item.quantity;
          productStats[item.productName].revenue += item.total;
        } else {
          productStats[item.productName] = {
            quantitySold: item.quantity,
            revenue: item.total
          };
        }
      });
    });

    return Object.entries(productStats)
      .map(([productName, stats]) => ({
        productName,
        ...stats
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);
  };

  return (
    <SalesContext.Provider value={{
      sales,
      addSale,
      getSalesByDateRange,
      getSalesByCashier,
      getTodaysSales,
      getTotalSales,
      getBestSellingProducts
    }}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}
