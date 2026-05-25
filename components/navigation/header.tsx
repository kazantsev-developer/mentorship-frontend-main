"use client";
import { useEffect, useState, startTransition } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { logout } = useAuth(); // Подключаем функцию логаута

  useEffect(() => setMounted(true), []);

  const pageTitles: Record<string, string> = {
    "/student/roadmap": "Траектория обучения",
    "/student/progress": "Мой прогресс",
    "/student/interviews": "Собеседования",
    "/student/calendar": "Расписание событий",
    "/buddy/students": "Мои студенты",
    "/buddy/calendar": "Календарь проверок",
  };

  const currentTitle = pageTitles[pathname] || "Панель управления";

  const toggleThemeWithWave = () => {
    if (!document.startViewTransition) {
      setTheme(theme === "dark" ? "light" : "dark");
      return;
    }

    document.documentElement.classList.add("disable-transitions");

    const transition = document.startViewTransition(() => {
      startTransition(() => {
        setTheme(theme === "dark" ? "light" : "dark");
      });
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove("disable-transitions");
    });
  };

  return (
    <header className="h-20 px-8 border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
      {/* Слева: Пустой блок для сохранения идеальной симметрии и центрирования */}
      <div className="min-w-[200px]" />

      {/* Центр: Динамическое название вкладки */}
      <div className="flex justify-center flex-1">
        <h1 className="text-lg font-bold font-mono text-text-main tracking-tight uppercase border-b-2 border-brand-primary/40 px-2 pb-0.5">
          {currentTitle}
        </h1>
      </div>

      {/* Справа: Блок утилит (Тема -> Админка -> Выход) */}
      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        {/* 1. Смена темы */}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-text-muted hover:text-text-main rounded-full active:scale-95 transition-transform"
          onClick={toggleThemeWithWave}
        >
          {mounted ? (
            <Icon
              icon={theme === "dark" ? "lucide:sun" : "lucide:moon"}
              className="w-[18px] h-[18px]"
            />
          ) : (
            <div className="w-[18px] h-[18px] bg-text-muted/20 rounded-full" />
          )}
        </Button>

        {/* 2. Шестерёнка перехода в админку */}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-text-muted hover:text-text-main"
          onClick={() => window.open("https://admin.domain.com", "_blank")}
          title="Панель администратора"
        >
          <Icon icon="lucide:settings" className="w-[18px] h-[18px]" />
        </Button>

        {/* 3. Кнопка логаута (Краснеет при наведении) */}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-text-muted hover:text-danger rounded-full active:scale-95 transition-transform"
          onClick={logout}
          title="Выйти из системы"
        >
          <Icon icon="lucide:log-out" className="w-[18px] h-[18px]" />
        </Button>
      </div>
    </header>
  );
}
