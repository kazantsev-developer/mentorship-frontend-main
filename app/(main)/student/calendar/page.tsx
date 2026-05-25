'use client';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Card, CardBody, Listbox, ListboxItem, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function StudentCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/api/calendar/events').then(setEvents).finally(() => setLoading(false));
  }, []);
  if (loading) return <Spinner />;
  const now = new Date();
  const next7 = events.filter(e => new Date(e.start_datetime) >= now && new Date(e.start_datetime) <= new Date(now.getTime()+7*86400000));
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Мой календарь</h1>
      <Card><CardBody><h2 className="text-xl font-semibold mb-2">Ближайшие 7 дней</h2>{next7.length === 0 && <p>Нет событий</p>}<Listbox>{next7.map(e => (<ListboxItem key={e.id} startContent={<Icon icon="solar:calendar-linear" width="20" height="20" />} description={new Date(e.start_datetime).toLocaleString()}>{e.title}</ListboxItem>))}</Listbox></CardBody></Card>
      <Card><CardBody><h2 className="text-xl font-semibold mb-2">Все события</h2><Listbox>{events.map(e => (<ListboxItem key={e.id} startContent={<Icon icon="solar:calendar-linear" width="20" height="20" />} description={new Date(e.start_datetime).toLocaleString()}>{e.title}</ListboxItem>))}</Listbox></CardBody></Card>
    </div>
  );
}
