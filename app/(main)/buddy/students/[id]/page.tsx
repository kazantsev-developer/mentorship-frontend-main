'use client';
import { useEffect, useState, use } from 'react';
import { api } from '@/components/api';
import { Card, CardBody, Button, Chip, Spinner, Progress, Textarea, Input, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Icon } from '@iconify/react';

interface BlockProgress {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'waiting_buddy_confirmation' | 'approved';
  percent: number;
}

export default function BuddyStudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: studentId } = use(params);
  const [student, setStudent] = useState<any>(null);
  const [blocks, setBlocks] = useState<BlockProgress[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submittingMock, setSubmittingMock] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadData = async () => {
    try {
      const [studentRes, blocksRes, activityRes] = await Promise.all([
        api.get(`/api/buddy/students/${studentId}`),
        api.get(`/api/buddy/students/${studentId}/roadmap`),
        api.get(`/api/buddy/students/${studentId}/activity`).catch(() => [])
      ]);
      setStudent(studentRes);
      setBlocks(blocksRes || []);
      setActivity(activityRes || []);
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
    await api.post('/api/blocks/approve', { student_id: studentId, block_id: blockId });
    await loadData();
  };

  const createMock = async () => {
    if (!company || !position) return;
    setSubmittingMock(true);
    await api.post('/api/interviews/mock', { student_id: studentId, company, position, feedback, status: 'completed' });
    setCompany(''); setPosition(''); setFeedback('');
    await loadData();
    onClose();
    setSubmittingMock(false);
  };

  if (loading) return <Spinner className="flex h-[70vh] justify-center" color="secondary" />;

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-2 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-subtle pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-text-main">{student?.display_name}</h1>
          <p className="text-xs text-text-muted mt-0.5 font-mono">ID: {studentId}</p>
        </div>
        <Button size="sm" color="primary" className="font-mono text-xs" startContent={<Icon icon="lucide:video" />} onClick={onOpen}>
          Зафиксировать Mock-интервью
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted">Прогресс по блокам</h3>
          {blocks.map((block) => {
            const isWaiting = block.status === 'waiting_buddy_confirmation';
            const isApproved = block.status === 'approved';
            return (
              <Card key={block.id} className={`bg-surface border shadow-none rounded-xl ${isWaiting ? 'border-amber-500/40' : 'border-border-subtle'}`}>
                <CardBody className="p-4 space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm font-bold font-mono">{block.title}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5">Материалов изучено: {block.percent}%</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isWaiting && (
                        <Button size="sm" color="warning" variant="flat" className="h-7 text-xs font-mono" onClick={() => approveBlock(block.id)}>
                          Подтвердить блок
                        </Button>
                      )}
                      {isApproved && (
                        <Chip size="sm" color="success" variant="flat" startContent={<Icon icon="lucide:check-circle" className="w-3 h-3" />}>
                          Закрыт
                        </Chip>
                      )}
                    </div>
                  </div>
                  <Progress value={block.percent} size="sm" color={isApproved ? 'success' : isWaiting ? 'warning' : 'primary'} />
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-text-muted">Лог активности</h3>
          <Card className="bg-surface border border-border-subtle shadow-none rounded-xl">
            <CardBody className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {activity.length === 0 && <p className="text-xs text-text-muted text-center py-4">Нет активности</p>}
              {activity.map((act, idx) => (
                <div key={act.id || idx} className="flex gap-3 text-xs">
                  <div className="p-1.5 bg-canvas rounded border border-border-subtle text-text-muted"><Icon icon="lucide:activity" className="w-3.5 h-3.5" /></div>
                  <div>
                    <p className="text-text-main">{act.reason || act.metadata?.description || 'Действие'}</p>
                    <p className="text-[10px] text-text-muted font-mono">{new Date(act.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="font-mono">Результаты Mock-собеседования</ModalHeader>
          <ModalBody className="space-y-3">
            <Input label="Компания" placeholder="Яндекс" size="sm" value={company} onChange={e => setCompany(e.target.value)} />
            <Input label="Позиция" placeholder="Junior Go" size="sm" value={position} onChange={e => setPosition(e.target.value)} />
            <Textarea label="Фидбэк" placeholder="Что понравилось, что улучшить..." size="sm" value={feedback} onChange={e => setFeedback(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="flat" onClick={onClose}>Отмена</Button>
            <Button size="sm" color="primary" isLoading={submittingMock} onClick={createMock}>Сохранить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
