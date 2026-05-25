'use client';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function BuddyStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/api/my-students').then(setStudents).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  return (<div className="max-w-5xl mx-auto py-8"><h1 className="text-3xl font-bold mb-6">Мои ученики</h1><Table><TableHeader><TableColumn>Имя</TableColumn><TableColumn>Текущий блок</TableColumn><TableColumn>Прогресс</TableColumn><TableColumn>Статус</TableColumn></TableHeader><TableBody>{students.map(s=>(<TableRow key={s.id} className="cursor-pointer hover:bg-default-100" onClick={()=>window.location.href=`/buddy/students/${s.id}`}><TableCell><div className="flex items-center gap-2"><Icon icon="solar:user-linear" width="18" height="18" />{s.display_name}</div></TableCell><TableCell>{s.current_block_title||'—'}</TableCell><TableCell>{s.overall_progress_percent||0}%</TableCell><TableCell>{s.has_pending && <Chip color="warning" size="sm">Ожидает подтверждения</Chip>}</TableCell></TableRow>))}</TableBody></Table></div>);
}
