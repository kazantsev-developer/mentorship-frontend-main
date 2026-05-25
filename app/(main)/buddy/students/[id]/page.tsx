'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Progress, Button, Card, CardBody, Tabs, Tab, Spinner, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const students = await api.get('/api/my-students');
    const found = students.find((s: any) => s.id === id);
    if (found) setStudent({ ...found, blocks: found.blocks || [] });
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);
  const approveBlock = async (blockId: string) => {
    await api.post('/api/blocks/approve', { student_id: id, block_id: blockId });
    load();
  };
  if (loading) return <Spinner />;
  if (!student) return <div>Ученик не найден</div>;
  return (<div className="max-w-4xl mx-auto py-8 space-y-6"><h1 className="text-3xl font-bold">{student.display_name}</h1><Card><CardBody><p>Общий прогресс: {student.overall_progress_percent}%</p><Progress value={student.overall_progress_percent} color="primary" /></CardBody></Card>
  <Tabs><Tab title="Блоки">{student.blocks.map((b: any) => (<Card key={b.block_id} className="mb-4"><CardBody><div className="flex justify-between items-center"><div><p className="font-semibold">{b.title}</p><p>Прогресс: {b.percent}%</p><Chip size="sm" color={b.status==='approved'?'success':b.status==='waiting_buddy_confirmation'?'warning':'default'}>{b.status}</Chip></div>{b.status==='waiting_buddy_confirmation' && <Button color="success" startContent={<Icon icon="solar:check-circle-linear" width="18" height="18" />} onPress={()=>approveBlock(b.block_id)}>Подтвердить блок</Button>}</div></CardBody></Card>))}</Tab>
  <Tab title="Собеседования">{student.interviews?.length? student.interviews.map((i: any)=>(<Card key={i.id} className="mb-2"><CardBody><p>{i.type} — {i.company} ({i.position})</p><p>Статус: {i.status}</p>{i.feedback && <p>Фидбэк: {i.feedback}</p>}</CardBody></Card>)) : <p>Нет собеседований</p>}</Tab>
  <Tab title="Финальные проверки">{student.final_checks?.map((fc: any)=>(<Card key={fc.id} className="mb-2"><CardBody><p>{fc.type} — статус: {fc.status}</p></CardBody></Card>))}</Tab>
  </Tabs></div>);
}
