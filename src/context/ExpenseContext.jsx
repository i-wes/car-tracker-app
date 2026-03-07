import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export function useExpense() {
  return useContext(ExpenseContext);
}

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setExpenses([]);
      setReminders([]);
      setLoadingData(false);
      return;
    }

    setLoadingData(true);

    const expensesRef = collection(db, 'users', currentUser.uid, 'expenses');
    const qExpenses = query(expensesRef, orderBy('date', 'desc'));
    
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    const remindersRef = collection(db, 'users', currentUser.uid, 'reminders');
    const qReminders = query(remindersRef, orderBy('date', 'asc'));

    const unsubReminders = onSnapshot(qReminders, (snapshot) => {
      setReminders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoadingData(false);
    });

    return () => {
      unsubExpenses();
      unsubReminders();
    };
  }, [currentUser]);

  const addExpense = async (expense) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'expenses'), expense);
  };

  const deleteExpense = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'expenses', id));
  };

  const addReminder = async (reminder) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'reminders'), { ...reminder, done: false });
  };

  const toggleReminder = async (id) => {
    if (!currentUser) return;
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    
    await updateDoc(doc(db, 'users', currentUser.uid, 'reminders', id), {
      done: !reminder.done
    });
  };

  const deleteReminder = async (id) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'reminders', id));
  };

  const value = {
    expenses,
    addExpense,
    deleteExpense,
    reminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    loadingData
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}
