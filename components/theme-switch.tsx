'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return <Button isIconOnly size="sm" variant="light" isDisabled />;

  return (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      radius="full"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Icon icon={theme === 'dark' ? 'lucide:sun' : 'lucide:moon'} className="w-[18px] h-[18px] text-main" />
    </Button>
  );
}
