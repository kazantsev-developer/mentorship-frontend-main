'use client';
import { useEffect, useState } from 'react';
import { api } from '@/components/api';
import { Card, CardBody, Button, Progress, CircularProgress, Chip, Tabs, Tab, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function StudentProgress() {
  const [profile, setProfile] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [oneOnOneRequests, setOneOnOneRequests] = useState<any[]>([]);
  const [finalChecks, setFinalChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingRequest, setCreatingRequest] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadData = async () => {
    try {
      const [bal, hist, ach, profileData, requests, checks] = await Promise.all([
        api.get('/api/bonus/balance').catch(() => ({ balance: 0 })),
        api.get('/api/bonus/history').catch(() => []),
        api.get('/api/achievements').catch(() => []),
        api.get('/api/user/profile').catch(() => null),
        api.get('/api/one-on-one').catch(() => []),
        api.get('/api/final-checks/student/me').catch(() => [])
      ]);
      setBalance(bal.balance || 0);
      setTransactions(hist);
      setAchievements(ach);
      setProfile(profileData);
      setOneOnOneRequests(requests);
      setFinalChecks(checks);
      setDiscount(Math.min(Math.floor((bal.balance || 0) / 100), 15));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const convertBonus = async () => {
    await api.post('/api/bonus/convert', { bonus_amount: 100 });
    loadData();
  };

  const createOneOnOne = async () => {
    setCreatingRequest(true);
    await api.post('/api/one-on-one');
    await loadData();
    setCreatingRequest(false);
    onClose();
  };

  if (loading) return <Spinner className="mt-20" />;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-8">
      <h1 className="text-3xl font-bold">Мой прогресс</h1>

      {/* Верхние виджеты */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-surface border border-subtle">
          <CardBody>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:calendar" className="w-6 h-6 text-brand-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Дней в обучении</p>
                <p className="text-2xl font-mono font-bold">
                  {profile?.learning_started_at ? Math.floor((Date.now() - new Date(profile.learning_started_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
                {profile?.learning_started_at && <p className="text-xs text-muted-foreground">Начало: {new Date(profile.learning_started_at).toLocaleDateString()}</p>}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-surface border border-subtle">
          <CardBody className="items-center text-center">
            <CircularProgress
              size="lg"
              value={42}
              color="primary"
              showValueLabel
              label="Общий прогресс"
            />
          </CardBody>
        </Card>

        <Card className="bg-surface border border-subtle">
          <CardBody>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:wallet" className="w-6 h-6 text-brand-purple" />
              <div>
                <p className="text-sm text-muted-foreground">Бонусы</p>
                <p className="text-2xl font-mono font-bold text-brand-purple">{balance}</p>
              </div>
            </div>
            <Button size="sm" color="secondary" variant="flat" className="mt-3 w-full" onPress={convertBonus} isDisabled={discount >= 15 || balance < 100}>
              Конвертировать 100 → +1% скидки
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-surface border border-subtle">
          <CardBody>
            <div className="flex items-center gap-3">
              <Icon icon="lucide:percent" className="w-6 h-6 text-brand-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Текущая скидка</p>
                <p className="text-2xl font-mono font-bold">{discount}%</p>
                <Progress value={(discount / 15) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground">Максимум 15%</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Достижения */}
      <Card>
        <CardBody>
          <h2 className="text-xl font-semibold mb-4">🏆 Достижения</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {achievements.map((ach) => (
              <div key={ach.id} className={`text-center p-3 rounded-xl border ${ach.received ? 'border-brand-purple/30 bg-brand-purple/5' : 'border-subtle opacity-60 grayscale'}`}>
                <Icon icon="lucide:trophy" className="w-8 h-8 mx-auto mb-2 text-brand-purple" />
                <h3 className="text-sm font-medium">{ach.title}</h3>
                <p className="text-xs text-muted-foreground">+{ach.reward_bonus} бонусов</p>
                {!ach.received && ach.progress && (
                  <Progress value={ach.progress.percent} className="mt-2" size="sm" />
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Финальные проверки и заявки 1x1 (табы) */}
      <Tabs>
        <Tab title="Финальные проверки">
          <Card>
            <CardBody>
              {finalChecks.length === 0 && <p>Финальные проверки ещё не назначены.</p>}
              {finalChecks.map((fc) => (
                <div key={fc.id} className="flex items-center gap-3 py-2 border-b border-subtle last:border-0">
                  <Icon icon={fc.type === 'final_technical' ? 'lucide:microscope' : 'lucide:flame'} className="w-5 h-5" />
                  <span className="flex-1">{fc.type === 'final_technical' ? 'Техничка' : 'Прожарка'}</span>
                  <Chip color={fc.status === 'completed' ? 'success' : 'warning'} size="sm">{fc.status}</Chip>
                </div>
              ))}
            </CardBody>
          </Card>
        </Tab>
        <Tab title="Заявки 1x1">
          <Card>
            <CardBody>
              <Button color="primary" onPress={onOpen} className="mb-4">Создать заявку (1000 бонусов)</Button>
              <Table>
                <TableHeader>
                  <TableColumn>Дата</TableColumn>
                  <TableColumn>Статус</TableColumn>
                </TableHeader>
                <TableBody>
                  {oneOnOneRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                      <TableCell><Chip color={req.status === 'approved' ? 'success' : 'warning'}>{req.status}</Chip></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
        <Tab title="История бонусов">
          <Card>
            <CardBody>
              <Table>
                <TableHeader>
                  <TableColumn>Дата</TableColumn>
                  <TableColumn>Тип</TableColumn>
                  <TableColumn>Сумма</TableColumn>
                  <TableColumn>Причина</TableColumn>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell className={tx.amount > 0 ? 'text-green-600' : 'text-red-600'}>{tx.amount}</TableCell>
                      <TableCell>{tx.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Создание заявки 1x1</ModalHeader>
          <ModalBody>
            <p>Стоимость: 1000 бонусов. Бонусы спишутся после одобрения администратором.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Отмена</Button>
            <Button color="primary" isLoading={creatingRequest} onPress={createOneOnOne}>Создать</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
