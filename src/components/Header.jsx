import React from 'react';
import { Plus, Sun, Moon, Wallet } from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import Button from './ui/Button';

const Header = () => {
  const { theme, toggleTheme, openAddForm } = useExpense();

  return (
    <header className="glass-card" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)',
          color: '#fff',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Wallet size={20} />
        </div>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            ZenSpend
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Intelligent Wallet
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Button
          variant="ghost"
          size="md"
          onClick={toggleTheme}
          icon={theme === 'light' ? Moon : Sun}
          aria-label="Toggle theme"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
        />
        <Button
          variant="primary"
          size="md"
          onClick={openAddForm}
          icon={Plus}
        >
          Add Transaction
        </Button>
      </div>
    </header>
  );
};

export default Header;
