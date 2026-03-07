import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './AddExpense.css';

const CATEGORIES = {
  wydatek: ['Paliwo', 'Myjnia', 'Ubezpieczenie', 'Opłaty drogowe', 'Mandat', 'Inne'],
  serwis: ['Przegląd rejestracyjny', 'Wymiana oleju', 'Naprawa', 'Części', 'Opony', 'Inne']
};

const AddExpense = () => {
  const { addExpense } = useExpense();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    type: 'wydatek',
    category: 'Paliwo',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    description: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.category) return;
    
    addExpense({
      ...formData,
      amount: parseFloat(formData.amount),
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
      date: new Date(formData.date).toISOString()
    });
    
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setFormData(prev => ({ ...prev, [name]: value, category: CATEGORIES[value][0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (isSuccess) {
    return (
      <div className="success-container">
        <CheckCircle size={64} className="success-icon" />
        <h2>Dodano pomyślnie!</h2>
        <p className="text-muted">Przekierowywanie do historii...</p>
      </div>
    );
  }

  return (
    <div className="add-expense-container">
      <div className="form-header">
        <h2>Dodaj Nowy Wpis</h2>
        <p className="text-muted">Wprowadź dane dotyczące wydatku lub serwisu pojazdu.</p>
      </div>

      <form className="expense-form glass-panel" onSubmit={handleSubmit}>
        <div className="form-row type-selector">
          <label className={`type-btn ${formData.type === 'wydatek' ? 'active' : ''}`}>
            <input type="radio" name="type" value="wydatek" checked={formData.type === 'wydatek'} onChange={handleChange} />
            Wydatek
          </label>
          <label className={`type-btn ${formData.type === 'serwis' ? 'active' : ''}`}>
            <input type="radio" name="type" value="serwis" checked={formData.type === 'serwis'} onChange={handleChange} />
            Serwis
          </label>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Kategoria</label>
            <select name="category" value={formData.category} onChange={handleChange} className="input-field" required>
              {CATEGORIES[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Kwota (PLN)</label>
            <input type="number" step="0.01" min="0" name="amount" value={formData.amount} onChange={handleChange} className="input-field" placeholder="np. 250.00" required />
          </div>

          <div className="form-group">
            <label>Data</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required />
          </div>

          <div className="form-group">
            <label>Przebieg (km) - <span>Opcjonalne</span></label>
            <input type="number" min="0" name="mileage" value={formData.mileage} onChange={handleChange} className="input-field" placeholder="np. 150000" />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Zwięzły Opis</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" placeholder="Dodatkowe informacje..." rows="3"></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Anuluj</button>
          <button type="submit" className="btn btn-primary">Zapisz Wpis</button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
