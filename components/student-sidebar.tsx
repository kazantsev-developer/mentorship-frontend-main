'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

const items = [
  { href: '/student/roadmap', label: 'Roadmap', icon: 'lucide:map' },
  { href: '/student/progress', label: 'Прогресс', icon: 'lucide:trending-up' },
  { href: '/student/interviews', label: 'Собеседования', icon: 'lucide:mic' },
  { href: '/student/calendar', label: 'Календарь', icon: 'lucide:calendar' },
  { href: '/student/profile', label: 'Профиль', icon: 'lucide:user' },
];

export function StudentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[260px] h-screen sticky top-0 border-r border-subtle bg-surface flex flex-col p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight text-brand-primary">Go Mentor</h1>
        <p className="text-xs text-muted-foreground">Платформа менторства</p>
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === item.href
                ? 'bg-brand-primary/10 text-brand-primary font-medium'
                : 'text-muted-foreground hover:bg-default-100'
            )}
          >
            <Icon icon={item.icon} className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
