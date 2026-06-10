import React, { createContext, useContext, useState, useEffect } from 'react';

// Category metadata containing HSL/Hex color settings and mapping keys for Lucide icons
export const CATEGORY_METADATA = {
  // Income categories
  'Salary & Wages': { type: 'income', color: '#10b981', icon: 'Briefcase' },
  'Freelance & Gigs': { type: 'income', color: '#06b6d4', icon: 'Laptop' },
  'Investments': { type: 'income', color: '#6366f1', icon: 'TrendingUp' },
  'Gifts & Grants': { type: 'income', color: '#ec4899', icon: 'Gift' },
  'Other Income': { type: 'income', color: '#64748b', icon: 'DollarSign' },

  // Expense categories
  'Food & Dining': { type: 'expense', color: '#f59e0b', icon: 'Utensils' },
  'Shopping': { type: 'expense', color: '#d946ef', icon: 'ShoppingBag' },
  'Housing & Rent': { type: 'expense', color: '#ef4444', icon: 'Home' },
  'Utilities': { type: 'expense', color: '#3b82f6', icon: 'Zap' },
  'Transportation': { type: 'expense', color: '#14b8a6', icon: 'Car' },
  'Entertainment & Leisure': { type: 'expense', color: '#8b5cf6', icon: 'Film' },
  'Healthcare': { type: 'expense', color: '#10b981', icon: 'Activity' },
  'Education': { type: 'expense', color: '#a855f7', icon: 'GraduationCap' },
  'Other Expenses': { type: 'expense', color: '#64748b', icon: 'CreditCard' }
};

const ExpenseContext = createContext();

const MOCK_TRANSACTIONS = [
  {
    id: 'mock-1',
    description: 'Tech Co Salary',
    amount: 3200.00,
    type: 'income',
    category: 'Salary & Wages',
    date: '2026-06-01',
    notes: 'Monthly standard salary deposit'
  },
  {
    id: 'mock-2',
    description: 'Monthly Rent Payment',
    amount: 950.00,
    type: 'expense',
    category: 'Housing & Rent',
    date: '2026-06-01',
    notes: 'Apartment rent - June 2026'
  },
  {
    id: 'mock-3',
    description: 'Weekly Grocery Shopping',
    amount: 142.30,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-06-03',
    notes: 'Bought at Whole Foods'
  },
  {
    id: 'mock-4',
    description: 'Freelance Web Design',
    amount: 850.00,
    type: 'income',
    category: 'Freelance & Gigs',
    date: '2026-06-04',
    notes: 'Landing page redesign milestone'
  },
  {
    id: 'mock-5',
    description: 'Electricity & Gas Bill',
    amount: 78.50,
    type: 'expense',
    category: 'Utilities',
    date: '2026-06-05',
    notes: 'Sewerage and power services'
  },
  {
    id: 'mock-6',
    description: 'Movie Night & Snacks',
    amount: 48.00,
    type: 'expense',
    category: 'Entertainment & Leisure',
    date: '2026-06-06',
    notes: 'Cinema tickets and popcorn'
  },
  {
    id: 'mock-7',
    description: 'Local Subway Card Refill',
    amount: 35.00,
    type: 'expense',
    category: 'Transportation',
    date: '2026-06-07',
    notes: 'Monthly transit transit pass'
  }
];

export const ExpenseProvider = ({ children }) => {
  // --- Transactions State ---
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('expense_tracker_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse transactions from local storage', e);
      return [];
    }
  });

  // --- Theme State ---
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('expense_tracker_theme');
      if (saved) return saved;
      // Default to user's system preferences
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  // --- Filter and Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'income', 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'

  // --- UI Interactions State ---
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Sync transactions to Local Storage
  useEffect(() => {
    localStorage.setItem('expense_tracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Sync theme changes to Local Storage & document element attributes
  useEffect(() => {
    localStorage.setItem('expense_tracker_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Toast Manager ---
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'success');
  };

  // --- Transaction CRUD Actions ---
  const addTransaction = (transactionData) => {
    const newTransaction = {
      id: 'tx-' + Date.now() + Math.random().toString(36).substr(2, 5),
      ...transactionData,
      amount: parseFloat(transactionData.amount),
      date: transactionData.date || new Date().toISOString().split('T')[0]
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    showToast(`Transaction "${newTransaction.description}" added successfully!`, 'success');
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updatedData,
              amount: parseFloat(updatedData.amount),
              date: updatedData.date
            }
          : t
      )
    );
    showToast('Transaction updated successfully!', 'success');
    setEditingTransaction(null);
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find((t) => t.id === id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast(`Transaction "${tx?.description}" deleted.`, 'error');
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  // --- Calculated Dashboard Stats ---
  const totals = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') {
        acc.income += tx.amount;
        acc.balance += tx.amount;
      } else {
        acc.expense += tx.amount;
        acc.balance -= tx.amount;
      }
      return acc;
    },
    { balance: 0, income: 0, expense: 0 }
  );

  // --- Filtering & Sorting Computation ---
  const filteredTransactions = transactions
    .filter((tx) => {
      // 1. Search Query filter (matches description, notes, or category name)
      const matchesSearch =
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Type Filter (all / income / expense)
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      
      // 3. Category Filter
      const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      // 4. Sorting logic
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date) || a.id.localeCompare(b.id);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  // Start editing a transaction (opens form modal)
  const startEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTransaction(null);
    setIsFormOpen(false);
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        filteredTransactions,
        totals,
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        typeFilter,
        setTypeFilter,
        categoryFilter,
        setCategoryFilter,
        sortBy,
        setSortBy,
        editingTransaction,
        startEditTransaction,
        isFormOpen,
        openAddForm,
        closeForm,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
