import Image from 'next/image';
import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--forest)' }} className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-eyebrow text-green-400 mb-4">Our story</p>
          <h1 className="text-white font-bold mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Started in a 400 sq ft backyard.
          </h1>
          <p className="text-green-200 text-lg leading-relaxed max-w-2xl mx-auto">
            GreenLeaf Organics began when Jordan Miles couldn&apos;t find honest answers at local garden centers about what was actually in their soil bags. So we built the shop we wished existed.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative h-72 rounded-sm overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80"
            alt="Garden"
            fill
            className="object-cover"
            sizes="600px"
          />
        </div>
        <div>
          <p className="section-eyebrow mb-3">How we got here</p>
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
            The question nobody could answer
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            In 2019, Jordan Miles tried to grow food for the first time in a rental backyard in Portland. Every bag at the hardware store said &quot;organic&quot; on the label — but nobody could explain what that meant in practice, or whether the neem oil concentrate was actually safe around pollinators.
          </p>
          <p className="text-gray-600 leading-relaxed">
            That obsession with knowing exactly what goes into a garden — and being able to explain it clearly — became the foundation of GreenLeaf. We stock only what we&apos;d use ourselves, and every product page tells you why it works.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--cream)' }} className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="section-eyebrow mb-3 text-center">What we stand for</p>
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
            Three non-negotiables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🌱', title: 'Honest sourcing', desc: 'We list every supplier. If we can\'t tell you where something comes from, we don\'t sell it.' },
              { icon: '🐝', title: 'Pollinator-safe', desc: 'Any pest control we stock has been verified safe for bees when used as directed. Non-negotiable.' },
              { icon: '♻️', title: 'Zero plastic', desc: 'Every order ships plastic-free. Seeds in paper, tools in kraft wrapping, soil in compostable bags.' },
            ].map((v) => (
              <div key={v.title} className="bg-white border border-gray-100 rounded-sm p-6">
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold mb-2" style={{ color: 'var(--forest)', fontFamily: 'var(--font-display)' }}>{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--mist)' }}>
          <Leaf size={22} style={{ color: 'var(--forest)' }} />
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)' }}>
          Ready to start growing?
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">Browse our full collection — curated for kitchen gardens, raised beds, and everything in between.</p>
        <Link href="/products" className="btn-primary">
          Shop all products <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
