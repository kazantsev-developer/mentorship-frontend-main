'use client';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Card, CardBody, Button, Input, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Listbox, ListboxItem, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function BuddyCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newEvent, setNewEvent] = useState({ title: '', student_id: '', start_datetime: '', description: '' });
  const load = () => { api.get('/api/calendar/events').then(setEvents).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const create = async () => { await api.post('/api/calendar/events', newEvent); onClose(); load(); };
  if (loading) return <Spinner />;
  const now = new Date();
  const next7 = events.filter(e => new Date(e.start_datetime) >= now && new Date(e.start_datetime) <= new Date(now.getTime()+7*86400000));
  return (<div className="max-w-5xl mx-auto py-8 space-y-6"><div className="flex justify-between items-center"><h1 className="text-3xl font-bold">Календарь событий</h1><Button color="primary" startContent={<Icon icon="solar:add-circle-linear" width="18" height="18" />} onPress={onOpen}>Создать событие</Button></div>
  <Card><CardBody><h2 className="text-xl font-semibold mb-2">Ближайшие 7 дней</h2>{next7.length===0&&<p>Нет событий</p>}<Listbox>{next7.map(e=><ListboxItem key={e.id} startContent={<Icon icon="solar:calendar-linear" width="20" height="20" />} description={new Date(e.start_datetime).toLocaleString()}>{e.title} — ученик #{e.student_id.slice(0,8)}</ListboxItem>)}</Listbox></CardBody></Card>
  <Card><CardBody><h2 className="text-xl font-semibold mb-2">Все события</h2><Listbox>{events.map(e=><ListboxItem key={e.id} startContent={<Icon icon="solar:calendar-linear" width="20" height="20" />} description={new Date(e.start_datetime).toLocaleString()}>{e.title} — ученик #{e.student_id.slice(0,8)}</ListboxItem>)}</Listbox></CardBody></Card>
  <Modal isOpen={isOpen} onClose={onClose}><ModalContent><ModalHeader>Новое событие</ModalHeader><ModalBody className="gap-3"><Input label="Название" value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title:e.target.value})} required /><Input label="ID ученика" value={newEvent.student_id} onChange={e=>setNewEvent({...newEvent, student_id:e.target.value})} required /><Input type="datetime-local" label="Дата и время" value={newEvent.start_datetime} onChange={e=>setNewEvent({...newEvent, start_datetime:e.target.value})} required /><Input label="Описание" value={newEvent.description} onChange={e=>setNewEvent({...newEvent, description:e.target.value})} /></ModalBody><ModalFooter><Button variant="light" onPress={onClose}>Отмена</Button><Button color="primary" onPress={create}>Создать</Button></ModalFooter></ModalContent></Modal>
  </div>);
}
