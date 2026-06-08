import React from 'react';
import { Search, SlidersHorizontal, RefreshCw, XCircle } from 'lucide-react';
import { useExpense, CATEGORY_METADATA } from '../context/ExpenseContext';
import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import TransactionItem from './TransactionItem';

const TransactionList = () => {
  const {
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy
  } = useExpense();

  // Reset all search and filter fields
  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSortBy('date-desc');
  };

  // Get categories list depending on the selected type filter
  const categoriesList = ['all', ...Object.keys(CATEGORY_METADATA).filter((cat) => {
    if (typeFilter === 'all') return true;
    return CATEGORY_METADATA[cat].type === typeFilter;
  })];

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    if (!groups[tx.date]) {
      groups[tx.date] = [];
    }
    groups[tx.date].push(tx);
    return groups;
  }, {});

  // Sort dates to ensure groups align with the overall sort selection
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    if (sortBy.startsWith('date-asc')) {
      return new Date(a) - new Date(b);
    }
    // Default to date descending
    return new Date(b) - new Date(a);
  });

  const getGroupHeader = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';

    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in delay-2">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Transaction History
        </h3>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Showing {filteredTransactions.length} records
        </span>
      </div>

      {/* Filter and Search Bar Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Row 1: Search & Sort */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search descriptions, notes, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {/* Row 2: Type Filter, Category Filter, Sort Order */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          {/* Segmented control for Type */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            width: '100%'
          }}>
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTypeFilter(t);
                  setCategoryFilter('all'); // Reset category filter on type toggle
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  borderRadius: 'calc(var(--radius-md) - 4px)',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  backgroundColor: typeFilter === t ? 'var(--bg-secondary)' : 'transparent',
                  color: typeFilter === t ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: typeFilter === t ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.825rem', padding: '0.5rem 0.75rem' }}
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.825rem', padding: '0.5rem 0.75rem' }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Grouped Transaction Lists */}
      {filteredTransactions.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          textAlign: 'center',
          gap: '0.75rem'
        }} className="animate-scale-in">
          <XCircle size={44} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              No matches found
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Try adjusting your keyword query or resetting search criteria filters.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleResetFilters} icon={RefreshCw} style={{ marginTop: '0.5rem' }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
          {sortedDates.map((dateStr) => (
            <div key={dateStr} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                paddingLeft: '0.25rem',
                marginTop: '0.25rem'
              }}>
                {getGroupHeader(dateStr)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {groupedTransactions[dateStr].map((tx) => (
                  <TransactionItem key={tx.id} tx={tx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TransactionList;
