"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await authLogin(login, password);
      if (user.roles.length === 1) {
        localStorage.setItem("selectedRole", user.roles[0]);
        // Редиректим сразу на страницу студента или buddy
        if (user.roles[0] === "student") {
          router.push("/student/roadmap");
        } else if (user.roles[0] === "buddy") {
          router.push("/buddy/students");
        } else {
          router.push("/role-select");
        }
      } else {
        router.push("/role-select");
      }
    } catch (err: any) {
      setError(err.message || "Неверный логин или пароль");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center mb-auto mt-auto bg-gradient-to-br from-primary-50 to-default-100">
      <div className="flex w-full max-w-sm flex-col gap-4 pb-20 rounded-large">
        <div className="flex flex-col items-center pb-2">
          <p className="text-6xl flex font-bold text-inherit">Go Mentor</p>
          <p className="text-xl font-medium">Платформа менторства по Go</p>
          <p className="text-small text-default-500">
            Войдите в свой аккаунт чтобы продолжить
          </p>
        </div>

        <div
          className={`overflow-hidden transition-all duration-500 ${error ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <p className="text-center text-danger text-sm">{error}</p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Логин"
            name="login"
            placeholder="Введите логин"
            variant="bordered"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Input
            isRequired
            label="Пароль"
            name="password"
            placeholder="Введите пароль"
            variant="bordered"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
          />
          <Button className="w-full" color="primary" type="submit">
            Войти
          </Button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">или</p>
          <Divider className="flex-1" />
        </div>

        <p className="text-center text-gray-600 text-sm">
          Нет аккаунта? Обратитесь к администратору
        </p>
      </div>
    </div>
  );
}
