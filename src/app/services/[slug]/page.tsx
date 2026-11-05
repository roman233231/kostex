import { notFound } from 'next/navigation';
import { serviceCategories } from '@/data/services';
import ServiceDetail from './ServiceDetail';

export function generateStaticParams() {
  return serviceCategories.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceCategories.find((s) => s.id === slug);
  if (!service) return { title: 'Послуга не знайдена — KOSTEX' };
  return {
    title: `${service.name} — KOSTEX`,
    description: `${service.desc}. Від ${service.price.toLocaleString('uk-UA')} ₴, термін ${service.time}.`,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exists = serviceCategories.find((s) => s.id === slug);
  if (!exists) notFound();
  return <ServiceDetail slug={slug} />;
}
