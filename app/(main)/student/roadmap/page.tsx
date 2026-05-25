'use client';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Accordion, AccordionItem, Card, CardBody, Button, Chip, Spinner, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

const typeIconMap: Record<string, string> = {
  theory: 'solar:book-linear',
  questions: 'solar:question-circle-linear',
  practice: 'solar:pen-linear',
  homework: 'solar:home-linear',
};

export default function StudentRoadmap() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await api.get('/api/roadmap');
      console.log('Loaded blocks:', data); // отладка
      setBlocks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const markViewed = async (materialId: string) => {
    await api.post('/api/materials/view', { material_id: materialId });
    load();
  };

  if (loading) return <Spinner className="mt-20" />;

  if (blocks.length === 0) {
    return <div className="text-center mt-20">Нет блоков. Добавьте через админ-панель.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">План обучения</h1>
      <Accordion variant="splitted">
        {blocks.map((block) => (
          <AccordionItem
            key={block.ID || block.id}
            title={
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold">{block.Title || block.title}</span>
                <Chip color={block.progress?.status === 'approved' ? 'success' : 'default'} variant="flat">
                  {block.progress?.percent || 0}%
                </Chip>
              </div>
            }
          >
            <Card>
              <CardBody className="gap-4">
                {(block.Materials || block.materials || []).map((mat: any) => (
                  <div key={mat.ID || mat.id} className="flex items-start gap-3 p-3 rounded-xl border border-default-200 bg-default-50">
                    <div className="mt-1">
                      <Icon icon={typeIconMap[mat.Type || mat.type] || 'solar:book-linear'} width="20" height="20" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="font-semibold">{mat.Title || mat.title}</h3>
                          {(mat.Description || mat.description) && <p className="text-sm text-default-500">{mat.Description || mat.description}</p>}
                          {(mat.URL || mat.url) && (
                            <Link href={mat.URL || mat.url} isExternal showAnchorIcon size="sm" className="mt-1">
                              Открыть материал
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {(mat.IsRequired || mat.is_required) && <Chip color="warning" size="sm">Обязательно</Chip>}
                          {(mat.viewed || mat.Viewed) ? (
                            <Chip color="success" startContent={<Icon icon="solar:check-circle-linear" width="16" height="16" />}>Пройдено</Chip>
                          ) : (
                            <Button size="sm" color="primary" startContent={<Icon icon="solar:eye-linear" width="16" height="16" />} onPress={() => markViewed(mat.ID || mat.id)}>
                              Отметить
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
