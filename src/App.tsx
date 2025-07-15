
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Login from '@/components/auth/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import CashierDashboard from '@/pages/CashierDashboard';
import POS from '@/pages/POS';
import Products from '@/pages/Products';
import Sales from '@/pages/Sales';
import Staff from '@/pages/Staff';
import Reports from '@/pages/Reports';
import Header from '@/components/layout/Header';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { InventoryProvider } from '@/contexts/InventoryContext';
import { SalesProvider } from '@/contexts/SalesContext';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route 
            path="/" 
            element={
              user?.role === 'admin' ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <Navigate to="/cashier/dashboard" replace />
            } 
          />
          
          {/* Admin Routes */}
          {user?.role === 'admin' && (
            <>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/sales" element={<Sales />} />
              <Route path="/admin/staff" element={<Staff />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/pos" element={<POS />} />
            </>
          )}

          {/* Cashier Routes */}
          {user?.role === 'cashier' && (
            <>
              <Route path="/cashier/dashboard" element={<CashierDashboard />} />
              <Route path="/cashier/pos" element={<POS />} />
              <Route path="/cashier/sales" element={<Sales />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <SalesProvider>
          <Router>
            <AppContent />
          </Router>
        </SalesProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;
