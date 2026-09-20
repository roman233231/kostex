'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { loginUser, getUserData } from '@/services/auth';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, appUser, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Якщо вже залогінений — редірект
  useEffect(() => {
    if (!authLoading && currentUser && appUser) {
      if (appUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    }
  }, [currentUser, appUser, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      // Отримуємо роль і редіректимо
      const userData = await getUserData(user.uid);
      if (userData?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-6">Sign In</h1>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 text-sm text-[var(--text-muted)] flex justify-between">
          <Link href="/register" className="text-[var(--purple)] hover:underline">
            Create account
          </Link>
          <Link href="/forgot-password" className="text-[var(--purple)] hover:underline">
            Forgot password?
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}