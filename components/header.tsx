'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Tabs, Tab } from '@heroui/react';
import { ThemeSwitch } from '@/components/theme-switch';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

export function Header() {
  const { user, logout, getSelectedRole, selectRole } = useAuth();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState(getSelectedRole());
  const roles = user?.roles || [];

  useEffect(() => {
    setCurrentRole(getSelectedRole());
  }, [getSelectedRole]);

  const handleRoleChange = (role: string) => {
    selectRole(role);
    setCurrentRole(role);
    if (role === 'student') router.push('/student/roadmap');
    else if (role === 'buddy') router.push('/buddy/students');
  };

  return (
    <header className="h-16 border-b border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6">
      {/* Хлебные крошки – можно добавить позже */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Панель управления</span>
      </div>
      <div className="flex items-center gap-4">
        {roles.length > 1 && (
          <Tabs
            size="sm"
            variant="bordered"
            selectedKey={currentRole || 'student'}
            onSelectionChange={(key) => handleRoleChange(key as string)}
          >
            {roles.map((r) => (
              <Tab key={r} title={r === 'student' ? 'Студент' : 'Наставник'} />
            ))}
          </Tabs>
        )}
        <ThemeSwitch />
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              size="sm"
              radius="full"
              className="cursor-pointer ring-1 ring-default-200"
              name={user?.display_name?.charAt(0) || 'U'}
              src={user?.avatar_url || undefined}
            />
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="profile" textValue="Профиль" onPress={() => router.push('/student/profile')}>
              <div className="flex flex-col">
                <span className="font-medium">{user?.display_name}</span>
                {user?.telegram_username && (
                  <a href={`https://t.me/${user.telegram_username.replace('@', '')}`} target="_blank" className="text-xs text-brand-primary">
                    {user.telegram_username}
                  </a>
                )}
              </div>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" startContent={<Icon icon="lucide:log-out" className="w-4 h-4" />} onPress={logout}>
              Выйти
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
