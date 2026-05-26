"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/api";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Switch,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const load = () => {
    api
      .get("/api/user/profile")
      .then(setProfile)
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const update = (field: string, val: any) =>
    setProfile((p: any) => ({ ...p, [field]: val }));
  const save = async () => {
    if (!profile) return;
    setSaving(true);
    await api.put("/api/user/profile", profile);
    setSaving(false);
  };
  if (loading) return <Spinner />;
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardBody className="space-y-4">
          <h1 className="text-3xl font-bold">Мой профиль</h1>
          <Input
            label="Отображаемое имя"
            value={profile.display_name}
            onChange={(e) => update("display_name", e.target.value)}
            startContent={
              <Icon icon="solar:user-linear" width="18" height="18" />
            }
          />
          <Textarea
            label="О себе"
            value={profile.about || ""}
            onChange={(e) => update("about", e.target.value)}
          />
          <Input
            label="Telegram (не редактируется)"
            value={profile.telegram_username || ""}
            isReadOnly
            startContent={
              <Icon icon="solar:chat-square-linear" width="18" height="18" />
            }
          />
          <div className="flex justify-between items-center">
            <span>Публичный профиль</span>
            <Switch
              isSelected={!profile.is_profile_private}
              onValueChange={(val) => update("is_profile_private", !val)}
            />
          </div>
          <Button
            color="primary"
            isLoading={saving}
            startContent={
              <Icon icon="solar:diskette-linear" width="18" height="18" />
            }
            onPress={save}
          >
            Сохранить
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
