"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/api";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface CalendarEvent {
  id: string;
  title: string;
  student_id: string;
  type: string;
  start_datetime: string;
  description?: string;
}

interface Student {
  id: string;
  display_name: string;
}

const typeOptions = [
  {
    value: "mock_interview",
    label: "Mock-собеседование",
    icon: "lucide:video",
  },
  {
    value: "real_interview",
    label: "Real-собеседование",
    icon: "lucide:briefcase",
  },
  {
    value: "block_review",
    label: "Ревью блока",
    icon: "lucide:clipboard-check",
  },
  {
    value: "final_technical",
    label: "Финальная техничка",
    icon: "lucide:shield-alert",
  },
  { value: "final_roast", label: "Прожарка", icon: "lucide:flame" },
  { value: "custom", label: "Другое", icon: "lucide:calendar-days" },
];

export default function BuddyCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEvent, setNewEvent] = useState({
    title: "",
    student_id: "",
    type: "mock_interview",
    start_datetime: "",
    description: "",
  });

  const loadData = async () => {
    try {
      const [eventsData, studentsData] = await Promise.all([
        api.get<CalendarEvent[]>("/api/calendar/events"),
        api.get<Student[]>("/api/my-students"),
      ]);
      setEvents(eventsData || []);
      setStudents(studentsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.student_id || !newEvent.start_datetime)
      return;
    await api.post("/api/calendar/events", newEvent);
    onClose();
    loadData();
    setNewEvent({
      title: "",
      student_id: "",
      type: "mock_interview",
      start_datetime: "",
      description: "",
    });
  };

  if (loading)
    return (
      <Spinner className="flex h-[50vh] justify-center" color="secondary" />
    );

  const now = new Date();
  const next7Days = events.filter(
    (e) =>
      new Date(e.start_datetime) >= now &&
      new Date(e.start_datetime) <= new Date(now.getTime() + 7 * 86400000),
  );
  const grouped = next7Days.reduce(
    (acc, ev) => {
      const dateKey = new Date(ev.start_datetime).toISOString().split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(ev);
      return acc;
    },
    {} as Record<string, CalendarEvent[]>,
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-0 space-y-4">
      <div className="flex justify-between items-center border-b border-border-subtle pb-3">
        <span className="text-xs font-mono font-bold text-text-muted uppercase">
          Расписание ментора
        </span>
        <Button
          size="sm"
          color="primary"
          className="font-mono text-xs h-7"
          startContent={<Icon icon="lucide:plus" className="w-3.5 h-3.5" />}
          onClick={onOpen}
        >
          Создать событие
        </Button>
      </div>

      <div className="p-4 bg-surface border border-border-subtle rounded-xl space-y-4">
        <h2 className="text-xs font-bold font-mono text-text-muted uppercase">
          Ближайшие 7 дней
        </h2>
        <div className="relative border-l border-border-subtle ml-2 pl-6 space-y-4">
          {Object.entries(grouped).map(([dateKey, dayEvents]) => {
            const displayDate = new Date(dateKey).toLocaleDateString();
            return (
              <div key={dateKey} className="space-y-2">
                <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary" />
                <div className="text-xs font-mono font-bold text-brand-primary">
                  {displayDate}
                </div>
                {dayEvents.map((ev) => {
                  const typeLabel =
                    typeOptions.find((t) => t.value === ev.type)?.label ||
                    ev.type;
                  return (
                    <div
                      key={ev.id}
                      className="p-3 bg-canvas border border-border-subtle rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                    >
                      <div>
                        <Chip
                          size="sm"
                          color="primary"
                          variant="flat"
                          className="mb-1 text-[10px] h-5 font-mono"
                        >
                          {typeLabel}
                        </Chip>
                        <h4 className="text-xs font-bold font-mono text-text-main">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-text-muted font-mono mt-0.5">
                          Ученик:{" "}
                          {students.find((s) => s.id === ev.student_id)
                            ?.display_name || ev.student_id}
                        </p>
                      </div>
                      <div className="text-right font-mono text-[10px] bg-surface p-1.5 rounded border border-border-subtle">
                        {new Date(ev.start_datetime).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {next7Days.length === 0 && (
            <p className="text-center text-text-muted py-4 font-mono text-xs">
              Нет предстоящих событий
            </p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
        classNames={{ base: "bg-surface border border-border-subtle" }}
      >
        <ModalContent>
          <ModalHeader className="font-mono text-xs uppercase tracking-wider">
            Новое событие
          </ModalHeader>
          <ModalBody className="space-y-3">
            <Input
              label="Название"
              size="sm"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              required
            />
            <Select
              label="Ученик"
              size="sm"
              selectedKeys={newEvent.student_id ? [newEvent.student_id] : []}
              onChange={(e) =>
                setNewEvent({ ...newEvent, student_id: e.target.value })
              }
              required
            >
              {students.map((s) => (
                <SelectItem key={s.id} textValue={s.display_name}>
                  {s.display_name}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Тип события"
              size="sm"
              selectedKeys={[newEvent.type]}
              onChange={(e) =>
                setNewEvent({ ...newEvent, type: e.target.value })
              }
            >
              {typeOptions.map((t) => (
                <SelectItem key={t.value} textValue={t.label}>
                  {t.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              type="datetime-local"
              size="sm"
              value={newEvent.start_datetime}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start_datetime: e.target.value })
              }
              required
            />
            <Input
              label="Описание"
              size="sm"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="light" onClick={onClose}>
              Отмена
            </Button>
            <Button size="sm" color="primary" onClick={createEvent}>
              Создать
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
