'use client';
import { useEffect, useState, use } from 'react';
import ProductForm from '@/components/admin/ProductForm';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  badge?: string;
  weight?: string;
  benefits?: string[];
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d.product); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4 max-w-3xl">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-8 bg-gray-200 rounded w-56" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="p-8 text-gray-500">Product not found.</div>;
  }

  return (
    <ProductForm
      mode="edit"
      productId={id}
      initialData={{
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        stock: product.stock.toString(),
        featured: product.featured,
        badge: product.badge || '',
        weight: product.weight || '',
        benefits: (product.benefits || []).join('\n'),
      }}
    />
  );
}
