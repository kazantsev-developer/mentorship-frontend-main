"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/api";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  Chip,
  Link,
  Input,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Interview {
  id: string;
  type: "mock" | "real";
  company: string;
  position: string;
  grade: string;
  stack: string;
  url?: string;
  date: string;
  status: string;
  result?: string;
  feedback?: string;
}

export default function StudentInterviews() {
  const [myInterviews, setMyInterviews] = useState<Interview[]>([]);
  const [globalInterviews, setGlobalInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [url, setUrl] = useState("");
  const [grade, setGrade] = useState("Junior");
  const [stack, setStack] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadInterviews = async () => {
    try {
      const [myRes, globalRes] = await Promise.all([
        api.get<any[]>("/api/interviews/my"),
        api.get<any[]>("/api/interviews/real"),
      ]);
      const normalize = (arr: any[]) =>
        (arr || []).map((i) => ({
          id: i.ID || i.id,
          type: (i.Type || i.type || "").toLowerCase(),
          company: i.Company || i.company,
          position: i.Position || i.position,
          grade: i.Grade || i.grade,
          stack: i.Stack || i.stack,
          url: i.URL || i.url,
          date: i.Date || i.date,
          status: i.Status || i.status,
          result: i.Result || i.result,
          feedback: i.Feedback || i.feedback,
        }));
      setMyInterviews(normalize(myRes));
      setGlobalInterviews(normalize(globalRes));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleAddReal = async () => {
    if (!company || !position || !url) return;
    setSubmitting(true);
    try {
      await api.post("/api/interviews/real", {
        company,
        position,
        url,
        grade,
        stack,
      });
      await loadInterviews();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <Spinner className="flex h-[50vh] justify-center" color="primary" />;

  const renderCard = (int: Interview) => {
    let resColor: "success" | "danger" | "warning" | "default" = "default";
    if (int.result === "offer") resColor = "success";
    if (int.result === "reject") resColor = "danger";
    if (int.result === "pending") resColor = "warning";
    return (
      <div
        key={int.id}
        className="p-4 bg-surface border border-border-subtle rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Chip
              size="sm"
              variant="flat"
              color={int.type === "mock" ? "secondary" : "primary"}
              className="font-mono text-[10px] h-5"
            >
              {int.type === "mock" ? "MOCK" : "REAL"}
            </Chip>
            <h4 className="text-sm font-bold text-text-main font-mono truncate">
              {int.company}
            </h4>
            <span className="text-xs text-text-muted">•</span>
            <span className="text-xs text-text-muted font-medium">
              {int.position}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-muted font-mono">
            <span>
              Грейд:{" "}
              <b className="text-text-main font-semibold">{int.grade || "—"}</b>
            </span>
            <span>
              Стек:{" "}
              <b className="text-text-main font-semibold">
                {int.stack || "Go"}
              </b>
            </span>
            <span>
              Дата: {int.date ? new Date(int.date).toLocaleDateString() : "—"}
            </span>
          </div>
          {int.feedback && (
            <div className="mt-2 p-2.5 rounded bg-canvas border border-border-subtle/50 text-[11px] text-text-main font-mono">
              <div className="font-bold text-text-muted text-[10px] uppercase tracking-wider mb-0.5">
                Фидбэк ментора:
              </div>
              {int.feedback}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {int.result && int.result !== "no_result" && (
            <Chip
              size="sm"
              color={resColor}
              className="font-mono text-[10px] uppercase"
            >
              {int.result}
            </Chip>
          )}
          {int.url && (
            <Button
              as={Link}
              href={int.url}
              isExternal
              size="sm"
              variant="flat"
              color="primary"
              className="font-mono text-xs h-8 px-3"
              startContent={
                <Icon icon="lucide:external-link" className="w-3.5 h-3.5" />
              }
            >
              Запись
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-4 space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <Button
          size="sm"
          color="primary"
          startContent={<Icon icon="lucide:plus" className="w-4 h-4" />}
          onClick={onOpen}
        >
          Добавить Real-собес
        </Button>
      </div>

      <Tabs
        variant="underlined"
        color="primary"
        classNames={{ tabList: "border-b border-border-subtle w-full" }}
      >
        <Tab
          key="my"
          title={
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase py-1">
              Мои интервью ({myInterviews.length})
            </div>
          }
        >
          <div className="flex flex-col gap-3 mt-3">
            {myInterviews.map(renderCard)}
            {myInterviews.length === 0 && (
              <p className="text-xs font-mono text-text-muted text-center py-8">
                Интервью пока не проводились.
              </p>
            )}
          </div>
        </Tab>
        <Tab
          key="global"
          title={
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase py-1">
              Общая база ({globalInterviews.length})
            </div>
          }
        >
          <div className="flex flex-col gap-3 mt-3">
            {globalInterviews.map(renderCard)}
            {globalInterviews.length === 0 && (
              <p className="text-xs font-mono text-text-muted text-center py-8">
                Общий каталог пуст.
              </p>
            )}
          </div>
        </Tab>
      </Tabs>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        backdrop="blur"
        classNames={{ base: "bg-surface border border-border-subtle" }}
      >
        <ModalContent>
          <ModalHeader className="font-mono text-xs uppercase tracking-wider">
            Загрузка Real-собеседования
          </ModalHeader>
          <ModalBody className="space-y-3 py-2">
            <Input
              label="Компания"
              size="sm"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <Input
              label="Позиция"
              size="sm"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <Input
              label="Ссылка"
              size="sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Input
              label="Грейд"
              size="sm"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
            <Input
              label="Стек"
              size="sm"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="light"
              className="font-mono text-xs"
              onClick={onClose}
            >
              Отмена
            </Button>
            <Button
              size="sm"
              color="primary"
              className="font-mono text-xs"
              isLoading={submitting}
              onClick={handleAddReal}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
