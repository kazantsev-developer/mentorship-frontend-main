"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/api";
import {
  Card,
  CardBody,
  Button,
  Progress,
  CircularProgress,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  reason: string;
  created_at: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward_bonus: number;
  unlocked: boolean;
}

interface FinalCheck {
  id: string;
  type: "final_technical" | "final_roast";
  status: string;
  scheduled_at?: string;
  completed_at?: string;
}

interface RoadmapBlock {
  id: string;
  title: string;
  progress: {
    status: string;
    percent: number;
  };
}

const STORAGE_KEY = "shown_achievement_toasts";

export default function StudentProgress() {
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [finalChecks, setFinalChecks] = useState<FinalCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting1x1, setSubmitting1x1] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [overallProgress, setOverallProgress] = useState(0);
  const [currentBlockTitle, setCurrentBlockTitle] = useState("Основной");

  const getShownIds = (): Set<string> => {
    if (typeof window === "undefined") return new Set();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    try {
      return new Set(JSON.parse(stored));
    } catch {
      return new Set();
    }
  };

  const markShown = (id: string) => {
    if (typeof window === "undefined") return;
    const shown = getShownIds();
    shown.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(shown)));
  };

  const loadData = async () => {
    try {
      const [balRes, histRes, achRes, profileRes, checksRes, roadmapRes] =
        await Promise.all([
          api
            .get<{ balance: number }>("/api/bonus/balance")
            .catch(() => ({ balance: 0 })),
          api.get<Transaction[]>("/api/bonus/history").catch(() => []),
          api.get<Achievement[]>("/api/achievements").catch(() => []),
          api.get<any>("/api/user/profile").catch(() => null),
          api.get<FinalCheck[]>("/api/final-checks/student/me").catch(() => []),
          api.get<RoadmapBlock[]>("/api/roadmap").catch(() => []),
        ]);

      setBalance(balRes.balance || 0);
      const normalized = (histRes || []).map((t: any) => ({
        id: t.ID || t.id,
        type: t.Type || t.type,
        amount: t.Amount || t.amount,
        reason: t.Reason || t.reason,
        created_at: t.CreatedAt || t.created_at,
      }));
      setTransactions(normalized);

      const newAchievements = achRes || [];
      const shownIds = getShownIds();

      newAchievements.forEach((ach) => {
        if (ach.unlocked && !shownIds.has(ach.id)) {
          toast.success(
            `Достижение получено: ${ach.title} (+${ach.reward_bonus} бонусов)`,
            { duration: 5000 },
          );
          markShown(ach.id);
        }
      });

      setAchievements(newAchievements);
      setProfile(profileRes);
      setFinalChecks(checksRes || []);
      setDiscount(Math.min(Math.floor((balRes.balance || 0) / 100), 15));

      if (roadmapRes && roadmapRes.length > 0) {
        const totalPercent = roadmapRes.reduce(
          (sum, block) => sum + (block.progress?.percent || 0),
          0,
        );
        const avgPercent = Math.round(totalPercent / roadmapRes.length);
        setOverallProgress(avgPercent);
        const current = roadmapRes.find(
          (block) => block.progress?.status !== "approved",
        );
        if (current) setCurrentBlockTitle(current.title);
        else if (roadmapRes.length > 0)
          setCurrentBlockTitle(roadmapRes[0].title);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const convertBonus = async () => {
    try {
      await api.post("/api/bonus/convert", { bonus_amount: 100 });
      toast.success("100 бонусов конвертировано в 1% скидки", {
        duration: 3000,
      });
      await loadData();
    } catch {
      toast.error("Ошибка конвертации бонусов", { duration: 3000 });
    }
  };

  const createOneOnOne = async () => {
    setSubmitting1x1(true);
    try {
      await api.post("/api/one-on-one");
      toast.success(
        "Заявка на 1x1 создана. Ожидайте подтверждения администратора",
        { duration: 4000 },
      );
      await loadData();
      onClose();
    } catch {
      toast.error("Ошибка создания заявки", { duration: 3000 });
    } finally {
      setSubmitting1x1(false);
    }
  };

  if (loading)
    return (
      <Spinner
        className="flex h-[70vh] items-center justify-center"
        color="secondary"
        size="lg"
      />
    );

  const daysInProgram = profile?.learning_started_at
    ? Math.floor(
        (Date.now() - new Date(profile.learning_started_at).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-lg">
              <Icon icon="lucide:calendar" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-mono text-text-muted">
                Дней в обучении
              </p>
              <p className="text-2xl font-bold font-mono">{daysInProgram}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <CircularProgress
              size="lg"
              value={overallProgress}
              color="primary"
              showValueLabel={true}
              classNames={{ value: "font-mono text-sm font-bold" }}
            />
            <div>
              <p className="text-[11px] uppercase font-mono text-text-muted">
                Прогресс
              </p>
              <p className="text-xs font-semibold">Текущий этап</p>
              <p className="text-[11px] text-brand-primary truncate max-w-[160px] font-mono">
                {currentBlockTitle}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-surface border border-border-subtle shadow-none rounded-xl bg-gradient-to-br from-surface to-brand-purple/[0.02]">
          <CardBody className="flex flex-col gap-3 p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:wallet-money-bold-duotone"
                  className="w-5 h-5 text-brand-purple"
                />
                <span className="text-[11px] uppercase font-mono text-text-muted">
                  Бонусы
                </span>
              </div>
              <span className="text-xl font-bold font-mono text-brand-purple">
                {balance}
              </span>
            </div>
            <Button
              size="sm"
              color="secondary"
              variant="flat"
              className="w-full text-xs font-mono h-7"
              isDisabled={balance < 100 || discount >= 15}
              onClick={convertBonus}
            >
              {discount >= 15 ? "Лимит скидки" : "Обменять 100 → +1%"}
            </Button>
          </CardBody>
        </Card>
        <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
          <CardBody className="p-4 flex flex-col gap-2">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[11px] uppercase font-mono text-text-muted">
                  Скидка
                </span>
                <span className="text-sm font-bold font-mono text-emerald-500">
                  {discount}% / 15%
                </span>
              </div>
              <Progress
                value={(discount / 15) * 100}
                color="success"
                size="sm"
              />
            </div>
            <Button
              size="sm"
              variant="bordered"
              className="h-7 text-xs font-mono border-border-subtle hover:bg-border-subtle/40"
              onClick={onOpen}
            >
              Заявка 1x1
            </Button>
          </CardBody>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase font-mono text-text-muted">
            Достижения
          </h3>
          <span className="text-xs font-mono text-text-muted">
            Получено: {achievements.filter((a) => a.unlocked).length} /{" "}
            {achievements.length}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`relative flex flex-col items-center p-4 bg-surface border rounded-xl text-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                ach.unlocked
                  ? "border-brand-purple/30 shadow-sm hover:shadow-md"
                  : "border-border-subtle opacity-50 grayscale"
              }`}
              onClick={() => {
                if (ach.unlocked) {
                  toast(`${ach.title}: ${ach.description}`, { duration: 3000 });
                }
              }}
            >
              <div
                className={`p-3 rounded-full mb-2 transition-all ${
                  ach.unlocked
                    ? "bg-brand-purple/10 text-brand-purple"
                    : "bg-canvas text-text-muted"
                }`}
              >
                <Icon
                  icon={
                    ach.unlocked
                      ? "solar:dialog-star-bold"
                      : "solar:lock-keyhole-linear"
                  }
                  className="w-6 h-6"
                />
              </div>
              <span className="text-xs font-bold text-text-main font-mono">
                {ach.title}
              </span>
              <span className="text-[10px] text-text-muted mt-1 min-h-[32px] line-clamp-2">
                {ach.description}
              </span>
              <div className="mt-2 px-2 py-0.5 rounded bg-canvas text-[10px] font-mono font-bold text-brand-purple">
                +{ach.reward_bonus} XP
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3 p-4 bg-surface border border-border-subtle rounded-xl">
          <h3 className="text-xs font-bold uppercase font-mono text-text-muted">
            Финальные проверки
          </h3>
          {finalChecks.length === 0 && (
            <p className="text-xs text-text-muted">Нет данных</p>
          )}
          {finalChecks.map((fc) => (
            <div
              key={fc.id}
              className="flex items-center justify-between py-2 border-b border-border-subtle/40 last:border-0"
            >
              <span className="text-xs font-medium text-text-main">
                {fc.type === "final_technical" ? "Техничка" : "Прожарка"}
              </span>
              <Chip
                size="sm"
                color={fc.status === "completed" ? "success" : "warning"}
                variant="light"
                className="h-5 text-[10px] font-mono"
              >
                {fc.status}
              </Chip>
            </div>
          ))}
        </div>
        <div className="space-y-3 p-4 bg-surface border border-border-subtle rounded-xl">
          <h3 className="text-xs font-bold uppercase font-mono text-text-muted">
            История бонусов
          </h3>
          <Table
            removeWrapper
            aria-label="Бонусная история"
            className="bg-transparent"
          >
            <TableHeader>
              <TableColumn className="bg-transparent font-mono text-[10px] px-0">
                Причина
              </TableColumn>
              <TableColumn className="bg-transparent font-mono text-[10px] text-right px-0">
                Сумма
              </TableColumn>
              <TableColumn className="bg-transparent font-mono text-[10px] text-right px-0">
                Дата
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <span className="text-xs font-mono text-text-muted py-4 block text-center">
                  Операций не найдено
                </span>
              }
            >
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="border-b border-border-subtle/40 last:border-0"
                >
                  <TableCell className="py-2 px-0">
                    <span className="text-xs font-medium text-text-main line-clamp-1">
                      {tx.reason}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`py-2 px-0 text-right font-mono text-xs font-bold ${tx.amount > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </TableCell>
                  <TableCell className="py-2 px-0 text-right font-mono text-[10px] text-text-muted">
                    {tx.created_at
                      ? new Date(tx.created_at).toLocaleDateString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        backdrop="blur"
        classNames={{ base: "bg-surface border border-border-subtle" }}
      >
        <ModalContent>
          <ModalHeader className="font-mono text-xs uppercase tracking-wider">
            Заявка на 1x1
          </ModalHeader>
          <ModalBody className="text-xs text-text-muted">
            <p>
              Стоимость: 1000 бонусов. Бонусы спишутся после одобрения
              администратором.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="light"
              className="font-mono text-xs"
              onPress={onClose}
            >
              Отмена
            </Button>
            <Button
              size="sm"
              color="primary"
              className="font-mono text-xs"
              isLoading={submitting1x1}
              onPress={createOneOnOne}
            >
              Создать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
