"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { flushSync } from "react-dom";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { logout } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const toggleThemeWithWave = async () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    document.documentElement.classList.add("disable-transitions");

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    await transition.ready;

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const right = window.innerWidth - rect.left;
      const bottom = window.innerHeight - rect.top;

      const maxRadius = Math.hypot(
        Math.max(rect.left, right),
        Math.max(rect.top, bottom),
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }

    transition.finished.finally(() => {
      document.documentElement.classList.remove("disable-transitions");
    });
  };

  return (
    <header className="h-20 px-8 border-b border-border-subtle bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
      <div className="min-w-[200px]" />

      <div className="flex justify-center flex-1">
        <h1 className="text-lg font-bold font-mono text-text-main tracking-tight uppercase border-b-2 border-brand-primary/40 px-2 pb-0.5">
          {currentTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 min-w-[200px] justify-end">
        <Button
          ref={buttonRef}
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

        {/* <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-text-muted hover:text-text-main"
          onClick={() => window.open("https://admin.domain.com", "_blank")}
          title="Панель администратора"
        >
          <Icon icon="lucide:settings" className="w-[18px] h-[18px]" />
        </Button> */}

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
