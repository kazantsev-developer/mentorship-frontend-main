'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

const items = [
  { href: '/buddy/students', label: 'Мои ученики', icon: 'lucide:users' },
  { href: '/buddy/calendar', label: 'Календарь', icon: 'lucide:calendar' },
];

export function BuddySidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[260px] h-screen sticky top-0 border-r border-subtle bg-surface flex flex-col p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight text-brand-purple">Go Mentor</h1>
        <p className="text-xs text-muted-foreground">Наставник</p>
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === item.href
                ? 'bg-brand-purple/10 text-brand-purple font-medium'
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
