"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/api";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
  Progress,
  Textarea,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

interface BlockProgress {
  id: string;
  title: string;
  status:
    | "not_started"
    | "in_progress"
    | "waiting_buddy_confirmation"
    | "approved";
  percent: number;
}

interface Student {
  id: string;
  display_name: string;
}

interface Activity {
  id: string;
  type: string;
  metadata: string; // JSON строка
  created_at: string;
}

interface FinalCheck {
  id: string;
  type: "final_technical" | "final_roast";
  status: string;
  scheduled_at: string | null;
}

export default function BuddyStudentDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id: studentId } = params;
  const [student, setStudent] = useState<Student | null>(null);
  const [blocks, setBlocks] = useState<BlockProgress[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [finalChecks, setFinalChecks] = useState<FinalCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingMock, setSubmittingMock] = useState(false);
  const [submittingFinal, setSubmittingFinal] = useState(false);

  // Mock-интервью
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [feedback, setFeedback] = useState("");
  const {
    isOpen: mockOpen,
    onOpen: onMockOpen,
    onClose: onMockClose,
  } = useDisclosure();

  // Финальная проверка
  const [finalType, setFinalType] = useState<"final_technical" | "final_roast">(
    "final_technical",
  );
  const [scheduledAt, setScheduledAt] = useState("");
  const {
    isOpen: finalOpen,
    onOpen: onFinalOpen,
    onClose: onFinalClose,
  } = useDisclosure();

  const loadData = async () => {
    try {
      const [studentRes, blocksRes, activityRes, finalRes] = await Promise.all([
        api.get<Student>(`/api/buddy/students/${studentId}`),
        api
          .get<BlockProgress[]>(`/api/buddy/students/${studentId}/roadmap`)
          .catch(() => []),
        api
          .get<Activity[]>(`/api/buddy/students/${studentId}/activity`)
          .catch(() => []),
        api
          .get<FinalCheck[]>(`/api/final-checks/student/${studentId}`)
          .catch(() => []),
      ]);
      setStudent(studentRes);
      setBlocks(blocksRes || []);
      setActivity(activityRes || []);
      setFinalChecks(finalRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  const approveBlock = async (blockId: string) => {
    try {
      await api.post("/api/blocks/approve", {
        student_id: studentId,
        block_id: blockId,
      });
      toast.success("Блок подтверждён! Студент получит бонусы");
      await loadData();
    } catch {
      toast.error("Ошибка подтверждения блока");
    }
  };

  const createMock = async () => {
    if (!company || !position) return;
    setSubmittingMock(true);
    try {
      await api.post("/api/interviews/mock", {
        student_id: studentId,
        company,
        position,
        feedback,
        status: "completed",
      });
      toast.success("Mock-собеседование сохранено");
      setCompany("");
      setPosition("");
      setFeedback("");
      await loadData();
      onMockClose();
    } catch {
      toast.error("Ошибка сохранения mock-собеседования");
    } finally {
      setSubmittingMock(false);
    }
  };

  const scheduleFinalCheck = async () => {
    if (!scheduledAt) return;
    setSubmittingFinal(true);
    try {
      await api.post("/api/final-checks/schedule", {
        student_id: studentId,
        type: finalType,
        scheduled_at: new Date(scheduledAt).toISOString(),
      });
      toast.success(
        `Финальная проверка "${finalType === "final_technical" ? "Техничка" : "Прожарка"}" назначена`,
      );
      await loadData();
      onFinalClose();
      setScheduledAt("");
    } catch {
      toast.error("Ошибка назначения финальной проверки");
    } finally {
      setSubmittingFinal(false);
    }
  };

  const completeFinalCheck = async (checkId: string, passed: boolean) => {
    try {
      await api.post("/api/final-checks/complete", {
        check_id: checkId,
        passed,
      });
      toast.success(
        passed
          ? "Финальная проверка пройдена"
          : "Финальная проверка не пройдена",
      );
      await loadData();
    } catch {
      toast.error("Ошибка изменения статуса");
    }
  };

  const getActivityMessage = (act: Activity) => {
    try {
      const meta = JSON.parse(act.metadata || "{}");
      switch (act.type) {
        case "material_viewed":
          return `Отметил материал: ${meta.title || "без названия"}`;
        case "block_approved":
          return `Подтвердил блок: ${meta.block_id || "блок"}`;
        case "mock_created":
          return `Создал mock-собеседование в компании ${meta.company || "неизвестно"} на позицию ${meta.position || "неизвестна"}`;
        case "achievement_earned":
          return `Получил достижение: ${meta.title || "без названия"}`;
        default:
          return "Действие";
      }
    } catch {
      return "Действие";
    }
  };

  if (loading)
    return (
      <Spinner className="flex h-[70vh] justify-center" color="secondary" />
    );

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-2 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-subtle pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-text-main">
            {student?.display_name}
          </h1>
          <p className="text-xs text-text-muted mt-0.5 font-mono">
            ID: {studentId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            color="primary"
            className="font-mono text-xs"
            startContent={<Icon icon="lucide:video" />}
            onClick={onMockOpen}
          >
            Зафиксировать Mock-интервью
          </Button>
          <Button
            size="sm"
            color="secondary"
            className="font-mono text-xs"
            startContent={<Icon icon="lucide:clipboard-list" />}
            onClick={onFinalOpen}
          >
            Назначить финальную проверку
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка: прогресс по блокам */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted">
            Прогресс по блокам
          </h3>
          {blocks.map((block) => {
            const isWaiting = block.status === "waiting_buddy_confirmation";
            const isApproved = block.status === "approved";
            return (
              <Card
                key={block.id}
                className={`bg-surface border shadow-none rounded-xl ${isWaiting ? "border-amber-500/40" : "border-border-subtle"}`}
              >
                <CardBody className="p-4 space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm font-bold font-mono">
                        {block.title}
                      </h4>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Материалов изучено: {block.percent}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isWaiting && (
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          className="h-7 text-xs font-mono"
                          onClick={() => approveBlock(block.id)}
                        >
                          Подтвердить блок
                        </Button>
                      )}
                      {isApproved && (
                        <Chip
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={
                            <Icon
                              icon="lucide:check-circle"
                              className="w-3 h-3"
                            />
                          }
                        >
                          Закрыт
                        </Chip>
                      )}
                    </div>
                  </div>
                  <Progress
                    value={block.percent}
                    size="sm"
                    color={
                      isApproved ? "success" : isWaiting ? "warning" : "primary"
                    }
                  />
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted">
              Финальные проверки
            </h3>
            <Card className="bg-surface border border-border-subtle shadow-none rounded-xl mt-2">
              <CardBody className="p-4 space-y-3">
                {finalChecks.length === 0 && (
                  <p className="text-xs text-text-muted text-center">
                    Нет назначенных финальных проверок
                  </p>
                )}
                {finalChecks.map((fc) => (
                  <div
                    key={fc.id}
                    className="flex justify-between items-center border-b border-border-subtle/40 last:border-0 pb-2"
                  >
                    <div>
                      <span className="text-xs font-mono font-semibold">
                        {fc.type === "final_technical"
                          ? "Техничка"
                          : "Прожарка"}
                      </span>
                      <p className="text-[10px] text-text-muted">
                        {fc.scheduled_at
                          ? new Date(fc.scheduled_at).toLocaleString()
                          : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        color={
                          fc.status === "completed"
                            ? "success"
                            : fc.status === "failed"
                              ? "danger"
                              : "warning"
                        }
                        variant="flat"
                      >
                        {fc.status === "scheduled"
                          ? "Назначена"
                          : fc.status === "completed"
                            ? "Пройдена"
                            : fc.status === "failed"
                              ? "Не пройдена"
                              : fc.status}
                      </Chip>
                      {fc.status === "scheduled" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            color="success"
                            variant="light"
                            isIconOnly
                            onClick={() => completeFinalCheck(fc.id, true)}
                          >
                            <Icon icon="lucide:check" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isIconOnly
                            onClick={() => completeFinalCheck(fc.id, false)}
                          >
                            <Icon icon="lucide:x" className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Лог активности */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted">
              Лог активности
            </h3>
            <Card className="bg-surface border border-border-subtle shadow-none rounded-xl mt-2">
              <CardBody className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {activity.length === 0 && (
                  <p className="text-xs text-text-muted text-center py-4">
                    Нет активности
                  </p>
                )}
                {activity.map((act, idx) => (
                  <div key={act.id || idx} className="flex gap-3 text-xs">
                    <div className="p-1.5 bg-canvas rounded border border-border-subtle text-text-muted">
                      <Icon icon="lucide:activity" className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-text-main">
                        {getActivityMessage(act)}
                      </p>
                      <p className="text-[10px] text-text-muted font-mono">
                        {act.created_at
                          ? new Date(
                              act.created_at.replace("+00", "Z"),
                            ).toLocaleString()
                          : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Модалка mock собеседования */}
      <Modal isOpen={mockOpen} onClose={onMockClose}>
        <ModalContent>
          <ModalHeader className="font-mono">
            Результаты Mock-собеседования
          </ModalHeader>
          <ModalBody className="space-y-3">
            <Input
              label="Компания"
              placeholder="Яндекс"
              size="sm"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Позиция"
              placeholder="Junior Go"
              size="sm"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <Textarea
              label="Фидбэк"
              placeholder="Что понравилось, что улучшить..."
              size="sm"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="flat" onClick={onMockClose}>
              Отмена
            </Button>
            <Button
              size="sm"
              color="primary"
              isLoading={submittingMock}
              onClick={createMock}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Модалка назначения финальной проверки */}
      <Modal isOpen={finalOpen} onClose={onFinalClose}>
        <ModalContent>
          <ModalHeader className="font-mono">
            Назначить финальную проверку
          </ModalHeader>
          <ModalBody className="space-y-3">
            <Select
              label="Тип проверки"
              size="sm"
              selectedKeys={[finalType]}
              onSelectionChange={(keys) =>
                setFinalType(
                  Array.from(keys)[0] as "final_technical" | "final_roast",
                )
              }
            >
              <SelectItem key="final_technical" textValue="Техничка">
                Техничка
              </SelectItem>
              <SelectItem key="final_roast" textValue="Прожарка">
                Прожарка
              </SelectItem>
            </Select>
            <Input
              type="datetime-local"
              size="sm"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="flat" onClick={onFinalClose}>
              Отмена
            </Button>
            <Button
              size="sm"
              color="primary"
              isLoading={submittingFinal}
              onClick={scheduleFinalCheck}
            >
              Назначить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
