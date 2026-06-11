import Link from 'next/link';
import { Leaf, Mail, Heart, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--forest)' }} className="text-green-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--moss)' }}>
                <Leaf size={15} color="white" />
              </div>
              <span className="text-white font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
                GreenLeaf Organics
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Supplying the conscious gardener since 2019. Every product we sell is certified organic, non-GMO, and sourced from regenerative farms.
            </p>
            <div className="flex gap-3 mt-5">
              {[Heart, Rss, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['Seeds', 'Soil & Compost', 'Tools', 'Fertilizers', 'Pest Control', 'Planters'].map(cat => (
                <li key={cat}>
                  <Link href={`/products?category=${encodeURIComponent(cat)}`} className="hover:text-white transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              {['Shipping Policy', 'Returns', 'Growing Guides', 'FAQ', 'Contact Us'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">From the Garden</h4>
            <p className="text-sm opacity-80 leading-relaxed mb-4">Get seasonal growing tips and exclusive deals delivered to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm rounded-none text-white placeholder:text-green-400 outline-none focus:ring-1 focus:ring-green-400"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              />
              <button className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-white" style={{ background: 'var(--moss)' }}>
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs opacity-60">
          <p>© 2024 GreenLeaf Organics. All rights reserved.</p>
          <p>Certified Organic · Non-GMO · Sustainably Sourced</p>
        </div>
      </div>
    </footer>
  );
}
