import React, { useMemo, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Link } from 'react-router-dom';
import { TrendingUp, BellRing, Settings, CalendarClock, ChevronRight, CalendarDays, Calendar as CalendarIcon, Wallet } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { expenses, reminders, toggleReminder } = useExpense();

  const [activeTab, setActiveTab] = useState('monthly');

  const stats = useMemo(() => {
    const now = new Date();
    
    // Obliczanie "Od poniedziałku" dla bieżącego tygodnia
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay() || 7;
    if (day !== 1) { 
        startOfWeek.setHours(-24 * (day - 1)); 
    }
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let weekly = 0;
    let monthly = 0;
    let yearly = 0;
    let max = 0;

    expenses.forEach(curr => {
      const expenseDate = new Date(curr.date);
      const amount = Number(curr.amount);
      max += amount;
      
      if (expenseDate >= startOfWeek) weekly += amount;
      if (expenseDate >= startOfMonth) monthly += amount;
      if (expenseDate >= startOfYear) yearly += amount;
    });

    return { 
      weekly: { label: 'W tym tygodniu', value: weekly.toFixed(2), icon: CalendarDays, color: 'var(--info)', bg: 'rgba(56, 189, 248, 0.2)' },
      monthly: { label: 'W tym miesiącu', value: monthly.toFixed(2), icon: CalendarIcon, color: 'var(--primary)', bg: 'rgba(99, 102, 241, 0.2)' },
      yearly: { label: 'W tym roku', value: yearly.toFixed(2), icon: CalendarClock, color: 'var(--secondary)', bg: 'rgba(168, 85, 247, 0.2)' },
      max: { label: 'Całkowicie', value: max.toFixed(2), icon: Wallet, color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.2)' }
    };
  }, [expenses]);

  const CurrentIcon = stats[activeTab].icon;

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  }, [expenses]);

  const activeReminders = useMemo(() => {
    return reminders.filter(r => !r.done).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);
  }, [reminders]);

  const chartData = useMemo(() => {
    const data = {};
    expenses.forEach(e => {
      const month = new Date(e.date).toLocaleString('pl-PL', { month: 'short', year: 'numeric' });
      if (!data[month]) data[month] = 0;
      data[month] += Number(e.amount);
    });
    return Object.keys(data).map(key => ({ name: key, total: data[key] }));
  }, [expenses]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Pulpit</h2>
          <p className="text-muted">Podsumowanie Twoich wydatków i zbliżających się terminów.</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          + Dodaj Wydatek
        </Link>
      </div>

      <div className="section-header-row">
        <h3 className="section-title">Wydatki</h3>
        <div className="tabs-container">
          {Object.entries(stats).map(([key, data]) => (
            <button 
              key={key} 
              className={`tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <data.icon size={16} />
              <span>{data.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="stats-hero-banner glass-panel">
        <div className="stat-icon hero-icon" style={{ background: stats[activeTab].bg, color: stats[activeTab].color }}>
          <CurrentIcon size={40} />
        </div>
        <div className="stat-info hero-info">
          <p className="text-muted">{stats[activeTab].label}</p>
          <h2>{stats[activeTab].value} PLN</h2>
        </div>
      </div>
      
      <h3 className="section-title" style={{marginTop: '2rem'}}>Bieżące Sprawy</h3>
      <div className="general-stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' }}>
            <BellRing size={24} />
          </div>
          <div className="stat-info">
            <p className="text-muted">Aktywne Przypomnienia</p>
            <h3>{activeReminders.length}</h3>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
            <Settings size={24} />
          </div>
          <div className="stat-info">
            <p className="text-muted">Ostatnia Aktywność</p>
            <h3>{recentExpenses.length > 0 ? new Date(recentExpenses[0].date).toLocaleDateString('pl-PL') : 'Brak'}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-section glass-panel">
          <h3 className="section-title">Wydatki w czasie</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} zł`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--panel-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                  formatter={(value) => [`${value} PLN`, 'Kwota']}
                />
                <Area type="monotone" dataKey="total" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="side-panels">
          <div className="reminders-panel glass-panel">
            <div className="panel-header">
              <h3 className="section-title">Terminy</h3>
              <Link to="/reminders" className="see-all">Wszystkie <ChevronRight size={16}/></Link>
            </div>
            
            {activeReminders.length === 0 ? (
              <p className="text-muted" style={{ padding: '1rem 0', textAlign: 'center' }}>Brak pilnych przypomnień</p>
            ) : (
              <div className="reminder-list">
                {activeReminders.map(rem => (
                  <div key={rem.id} className="reminder-item" onClick={() => toggleReminder(rem.id)}>
                    <div className="reminder-icon">
                      <CalendarClock size={20} />
                    </div>
                    <div className="reminder-details">
                      <h4>{rem.type}</h4>
                      <p>{new Date(rem.date).toLocaleDateString('pl-PL')} • {rem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="recent-activity-panel glass-panel">
             <div className="panel-header">
              <h3 className="section-title">Ostatnie</h3>
              <Link to="/history" className="see-all">Historia <ChevronRight size={16}/></Link>
            </div>
            
            {recentExpenses.length === 0 ? (
              <p className="text-muted" style={{ padding: '1rem 0', textAlign: 'center' }}>Brak aktywności</p>
            ) : (
              <div className="activity-list">
                {recentExpenses.map(exp => (
                  <div key={exp.id} className="activity-item">
                    <div className="activity-details">
                      <h4>{exp.category}</h4>
                      <p className="text-muted">{new Date(exp.date).toLocaleDateString('pl-PL')}</p>
                    </div>
                    <div className="activity-amount">
                      -{Number(exp.amount).toFixed(2)} zł
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
