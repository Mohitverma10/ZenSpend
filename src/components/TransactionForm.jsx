import React, { useState, useEffect } from 'react';
import { useExpense, CATEGORY_METADATA } from '../context/ExpenseContext';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

const TransactionForm = () => {
  const {
    isFormOpen,
    closeForm,
    editingTransaction,
    addTransaction,
    updateTransaction
  } = useExpense();

  // --- Form States ---
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  // Fetch categories matching current selection type ('income' or 'expense')
  const categoriesList = Object.entries(CATEGORY_METADATA)
    .filter(([_, meta]) => meta.type === type)
    .map(([name]) => name);

  // Load editing transaction if exists, else reset to defaults
  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setNotes(editingTransaction.notes || '');
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory(
        Object.keys(CATEGORY_METADATA).find(
          (k) => CATEGORY_METADATA[k].type === 'expense'
        ) || ''
      );
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setErrors({});
  }, [editingTransaction, isFormOpen]);

  // Adjust category automatically when toggling between income and expense
  const handleTypeChange = (newType) => {
    setType(newType);
    const firstMatchingCat = Object.keys(CATEGORY_METADATA).find(
      (k) => CATEGORY_METADATA[k].type === newType
    );
    setCategory(firstMatchingCat || '');
  };

  // --- Validation & Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    const parsedAmount = parseFloat(amount);
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be a positive number greater than 0';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const transactionData = {
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date,
      notes: notes.trim()
    };

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }
    closeForm();
  };

  return (
    <Modal
      isOpen={isFormOpen}
      onClose={closeForm}
      title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Transaction Type Radio Selector */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <span className="label" style={{ marginBottom: '0.5rem' }}>Transaction Type</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${type === 'expense' ? 'var(--danger)' : 'var(--border)'}`,
                background: type === 'expense' ? 'var(--danger-light)' : 'transparent',
                color: type === 'expense' ? 'var(--danger)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === 'expense'}
                onChange={() => handleTypeChange('expense')}
                style={{ display: 'none' }}
              />
              Expense
            </label>
            <label
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${type === 'income' ? 'var(--success)' : 'var(--border)'}`,
                background: type === 'income' ? 'var(--success-light)' : 'transparent',
                color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === 'income'}
                onChange={() => handleTypeChange('income')}
                style={{ display: 'none' }}
              />
              Income
            </label>
          </div>
        </div>

        {/* Description Field */}
        <Input
          label="Description"
          placeholder="e.g. Weekly Groceries, Gas, Freelance"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />

        {/* Amount and Date Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />
        </div>

        {/* Category Field */}
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoriesList}
          error={errors.category}
        />

        {/* Notes Field */}
        <Input
          label="Notes (Optional)"
          placeholder="Add extra details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions bar */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
          <Button variant="ghost" onClick={closeForm}>
            Cancel
          </Button>
          <Button type="submit" variant={type === 'expense' ? 'danger' : 'success'}>
            {editingTransaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionForm;
