'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Plus, 
  DollarSign, 
  Menu,
  X,
  Home,
  FileText
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Ana Sayfa', icon: Home },
  { href: '/customers', label: 'Müşteriler', icon: Users },
  { href: '/products', label: 'Ürünler', icon: Package },
  { href: '/orders', label: 'Siparişler', icon: ShoppingCart },
  { href: '/inventory', label: 'Stok Girişi', icon: Plus },
  { href: '/costs', label: 'Maliyetler', icon: DollarSign },
  { href: '/jobs', label: 'İş Kaydı', icon: FileText },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 bg-gray-800 px-4">
          <h1 className="text-xl font-bold">XPOINT</h1>
          <form action="/api/auth/logout" method="post">
            <button className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md">Çıkış</button>
          </form>
        </div>
        
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
