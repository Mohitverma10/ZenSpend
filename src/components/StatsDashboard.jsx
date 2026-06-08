import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Card from './ui/Card';

const StatsDashboard = () => {
  const { totals } = useExpense();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const expenseRatio = totals.income > 0 ? Math.min((totals.expense / totals.income) * 100, 100) : 0;
  const isNegativeBalance = totals.balance < 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="stats-grid animate-fade-in delay-1">
        {/* Total Balance Card */}
        <Card style={{
          position: 'relative',
          overflow: 'hidden',
          background: isNegativeBalance
            ? 'linear-gradient(135deg, var(--danger-light) 0%, var(--bg-secondary) 100%)'
            : 'linear-gradient(135deg, var(--primary-light) 0%, var(--bg-secondary) 100%)',
          borderLeft: `4px solid ${isNegativeBalance ? 'var(--danger)' : 'var(--primary)'}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Balance</span>
            <Wallet size={18} style={{ color: isNegativeBalance ? 'var(--danger)' : 'var(--primary)' }} />
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: isNegativeBalance ? 'var(--danger)' : 'var(--text-primary)',
            transition: 'color var(--transition-fast)'
          }}>
            {formatCurrency(totals.balance)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
            {isNegativeBalance ? 'Overspent context active' : 'Within budget range'}
          </div>
        </Card>

        {/* Total Income Card */}
        <Card style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Income</span>
            <TrendingUp size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--success)'
          }}>
            {formatCurrency(totals.income)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem', fontWeight: 600 }}>
            <ArrowUpRight size={14} />
            <span>Active earnings</span>
          </div>
        </Card>

        {/* Total Expense Card */}
        <Card style={{ borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Expenses</span>
            <TrendingDown size={18} style={{ color: 'var(--danger)' }} />
          </div>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--danger)'
          }}>
            {formatCurrency(totals.expense)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem', fontWeight: 600 }}>
            <ArrowDownRight size={14} />
            <span>Funds spent</span>
          </div>
        </Card>
      </div>

      {/* Expense Ratio Gauge */}
      {totals.income > 0 && (
        <Card className="animate-fade-in delay-2" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Spending Burn Rate</span>
            <span style={{ fontWeight: 700, color: expenseRatio > 80 ? 'var(--danger)' : expenseRatio > 50 ? 'var(--warning)' : 'var(--success)' }}>
              {expenseRatio.toFixed(1)}% of income
            </span>
          </div>
          <div className="category-percentage-bar">
            <div
              className="category-percentage-fill"
              style={{
                width: `${expenseRatio}%`,
                backgroundColor: expenseRatio > 80 ? 'var(--danger)' : expenseRatio > 50 ? 'var(--warning)' : 'var(--primary)'
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatsDashboard;
