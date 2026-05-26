"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const currentRole =
    typeof window !== "undefined"
      ? localStorage.getItem("selectedRole") || "student"
      : "student";

  const studentLinks = [
    {
      href: "/student/progress",
      label: "Мой прогресс",
      icon: "lucide:bar-chart-3",
    },
    {
      href: "/student/roadmap",
      label: "Траектория обучения",
      icon: "lucide:gantt-chart-square",
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

  const renderMenuItem = (link: (typeof activeLinks)[0]) => {
    const isActive = pathname === link.href;

    return (
      <div
        key={link.href}
        onClick={() => router.push(link.href)}
        className={`h-12 px-3 rounded-md font-mono text-base transition-colors mb-3 flex items-center cursor-pointer ${
          isCollapsed ? "justify-center px-0" : ""
        } ${
          isActive
            ? "bg-brand-primary/10 text-brand-primary font-bold"
            : "text-text-muted hover:text-text-main hover:bg-surface-hover"
        }`}
      >
        <Icon
          icon={link.icon}
          className={`w-5 h-5 shrink-0 ${isCollapsed ? "mx-auto" : "mr-3"}`}
        />
        {!isCollapsed && link.label}
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-surface border border-border-subtle text-text-muted hover:text-text-main transition-all duration-300 lg:hidden"
      >
        <Icon
          icon={isCollapsed ? "lucide:chevron-right" : "lucide:chevron-left"}
          className="w-5 h-5"
        />
      </button>

      <aside
        className={`h-screen bg-surface border-r border-border-subtle flex flex-col justify-between p-6 shrink-0 sticky top-0 transition-all duration-300 ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        }`}
      >
        <div>
          <div
            className={`flex flex-col items-center text-center mb-8 transition-all duration-300 ${
              isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            <span className="text-2xl font-bold tracking-tight text-text-main font-mono">
              Go <span className="text-brand-primary">Mentor</span>
            </span>
            <span className="text-[11px] uppercase font-mono tracking-wider text-text-muted mt-1 font-bold">
              Платформа менторства
            </span>
          </div>

          {isCollapsed && (
            <div className="flex justify-center mb-8">
              <span className="text-2xl font-bold text-brand-primary font-mono">
                GM
              </span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center justify-center w-full mb-4 p-2 rounded-lg bg-surface border border-border-subtle text-text-muted hover:text-text-main transition-all duration-300 ${
              isCollapsed ? "px-0" : ""
            }`}
          >
            <Icon
              icon={
                isCollapsed ? "lucide:chevron-right" : "lucide:chevron-left"
              }
              className="w-4 h-4"
            />
            {!isCollapsed && (
              <span className="ml-2 text-xs font-mono">Свернуть</span>
            )}
          </button>

          <div className="flex flex-col">
            {activeLinks.map((link) => {
              if (isCollapsed) {
                return (
                  <Tooltip
                    key={link.href}
                    content={link.label}
                    placement="right"
                  >
                    {renderMenuItem(link)}
                  </Tooltip>
                );
              }
              return renderMenuItem(link);
            })}
          </div>
        </div>

        {user?.roles && user.roles.length > 1 && (
          <Tooltip
            content="Сменить роль"
            placement="right"
            isDisabled={!isCollapsed}
          >
            <Button
              size="sm"
              variant="bordered"
              className={`w-full font-mono text-xs h-9 border-border-subtle text-text-muted hover:text-text-main transition-all duration-300 ${
                isCollapsed ? "px-0 min-w-0" : ""
              }`}
              startContent={
                <Icon
                  icon="lucide:arrow-left-right"
                  className={`w-4 h-4 ${isCollapsed ? "mx-auto" : ""}`}
                />
              }
              onClick={() => router.push("/role-select")}
            >
              {!isCollapsed && "Сменить роль"}
            </Button>
          </Tooltip>
        )}
      </aside>
    </>
  );
}
