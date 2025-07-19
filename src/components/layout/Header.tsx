
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Wine, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/pos', label: 'POS' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/sales', label: 'Sales' },
    { path: '/admin/staff', label: 'Staff' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  const cashierNavItems = [
    { path: '/cashier/dashboard', label: 'Dashboard' },
    { path: '/cashier/pos', label: 'POS' },
    { path: '/cashier/sales', label: 'Sales' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : cashierNavItems;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Wine className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">Aziz Wines and Spirits</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  location.pathname === item.path
                    ? 'text-purple-600'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.username}</span>
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                {user?.role}
              </span>
            </div>

            {/* Desktop Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Wine className="h-6 w-6 text-purple-600" />
                    <span>Aziz Wines and Spirits</span>
                  </SheetTitle>
                  <SheetDescription>
                    Logged in as {user?.username} ({user?.role})
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium transition-colors hover:text-purple-600 p-2 rounded ${
                        location.pathname === item.path
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="justify-start mt-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
