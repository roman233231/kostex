'use client';

import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Reveal from '@/components/ui/Reveal';

export default function SettingsPage() {
  const { currentUser, appUser } = useAuth();

  return (
    <div>
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-[var(--text-muted)] mt-1">
            Account and preferences
          </p>
        </div>
      </Reveal>

      <div className="space-y-4 max-w-2xl">
        <Reveal delay={80}>
          <Card hover={false}>
            <h2 className="text-base font-semibold mb-3">Account</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Email</span>
                <span className="text-[var(--text-secondary)]">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Role</span>
                <Badge>{appUser?.role || 'client'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">User ID</span>
                <span className="text-[var(--text-faint)] text-xs font-mono">
                  {currentUser?.uid.slice(0, 12)}...
                </span>
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card hover={false}>
            <h2 className="text-base font-semibold mb-3">Danger Zone</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              To delete your account or export your data, please contact us.
            </p>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}