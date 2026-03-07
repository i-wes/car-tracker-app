import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Trash2, AlertCircle, CheckCircle, CalendarClock, Plus } from 'lucide-react';
import './Reminders.css';

const REMINDER_TYPES = ['Ubezpieczenie OC/AC', 'Przegląd rejestracyjny', 'Serwis olejowy', 'Wymiana rozrządu', 'Inne'];

const Reminders = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useExpense();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: REMINDER_TYPES[0],
    date: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.type) return;
    
    addReminder({
      ...formData,
      date: new Date(formData.date).toISOString()
    });
    
    setFormData({ type: REMINDER_TYPES[0], date: '', description: '' });
    setShowAddForm(false);
  };

  const getDaysLeft = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateString);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="reminders-container">
      <div className="reminders-header">
        <div>
          <h2>Harmonogram i Przypomnienia</h2>
          <p className="text-muted">Nie przegap ważnych terminów związanych z Twoim pojazdem.</p>
        </div>
        {!showAddForm && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Dodaj Termin
          </button>
        )}
      </div>

      {showAddForm && (
        <form className="add-reminder-form glass-panel" onSubmit={handleSubmit}>
          <h3>Nowe Przypomnienie</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Typ przypomnienia</label>
              <select 
                className="input-field" 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                {REMINDER_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Data</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group full">
             <label>Opis (np. Ostatnie raty, nazwa ubezpieczyciela)</label>
             <input 
                type="text" 
                className="input-field" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Anuluj</button>
            <button type="submit" className="btn btn-primary">Zapisz</button>
          </div>
        </form>
      )}

      <div className="reminders-list">
        {reminders.length === 0 ? (
          <div className="empty-state glass-panel">
            <CalendarClock size={48} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Brak przypomnień</h3>
            <p className="text-muted">Dodaj pierwszy termin, o którym mamy Ci przypomnieć.</p>
          </div>
        ) : (
          reminders
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .sort((a, b) => (a.done === b.done) ? 0 : a.done ? 1 : -1) // Uncompleted first
            .map(rem => {
              const daysLeft = getDaysLeft(rem.date);
              const isOverdue = daysLeft < 0 && !rem.done;
              const isUrgent = daysLeft >= 0 && daysLeft <= 14 && !rem.done;

              return (
                <div key={rem.id} className={`reminder-card glass-panel ${rem.done ? 'done' : ''} ${isOverdue ? 'overdue' : ''} ${isUrgent ? 'urgent' : ''}`}>
                  <div className="reminder-status-btn" onClick={() => toggleReminder(rem.id)}>
                    {rem.done ? <CheckCircle size={28} className="status-done" /> : <div className="status-circle"></div>}
                  </div>
                  
                  <div className="reminder-info">
                    <h4>{rem.type}</h4>
                    <p className="desc">{rem.description}</p>
                    <div className="meta">
                      <span className="date">{new Date(rem.date).toLocaleDateString('pl-PL')}</span>
                      {!rem.done && (
                        <span className="days-left">
                          {daysLeft < 0 ? `Po terminie (${Math.abs(daysLeft)} dni)` : 
                            daysLeft === 0 ? 'Dzisiaj!' : `Za ${daysLeft} dni`}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="btn-icon" onClick={() => deleteReminder(rem.id)} title="Usuń wpis">
                    <Trash2 size={20} />
                  </button>
                </div>
              );
          })
        )}
      </div>
    </div>
  );
};

export default Reminders;
