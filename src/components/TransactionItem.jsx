import React from 'react';
import * as Icons from 'lucide-react';
import { useExpense, CATEGORY_METADATA } from '../context/ExpenseContext';
import Button from './ui/Button';

const TransactionItem = ({ tx }) => {
  const { startEditTransaction, deleteTransaction } = useExpense();
  const meta = CATEGORY_METADATA[tx.category] || { color: '#64748b', icon: 'HelpCircle' };
  
  // Resolve Lucide Icon dynamically
  const IconComponent = Icons[meta.icon] || Icons.HelpCircle;
  const isIncome = tx.type === 'income';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        gap: '1rem',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        position: 'relative'
      }}
      className="animate-fade-in"
    >
      {/* Category Icon */}
      <div style={{
        width: '42px',
        height: '42px',
        borderRadius: '10px',
        backgroundColor: `${meta.color}18`, // 10% opacity hex
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: meta.color,
        flexShrink: 0
      }}>
        <IconComponent size={20} />
      </div>

      {/* Main Info */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: '0.925rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginBottom: '0.125rem'
        }}>
          {tx.description}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {formatDate(tx.date)}
          </span>
          <span
            className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}
            style={{ fontSize: '0.675rem', padding: '0.125rem 0.5rem' }}
          >
            {tx.category}
          </span>
        </div>
        {tx.notes && (
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {tx.notes}
          </p>
        )}
      </div>

      {/* Amount and Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{
          textAlign: 'right',
          fontSize: '0.975rem',
          fontWeight: 700,
          color: isIncome ? 'var(--success)' : 'var(--danger)'
        }}>
          {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
        </div>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditTransaction(tx)}
            icon={Icons.Edit2}
            aria-label="Edit transaction"
            style={{ padding: '0.375rem', width: '30px', height: '30px' }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteTransaction(tx.id)}
            icon={Icons.Trash2}
            aria-label="Delete transaction"
            style={{ padding: '0.375rem', width: '30px', height: '30px', color: 'var(--danger)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
