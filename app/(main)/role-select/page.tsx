"use client";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "@heroui/react";
import { useAuth } from "@/hooks/useAuth";

export default function RoleSelectPage() {
  const { user, selectRole } = useAuth();
  const router = useRouter();

  const chooseRole = (role: string) => {
    selectRole(role);
    router.push("/dashboard");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardBody className="gap-4">
          <h1 className="text-xl font-semibold">Выберите роль для работы</h1>
          <div className="flex gap-4 justify-center">
            {user.roles.includes("student") && (
              <Button color="primary" onPress={() => chooseRole("student")}>
                Студент
              </Button>
            )}
            {user.roles.includes("buddy") && (
              <Button color="secondary" onPress={() => chooseRole("buddy")}>
                Buddy (наставник)
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
