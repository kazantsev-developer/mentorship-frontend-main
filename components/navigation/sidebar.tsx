"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button, Listbox, ListboxItem } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const currentRole =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedRole") || "student"
      : "student";

  const studentLinks = [
    {
      href: "/student/roadmap",
      label: "Траектория обучения",
      icon: "lucide:gantt-chart-square",
    },
    {
      href: "/student/progress",
      label: "Мой прогресс",
      icon: "lucide:bar-chart-3",
    },
    {
      href: "/student/interviews",
      label: "Собеседования",
      icon: "lucide:video",
    },
    {
      href: "/student/calendar",
      label: "Расписание событий",
      icon: "lucide:calendar",
    },
  ];

  const buddyLinks = [
    { href: "/buddy/students", label: "Мои студенты", icon: "lucide:users" },
    {
      href: "/buddy/calendar",
      label: "Календарь проверок",
      icon: "lucide:calendar-days",
    },
  ];

  const activeLinks = currentRole === "buddy" ? buddyLinks : studentLinks;

  return (
    <aside className="w-[280px] h-screen bg-surface border-r border-border-subtle flex flex-col justify-between p-6 shrink-0 sticky top-0">
      <div className="space-y-8">
        {/* Логотип увеличен и отступ снизу больше */}
        <div className="flex flex-col px-2">
          <span className="text-xl font-bold tracking-tight text-text-main font-mono">
            Go <span className="text-brand-primary">Mentor</span>
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-text-muted mt-0.5">
            Платформа менторства
          </span>
        </div>

        <Listbox aria-label="Навигация" variant="flat" className="p-0 gap-4">
          {activeLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <ListboxItem
                key={link.href}
                textValue={link.label}
                onClick={() => router.push(link.href)}
                className={`h-12 px-4 rounded-md font-mono text-sm transition-colors ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-bold"
                    : "text-text-muted hover:text-text-main"
                }`}
                startContent={
                  <Icon icon={link.icon} className="w-5 h-5 shrink-0" />
                }
              >
                {link.label}
              </ListboxItem>
            );
          })}
        </Listbox>
      </div>

      {user?.roles && user.roles.length > 1 && (
        <Button
          size="sm"
          variant="bordered"
          className="w-full font-mono text-xs h-9 border-border-subtle text-text-muted hover:text-text-main"
          startContent={
            <Icon icon="lucide:arrow-left-right" className="w-4 h-4" />
          }
          onClick={() => router.push("/role-select")}
        >
          Сменить роль
        </Button>
      )}
    </aside>
  );
}
