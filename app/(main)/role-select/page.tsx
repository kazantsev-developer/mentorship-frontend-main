"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardBody, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function RoleSelect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && user) {
      const roles = user.roles || [];
      setAvailableRoles(roles);
      if (roles.length === 1) {
        handleSelectRole(roles[0]);
      }
    }
  }, [user, loading]);

  const handleSelectRole = (role: string) => {
    localStorage.setItem("selected_role", role);
    if (role === "student") {
      router.push("/student/roadmap");
    } else if (role === "buddy") {
      router.push("/buddy/students");
    }
  };

  if (loading || availableRoles.length <= 1) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner
          color="primary"
          label="Определяем уровень доступа..."
          classNames={{ label: "text-text-muted font-mono text-xs" }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="space-y-1">
          <h1 className="text-xl font-bold font-mono text-text-main tracking-tight">
            Выберите рабочее пространство
          </h1>
          <p className="text-xs text-text-muted">
            Вашему аккаунту доступно несколько ролей в системе.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-4">
          {availableRoles.includes("student") && (
            <Card
              isPressable
              className="bg-surface border border-border-subtle hover:border-brand-primary/50 transition-all shadow-none rounded-xl"
              onClick={() => handleSelectRole("student")}
            >
              <CardBody className="p-5 flex flex-row items-center gap-4 text-left">
                <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg shrink-0">
                  <Icon icon="lucide:book-open" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-text-main">
                    Кабинет Студента
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Обучение по траектории, ачивки, бонусы и сдача практических
                    блоков.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {availableRoles.includes("buddy") && (
            <Card
              isPressable
              className="bg-surface border border-border-subtle hover:border-brand-purple/50 transition-all shadow-none rounded-xl"
              onClick={() => handleSelectRole("buddy")}
            >
              <CardBody className="p-5 flex flex-row items-center gap-4 text-left">
                <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-lg shrink-0">
                  <Icon icon="lucide:users" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono text-text-main">
                    Панель Ментора (Buddy)
                  </h3>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    Сопровождение подопечных, проверка блоков и фиксация фидбэка
                    собеседований.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
