'use client';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function InterviewsPage() {
  const [my, setMy] = useState<any[]>([]);
  const [pub, setPub] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newReal, setNewReal] = useState({ url: '', company: '', position: '', grade: '', stack: '', date: '' });

  const load = () => {
    Promise.all([
      api.get('/api/interviews/my'),
      api.get('/api/interviews/real')
    ]).then(([myData, pubData]) => {
      setMy(myData);
      setPub(pubData);
    }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const addReal = async () => {
    await api.post('/api/interviews/real', newReal);
    onClose();
    load();
  };

  if (loading) return <Spinner />;
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Собеседования</h1>
        <Button color="primary" startContent={<Icon icon="solar:add-circle-linear" width="18" height="18" />} onPress={onOpen}>
          Добавить real-собеседование
        </Button>
      </div>
      <Tabs>
        <Tab title="Мои собеседования">
          <Table><TableHeader><TableColumn>Тип</TableColumn><TableColumn>Компания</TableColumn><TableColumn>Позиция</TableColumn><TableColumn>Дата</TableColumn><TableColumn>Статус</TableColumn><TableColumn>Результат</TableColumn></TableHeader>
          <TableBody>{my.map(i => (<TableRow key={i.id}><TableCell>{i.type}</TableCell><TableCell>{i.company}</TableCell><TableCell>{i.position}</TableCell><TableCell>{new Date(i.date).toLocaleDateString()}</TableCell><TableCell>{i.status}</TableCell><TableCell>{i.result || '—'}</TableCell></TableRow>))}</TableBody></Table>
        </Tab>
        <Tab title="Общие real-собеседования">
          <Table><TableHeader><TableColumn>Студент</TableColumn><TableColumn>Компания</TableColumn><TableColumn>Позиция</TableColumn><TableColumn>Дата</TableColumn><TableColumn>Результат</TableColumn></TableHeader>
          <TableBody>{pub.map(i => (<TableRow key={i.id}><TableCell>#{i.student_id?.slice(0,8)}</TableCell><TableCell>{i.company}</TableCell><TableCell>{i.position}</TableCell><TableCell>{new Date(i.date).toLocaleDateString()}</TableCell><TableCell>{i.result || '—'}</TableCell></TableRow>))}</TableBody></Table>
        </Tab>
      </Tabs>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent><ModalHeader>Добавить real-собеседование</ModalHeader><ModalBody className="gap-3">
          <Input label="Ссылка" value={newReal.url} onChange={e=>setNewReal({...newReal, url:e.target.value})} required />
          <Input label="Компания" value={newReal.company} onChange={e=>setNewReal({...newReal, company:e.target.value})} />
          <Input label="Позиция" value={newReal.position} onChange={e=>setNewReal({...newReal, position:e.target.value})} />
          <Input label="Грейд" value={newReal.grade} onChange={e=>setNewReal({...newReal, grade:e.target.value})} />
          <Input label="Стек" value={newReal.stack} onChange={e=>setNewReal({...newReal, stack:e.target.value})} />
          <Input type="date" label="Дата" value={newReal.date} onChange={e=>setNewReal({...newReal, date:e.target.value})} />
        </ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Отмена</Button><Button color="primary" onPress={addReal}>Добавить</Button></ModalFooter></ModalContent>
      </Modal>
    </div>
  );
}
