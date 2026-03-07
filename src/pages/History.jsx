import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Trash2, Wrench, Fuel, AlertCircle, FileText, Search } from 'lucide-react';
import './History.css';

const getCategoryIcon = (category) => {
  if (category === 'Paliwo') return <Fuel size={20} />;
  if (['Przegląd rejestracyjny', 'Wymiana oleju', 'Naprawa', 'Części', 'Opony'].includes(category)) return <Wrench size={20} />;
  if (['Ubezpieczenie', 'Opłaty drogowe'].includes(category)) return <FileText size={20} />;
  return <AlertCircle size={20} />;
};

const History = () => {
  const { expenses, deleteExpense } = useExpense();
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSorted = useMemo(() => {
    let result = [...expenses];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(e => e.type === filterType);
    }

    // Filter by search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.category.toLowerCase().includes(lower) || 
        (e.description && e.description.toLowerCase().includes(lower))
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [expenses, filterType, sortOrder, searchTerm]);

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Historia Aktywności</h2>
        <p className="text-muted">Przeglądaj, filtruj i zarządzaj wszystkimi wpisami pojazdu.</p>
      </div>

      <div className="filters-glass glass-panel">
        <div className="search-box">
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Szukaj kategorii lub opisu..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field small-select">
            <option value="all">Wszystkie typy</option>
            <option value="wydatek">Tylko Wydatki</option>
            <option value="serwis">Tylko Serwisy</option>
          </select>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="input-field small-select">
            <option value="newest">Najnowsze najpierw</option>
            <option value="oldest">Najstarsze najpierw</option>
          </select>
        </div>
      </div>

      <div className="history-list">
        {filteredAndSorted.length === 0 ? (
          <div className="empty-state glass-panel">
            <FileText size={48} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Brak wyników</h3>
            <p className="text-muted">Nie znaleziono wpisów pasujących do kryteriów.</p>
          </div>
        ) : (
          filteredAndSorted.map(item => (
            <div key={item.id} className="history-item glass-panel">
              <div className="item-icon" data-type={item.type}>
                {getCategoryIcon(item.category)}
              </div>
              
              <div className="item-main">
                <div className="item-head">
                  <h4>{item.category} <span className="item-badge">{item.type}</span></h4>
                  <span className="item-date">{new Date(item.date).toLocaleDateString('pl-PL')}</span>
                </div>
                <p className="item-desc">{item.description || 'Brak dodatkowego opisu.'}</p>
                {item.mileage && <span className="item-mileage">Przebieg: {item.mileage} km</span>}
              </div>

              <div className="item-action">
                <div className="item-amount">-{item.amount.toFixed(2)} zł</div>
                <button className="btn-icon" onClick={() => deleteExpense(item.id)} title="Usuń wpis">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
