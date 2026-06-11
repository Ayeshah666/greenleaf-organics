'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X, Leaf, Search } from 'lucide-react';
import { useCartStore } from '@/context/cartStore';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCartStore();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.push('/');
  };

  return (
    <header style={{ background: 'var(--forest)' }} className="sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div style={{ background: 'var(--forest-mid)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <p className="text-xs text-green-200 font-medium tracking-wide">
            🌱 Free shipping on orders over $60 — Use code ORGANIC10 for 10% off
          </p>
          <div className="hidden md:flex items-center gap-4 text-xs text-green-300">
            {user ? (
              <>
                <span>Hi, {user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                )}
                <button onClick={handleLogout} className="hover:text-white transition-colors">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
                <span className="opacity-40">|</span>
                <Link href="/register" className="hover:text-white transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--moss)' }}>
            <Leaf size={18} color="white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              GreenLeaf
            </span>
            <span className="block text-green-400 text-xs tracking-widest uppercase font-medium" style={{ marginTop: '-3px' }}>
              Organics
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-7">
          {[
            { href: '/products', label: 'Shop' },
            { href: '/products?category=Seeds', label: 'Seeds' },
            { href: '/products?category=Tools', label: 'Tools' },
            { href: '/products?category=Soil+%26+Compost', label: 'Soil' },
            { href: '/about', label: 'Our Story' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-green-200 hover:text-white transition-colors text-sm font-medium tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/products" className="hidden md:flex text-green-300 hover:text-white transition-colors p-1.5">
            <Search size={18} />
          </Link>
          <Link href="/account" className="hidden md:flex text-green-300 hover:text-white transition-colors p-1.5">
            <User size={18} />
          </Link>
          <Link href="/cart" className="relative flex items-center justify-center text-green-300 hover:text-white transition-colors p-1.5">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: 'var(--amber)' }}>
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-1"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'var(--forest-mid)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {[
              { href: '/products', label: 'Shop All' },
              { href: '/products?category=Seeds', label: 'Seeds' },
              { href: '/products?category=Tools', label: 'Tools' },
              { href: '/products?category=Soil+%26+Compost', label: 'Soil & Compost' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-green-200 hover:text-white text-sm font-medium py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="text-green-300 text-sm">Account</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-green-300 text-sm">Admin Panel</Link>
                  )}
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-green-300 text-sm text-left">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="text-green-300 text-sm">Sign in</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="text-green-300 text-sm">Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
