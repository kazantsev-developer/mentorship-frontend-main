"use client";
import { useEffect, useState } from "react";
import { api } from "@/components/api";
import {
  Card,
  CardBody,
  Chip,
  Tabs,
  Tab,
  Spinner,
  Button,
  Tooltip,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  start_datetime: string;
  description?: string;
}

const typeConfig: Record<
  string,
  {
    label: string;
    color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger";
    icon: string;
  }
> = {
  mock_interview: { label: "Mock", color: "secondary", icon: "lucide:video" },
  real_interview: { label: "Real", color: "primary", icon: "lucide:briefcase" },
  block_review: {
    label: "Ревью блока",
    color: "success",
    icon: "lucide:clipboard-check",
  },
  final_technical: {
    label: "Техничка",
    color: "danger",
    icon: "lucide:shield-alert",
  },
  final_roast: { label: "Прожарка", color: "warning", icon: "lucide:flame" },
  custom: { label: "Событие", color: "default", icon: "lucide:calendar-days" },
};

export default function StudentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const data = await api.get<CalendarEvent[]>("/api/calendar/events");
      const normalized = (data || []).map((e: any) => ({
        id: e.id || e.ID,
        title: e.title || e.Title,
        type: e.type || e.Type,
        start_datetime: e.start_datetime || e.StartDatetime,
        description: e.description || e.Description,
      }));
      setEvents(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading)
    return <Spinner className="flex h-[50vh] justify-center" color="primary" />;

  const filtered =
    filterType === "all" ? events : events.filter((e) => e.type === filterType);
  const isValidDate = (d: any) =>
    !!(d && Date.parse(d) && d !== "0001-01-01T00:00:00Z");
  const validEvents = filtered.filter((e) => isValidDate(e.start_datetime));
  const sorted = [...validEvents].sort(
    (a, b) =>
      new Date(a.start_datetime).getTime() -
      new Date(b.start_datetime).getTime(),
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const getEventsForDay = (day: number) =>
    sorted.filter((ev) => {
      const d = new Date(ev.start_datetime);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

  const getDotColor = (dayEvents: CalendarEvent[]) => {
    if (filterType !== "all") {
      const cfg = typeConfig[filterType];
      if (!cfg) return "bg-brand-primary";
      switch (cfg.color) {
        case "secondary":
          return "bg-purple-500";
        case "primary":
          return "bg-blue-500";
        case "success":
          return "bg-green-500";
        case "danger":
          return "bg-red-500";
        case "warning":
          return "bg-orange-500";
        default:
          return "bg-brand-primary";
      }
    }
    if (dayEvents.length === 0) return "bg-brand-primary";
    const firstType = dayEvents[0].type;
    const cfg = typeConfig[firstType];
    if (!cfg) return "bg-brand-primary";
    switch (cfg.color) {
      case "secondary":
        return "bg-purple-500";
      case "primary":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      case "danger":
        return "bg-red-500";
      case "warning":
        return "bg-orange-500";
      default:
        return "bg-brand-primary";
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-2 space-y-4">
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap gap-2 bg-surface p-1 border border-border-subtle rounded-lg max-w-fit justify-center">
          <Button
            size="sm"
            variant={filterType === "all" ? "flat" : "light"}
            color={filterType === "all" ? "primary" : "default"}
            onClick={() => setFilterType("all")}
            className="font-mono text-sm h-9 px-5 font-normal"
          >
            Все
          </Button>
          {Object.entries(typeConfig).map(([key, cfg]) => (
            <Button
              key={key}
              size="sm"
              variant={filterType === key ? "flat" : "light"}
              color={filterType === key ? cfg.color : "default"}
              onClick={() => setFilterType(key)}
              className="font-mono text-sm h-9 px-5 font-normal"
            >
              {cfg.label}
            </Button>
          ))}
        </div>
      </div>

      <Tabs
        variant="underlined"
        color="primary"
        classNames={{
          tabList: "border-b border-border-subtle w-full flex justify-center",
          tab: "font-mono text-sm font-medium h-10 px-6",
        }}
      >
        <Tab
          key="timeline"
          title={
            <div className="flex items-center gap-2 font-mono">
              <Icon icon="lucide:layers" className="w-4 h-4" /> Ближайшие 7 дней
            </div>
          }
        >
          <div className="relative border-l border-border-subtle ml-4 pl-6 space-y-4 mt-4">
            {sorted.length === 0 && (
              <p className="text-center text-text-muted py-8">Нет событий</p>
            )}
            {Object.entries(
              sorted.reduce(
                (acc, ev) => {
                  const dateKey = new Date(ev.start_datetime)
                    .toISOString()
                    .split("T")[0];
                  if (!acc[dateKey]) acc[dateKey] = [];
                  acc[dateKey].push(ev);
                  return acc;
                },
                {} as Record<string, CalendarEvent[]>,
              ),
            ).map(([dateKey, dayEvents]) => (
              <div key={dateKey} className="space-y-3">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-surface border-2 border-brand-primary" />
                <div className="text-xs font-mono font-bold text-brand-primary">
                  {new Date(dateKey).toLocaleDateString()}
                </div>
                {dayEvents.map((ev) => {
                  const cfg = typeConfig[ev.type] || typeConfig.custom;
                  const time = new Date(ev.start_datetime).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" },
                  );
                  return (
                    <Card
                      key={ev.id}
                      className="bg-surface border border-border-subtle rounded-xl shadow-none"
                    >
                      <CardBody className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <Chip
                            size="md"
                            color={cfg.color}
                            variant="flat"
                            className="mb-1 text-sm font-mono px-3 h-7"
                          >
                            {cfg.label}
                          </Chip>
                          <h4 className="text-sm font-bold font-mono text-text-main">
                            {ev.title}
                          </h4>
                          {ev.description && (
                            <p className="text-xs text-text-muted">
                              {ev.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right font-mono text-xs bg-canvas p-2 rounded border border-border-subtle shrink-0 font-bold">
                          {time}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            ))}
          </div>
        </Tab>
        <Tab
          key="grid"
          title={
            <div className="flex items-center gap-2 font-mono">
              <Icon icon="lucide:calendar" className="w-4 h-4" /> Месяц
            </div>
          }
        >
          <div className="mt-4 bg-surface border border-border-subtle rounded-xl p-4 overflow-x-auto">
            <div className="grid grid-cols-7 gap-px bg-border-subtle rounded-lg overflow-hidden">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                <div
                  key={d}
                  className="bg-canvas text-center py-2 text-[10px] font-bold text-text-muted uppercase font-mono"
                >
                  {d}
                </div>
              ))}
              {Array.from({ length: offset + daysInMonth }).map((_, idx) => {
                const dayNum = idx - offset + 1;
                if (dayNum < 1 || dayNum > daysInMonth)
                  return (
                    <div
                      key={idx}
                      className="bg-surface min-h-[80px] p-2 border-t border-l first:border-l-0 border-border-subtle relative"
                    />
                  );
                const dayEvents = getEventsForDay(dayNum);
                const hasEvents = dayEvents.length > 0;
                const dotColor = getDotColor(dayEvents);
                return (
                  <div
                    key={idx}
                    className="bg-surface min-h-[80px] p-2 border-t border-l first:border-l-0 border-border-subtle relative"
                  >
                    <span className="text-[10px] text-text-muted font-bold">
                      {dayNum}
                    </span>
                    {hasEvents && (
                      <Tooltip
                        content={
                          <div className="flex flex-col gap-1">
                            {dayEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className="flex items-center gap-1 text-xs"
                              >
                                <span className="font-bold">{ev.title}</span>
                                <Chip
                                  size="sm"
                                  color={
                                    typeConfig[ev.type]?.color || "default"
                                  }
                                  variant="flat"
                                  className="text-[9px] h-4"
                                >
                                  {typeConfig[ev.type]?.label || ev.type}
                                </Chip>
                              </div>
                            ))}
                          </div>
                        }
                        placement="top"
                      >
                        <div
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full cursor-pointer hover:w-2.5 hover:h-2.5 transition-all ${dotColor}`}
                        />
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
