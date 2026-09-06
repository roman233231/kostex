'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/services/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ProfilePage() {
  const { appUser, currentUser } = useAuth();
  const [name, setName] = useState(appUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await updateUserProfile(name);
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Email</label>
            <p className="text-white/50">{currentUser?.email}</p>
          </div>
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          {message && <p className="text-sm text-white/70">{message}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}