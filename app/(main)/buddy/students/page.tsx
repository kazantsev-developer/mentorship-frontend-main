"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/api";
import {
  Card,
  CardBody,
  Progress,
  Button,
  Chip,
  Spinner,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Student {
  id: string;
  display_name: string;
  avatar_url?: string;
  telegram_username?: string;
  current_block_title: string;
  progress_percent: number;
  status: string;
  days_inactive: number;
}

export default function BuddyStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/api/my-students")
      .then((response: any) => {
        const rawStudents = Array.isArray(response)
          ? response
          : response?.data || [];

        const normalized = rawStudents.map((s: any) => ({
          id: s.id || s.ID,
          display_name: s.display_name,
          avatar_url: s.avatar_url,
          telegram_username: s.telegram_username,
          current_block_title: s.current_block_title || "Не назначен",
          progress_percent: s.progress_percent || 0,
          status: s.status || "not_started",
          days_inactive: s.days_inactive || 0,
        }));
        setStudents(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Spinner className="flex h-[50vh] justify-center" color="secondary" />
    );

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((s) => {
          const needAttention = s.status === "waiting_buddy_confirmation";
          const inactive = s.days_inactive >= 4;
          return (
            <Card
              key={s.id}
              className={`bg-surface border ${needAttention ? "border-amber-500/40" : "border-border-subtle"} rounded-xl`}
            >
              <CardBody className="p-5 flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Avatar
                      src={s.avatar_url}
                      name={s.display_name}
                      radius="full"
                      size="md"
                    />
                    <div>
                      <div className="text-sm font-bold">{s.display_name}</div>
                      {s.telegram_username && (
                        <a
                          href={`https://t.me/${s.telegram_username.replace("@", "")}`}
                          target="_blank"
                          className="text-[11px] text-brand-primary"
                        >
                          {s.telegram_username}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {needAttention && (
                      <Chip size="sm" color="warning" variant="flat">
                        Ждёт проверки
                      </Chip>
                    )}
                    {inactive && (
                      <Chip size="sm" color="danger" variant="flat">
                        {s.days_inactive} д. без актив.
                      </Chip>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-text-muted truncate">
                      Блок: <b>{s.current_block_title}</b>
                    </span>
                    <span>{s.progress_percent}%</span>
                  </div>
                  <Progress
                    value={s.progress_percent}
                    size="sm"
                    color={needAttention ? "warning" : "primary"}
                  />
                </div>
                <Button
                  size="sm"
                  variant="flat"
                  color={needAttention ? "warning" : "default"}
                  className="w-full"
                  onClick={() => router.push(`/buddy/students/${s.id}`)}
                >
                  Открыть трек
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
