'use client';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Card, CardBody, Chip, Tabs, Tab, Spinner, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function StudentCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const data = await api.get('/api/calendar/events');
      // Нормализация: ключи могут быть с большой буквы
      const normalized = (data || []).map((e: any) => ({
        id: e.ID || e.id,
        title: e.Title || e.title,
        type: e.Type || e.type,
        start_datetime: e.StartDatetime || e.start_datetime,
        description: e.Description || e.description,
      }));
      setEvents(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  if (loading) return <Spinner className="flex h-[50vh] justify-center" color="primary" />;

  const filtered = filterType === 'all' ? events : events.filter(e => e.type === filterType);
  const sorted = [...filtered].sort((a,b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());

  // Группировка по дате
  const grouped = sorted.reduce((acc, ev) => {
    const d = new Date(ev.start_datetime);
    const dateKey = d.toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(ev);
    return acc;
  }, {} as Record<string, any[]>);

  // Текущая дата для сетки месяца
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // сдвиг на понедельник
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Определяем, есть ли событие в этот день (сравниваем только день, месяц и год)
  const hasEventOnDate = (year: number, month: number, day: number) => {
    return sorted.some(ev => {
      const d = new Date(ev.start_datetime);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  // Массив дней для сетки (включая дни предыдущего и следующего месяцев)
  const daysArray = [];
  const prevMonthDays = startDay;
  const prevMonthDate = new Date(currentYear, currentMonth, 0);
  const prevMonthDaysCount = prevMonthDate.getDate();
  for (let i = prevMonthDaysCount - prevMonthDays + 1; i <= prevMonthDaysCount; i++) {
    daysArray.push({ day: i, month: currentMonth - 1, year: currentYear, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ day: i, month: currentMonth, year: currentYear, isCurrentMonth: true });
  }
  const remainingCells = (42 - daysArray.length) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    daysArray.push({ day: i, month: currentMonth + 1, year: currentYear, isCurrentMonth: false });
  }

  // Разбиваем на недели
  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    weeks.push(daysArray.slice(i, i + 7));
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto bg-canvas min-h-screen text-text-main py-4 space-y-6">
      {/* Центрированные фильтры */}
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap gap-2 bg-surface p-1 border border-border-subtle rounded-lg max-w-fit">
          <Button size="sm" variant={filterType==='all'?'flat':'light'} color={filterType==='all'?'primary':'default'} onClick={()=>setFilterType('all')} className="font-mono text-xs h-8 px-4">Все</Button>
          <Button size="sm" variant={filterType==='mock_interview'?'flat':'light'} color={filterType==='mock_interview'?'secondary':'default'} onClick={()=>setFilterType('mock_interview')} className="font-mono text-xs h-8 px-4">Mock</Button>
          <Button size="sm" variant={filterType==='real_interview'?'flat':'light'} color={filterType==='real_interview'?'primary':'default'} onClick={()=>setFilterType('real_interview')} className="font-mono text-xs h-8 px-4">Real</Button>
          <Button size="sm" variant={filterType==='block_review'?'flat':'light'} color={filterType==='block_review'?'success':'default'} onClick={()=>setFilterType('block_review')} className="font-mono text-xs h-8 px-4">Ревью</Button>
          <Button size="sm" variant={filterType==='final_technical'?'flat':'light'} color={filterType==='final_technical'?'danger':'default'} onClick={()=>setFilterType('final_technical')} className="font-mono text-xs h-8 px-4">Техничка</Button>
          <Button size="sm" variant={filterType==='final_roast'?'flat':'light'} color={filterType==='final_roast'?'warning':'default'} onClick={()=>setFilterType('final_roast')} className="font-mono text-xs h-8 px-4">Прожарка</Button>
        </div>
      </div>

      <Tabs variant="underlined" color="primary">
        <Tab key="timeline" title={<div className="flex items-center gap-2 font-mono text-xs"><Icon icon="lucide:layers" className="w-4 h-4" /> Ближайшие 7 дней</div>}>
          <div className="relative border-l border-border-subtle ml-4 pl-6 space-y-6 mt-6">
            {Object.entries(grouped).map(([dateKey, dayEvents]) => (
              <div key={dateKey} className="space-y-3">
                <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-surface border-2 border-brand-primary" />
                <div className="text-xs font-mono font-bold text-brand-primary">{new Date(dateKey).toLocaleDateString()}</div>
                {dayEvents.map((ev: any) => {
                  const typeLabel: Record<string, string> = {
                    mock_interview: 'Mock', real_interview: 'Real', block_review: 'Ревью блока',
                    final_technical: 'Техничка', final_roast: 'Прожарка', custom: 'Событие'
                  };
                  const color: Record<string, any> = {
                    mock_interview: 'secondary', real_interview: 'primary', block_review: 'success',
                    final_technical: 'danger', final_roast: 'warning', custom: 'default'
                  };
                  const time = new Date(ev.start_datetime).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
                  return (
                    <Card key={ev.id} className="bg-surface border border-border-subtle rounded-xl shadow-none">
                      <CardBody className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div><Chip size="sm" color={color[ev.type] || 'default'} variant="flat" className="mb-1">{typeLabel[ev.type] || ev.type}</Chip><h4 className="text-sm font-bold">{ev.title}</h4>{ev.description && <p className="text-xs text-text-muted">{ev.description}</p>}</div>
                        <div className="text-right font-mono text-xs bg-canvas p-2 rounded border border-border-subtle shrink-0">{time}</div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            ))}
            {sorted.length === 0 && <p className="text-center text-text-muted py-8">Нет событий</p>}
          </div>
        </Tab>
        <Tab key="grid" title={<div className="flex items-center gap-2 font-mono text-xs"><Icon icon="lucide:calendar" className="w-4 h-4" /> Месяц</div>}>
          <div className="mt-4 bg-surface border border-border-subtle rounded-xl p-4 overflow-x-auto">
            <div className="grid grid-cols-7 gap-px bg-border-subtle rounded-lg overflow-hidden text-center">
              {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => <div key={d} className="bg-canvas py-2 text-[10px] font-bold text-text-muted uppercase">{d}</div>)}
              {weeks.map((week, wi) => week.map((day, di) => {
                const hasEvent = hasEventOnDate(day.year, day.month, day.day);
                return (
                  <div key={`${wi}-${di}`} className={`bg-surface min-h-[80px] p-2 border-t border-l first:border-l-0 border-border-subtle relative ${!day.isCurrentMonth ? 'opacity-40' : ''}`}>
                    <span className="text-[10px] text-text-muted">{day.day}</span>
                    {hasEvent && <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-primary" />}
                  </div>
                );
              }))}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
