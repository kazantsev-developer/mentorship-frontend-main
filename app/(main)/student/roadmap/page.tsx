"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/components/api";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Spinner,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Material {
  id: string;
  title: string;
  description?: string;
  type: string;
  url?: string;
  is_required: boolean;
  viewed: boolean;
}

interface Block {
  id: string;
  title: string;
  description?: string;
  progress: {
    status: "not_started" | "in_progress" | "waiting_buddy_confirmation" | "approved";
    percent: number;
  };
  materials: Material[];
}

const getStatusInfo = (status: string): { color: "default" | "primary" | "warning" | "success"; text: string } => {
  switch (status) {
    case "in_progress":
      return { color: "primary", text: "В процессе" };
    case "waiting_buddy_confirmation":
      return { color: "warning", text: "Ожидает Buddy" };
    case "approved":
      return { color: "success", text: "Подтверждён" };
    default:
      return { color: "default", text: "Не начат" };
  }
};

export default function StudentRoadmap() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoadmap = async () => {
    try {
      const data = await api.get<Block[]>("/api/roadmap");
      setBlocks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  const markViewed = async (materialId: string) => {
    try {
      await api.post("/api/materials/view", { material_id: materialId });
      await loadRoadmap();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner className="flex h-[70vh] items-center justify-center" color="primary" size="lg" />;
  if (blocks.length === 0) return <div className="p-8 text-center text-text-muted">Нет блоков</div>;

  const COLUMNS = [
    { type: "theory", label: "Теория", icon: "lucide:book-open", color: "text-blue-500" },
    { type: "questions", label: "Вопросы", icon: "lucide:help-circle", color: "text-amber-500" },
    { type: "practice", label: "Практика", icon: "lucide:code-2", color: "text-emerald-500" },
    { type: "homework", label: "Домашка", icon: "lucide:home", color: "text-purple-500" },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-4">
      <Accordion variant="splitted" className="px-0 gap-4">
        {blocks.map((block) => {
          const statusInfo = getStatusInfo(block.progress?.status || "not_started");
          const percent = block.progress?.percent || 0;
          const materials = block.materials || [];
          return (
            <AccordionItem
              key={block.id}
              className="bg-surface border border-border-subtle rounded-xl px-4"
              title={
                <div className="flex flex-wrap justify-between items-center w-full pr-4 gap-2">
                  <div className="flex flex-col text-left">
                    <span className="text-base font-semibold text-text-main font-mono">{block.title}</span>
                    {block.description && <span className="text-xs text-text-muted font-normal mt-0.5">{block.description}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <Chip size="sm" variant="flat" color={statusInfo.color} className="font-mono">{statusInfo.text}</Chip>
                    <span className="text-sm font-bold font-mono text-text-muted">{percent}%</span>
                  </div>
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-4 border-t border-border-subtle mt-2">
                {COLUMNS.map((col) => {
                  const filtered = materials.filter((m) => m.type === col.type);
                  return (
                    <div key={col.type} className="flex flex-col bg-canvas/40 rounded-lg p-2 min-h-[150px]">
                      <div className="flex items-center gap-2 px-2 pb-3 pt-1 border-b border-border-subtle/40 mb-3">
                        <Icon icon={col.icon} className={`w-4 h-4 ${col.color}`} />
                        <span className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted">{col.label}</span>
                        <span className="text-xs font-mono bg-border-subtle text-text-muted px-1.5 py-0.5 rounded ml-auto">{filtered.length}</span>
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <AnimatePresence mode="popLayout">
                          {filtered.map((mat, idx) => (
                            <motion.div
                              key={mat.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2, delay: idx * 0.04 }}
                              className="group flex flex-col p-3 rounded-md bg-surface border border-border-subtle hover:border-brand-primary/40 transition-all shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-semibold text-text-main line-clamp-2 leading-snug">{mat.title}</span>
                                  {mat.description && <span className="text-[11px] text-text-muted mt-1 line-clamp-2">{mat.description}</span>}
                                </div>
                                {mat.is_required && !mat.viewed && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" title="Обязательно" />
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border-subtle/30">
                                {mat.url ? (
                                  <Link href={mat.url} isExternal className="text-[11px] text-brand-primary hover:underline flex items-center gap-0.5">
                                    Ресурс <Icon icon="lucide:external-link" className="w-3 h-3" />
                                  </Link>
                                ) : (
                                  <div />
                                )}
                                {mat.viewed ? (
                                  <Chip size="sm" variant="flat" color="success" className="h-6 text-[10px] font-mono" startContent={<Icon icon="lucide:check" className="w-3 h-3" />}>
                                    Пройдено
                                  </Chip>
                                ) : (
                                  <Button size="sm" variant="flat" color="primary" className="h-6 text-[10px] font-mono px-2 min-w-0" onClick={() => markViewed(mat.id)}>
                                    Изучено
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {filtered.length === 0 && <div className="text-center text-text-muted text-[11px] p-4">Нет материалов</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
