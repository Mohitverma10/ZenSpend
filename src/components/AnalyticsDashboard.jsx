import React, { useState } from 'react';
import { useExpense, CATEGORY_METADATA } from '../context/ExpenseContext';
import Card from './ui/Card';

const AnalyticsDashboard = () => {
  const { transactions } = useExpense();
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null); // { dayIndex, type: 'income' | 'expense', value, x, y }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // ==========================================
  // DOUGHNUT CHART CALCULATIONS (EXPENSES)
  // ==========================================
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = {};
  expenseTransactions.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const categoryData = Object.entries(categoryTotals)
    .map(([name, val]) => {
      const meta = CATEGORY_METADATA[name] || { color: '#64748b' };
      return {
        name,
        value: val,
        percentage: totalExpenses > 0 ? (val / totalExpenses) * 100 : 0,
        color: meta.color
      };
    })
    .sort((a, b) => b.value - a.value);

  // SVG parameters for Doughnut: Center (100, 100), Radius 60, Stroke 16
  const R = 60;
  const CIRCUMFERENCE = 2 * Math.PI * R; // ~376.99
  let accumulatedPercent = 0;

  // ==========================================
  // TREND BAR CHART CALCULATIONS (LAST 7 DAYS)
  // ==========================================
  const getPastDates = (numDays) => {
    const dates = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const past7Days = getPastDates(7);
  const dailyData = {};
  past7Days.forEach((date) => {
    dailyData[date] = { income: 0, expense: 0 };
  });

  transactions.forEach((tx) => {
    if (dailyData[tx.date]) {
      if (tx.type === 'income') {
        dailyData[tx.date].income += tx.amount;
      } else {
        dailyData[tx.date].expense += tx.amount;
      }
    }
  });

  const barChartData = past7Days.map((date) => {
    const label = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric'
    });
    return {
      date,
      label,
      income: dailyData[date].income,
      expense: dailyData[date].expense
    };
  });

  const maxVal = Math.max(
    ...barChartData.map((d) => Math.max(d.income, d.expense)),
    100 // baseline max
  );

  const plotW = 340;
  const plotH = 150;
  const paddingLeft = 40;
  const paddingTop = 20;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', width: '100%' }}>
      {/* 1. Category Expense Doughnut Chart */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Category Expenses
        </h3>

        {expenseTransactions.length === 0 ? (
          <div style={{
            height: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            No expense records found.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                {categoryData.map((item, idx) => {
                  const percent = item.percentage;
                  const strokeDash = `${(percent * CIRCUMFERENCE) / 100} ${CIRCUMFERENCE}`;
                  const rotation = (accumulatedPercent * 3.6) - 90;
                  accumulatedPercent += percent;

                  return (
                    <circle
                      key={item.name}
                      cx="100"
                      cy="100"
                      r={R}
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDash}
                      strokeDashoffset="0"
                      transform={`rotate(${rotation} 100 100)`}
                      className="chart-pie-slice"
                      onMouseEnter={() => setHoveredSlice({ ...item, idx })}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
                {/* Overlay Text in Center */}
                <circle cx="100" cy="100" r="48" fill="var(--bg-secondary)" />
                <text
                  x="100"
                  y="96"
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="10"
                  fontWeight="600"
                >
                  {hoveredSlice ? hoveredSlice.name : 'TOTAL EXPENSES'}
                </text>
                <text
                  x="100"
                  y="116"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="16"
                  fontWeight="800"
                >
                  {hoveredSlice ? formatCurrency(hoveredSlice.value) : formatCurrency(totalExpenses)}
                </text>
              </svg>
            </div>

            {/* List Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: hoveredSlice?.name === item.name ? 'var(--bg-tertiary)' : 'transparent',
                    transition: 'background-color var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {formatCurrency(item.value)} ({item.percentage.toFixed(0)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* 2. Income vs Expenses Bar Chart */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Weekly Cash Flow
          </h3>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--success)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--danger)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Expenses</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg viewBox="0 0 400 220" width="100%" height="220px" style={{ minWidth: '350px' }}>
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = paddingTop + plotH - pct * plotH;
              return (
                <g key={idx}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={paddingLeft + plotW}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="var(--text-muted)"
                    fontSize="9"
                    fontWeight="500"
                  >
                    {formatCurrency(pct * maxVal).replace('.00', '')}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {barChartData.map((day, i) => {
              const colW = plotW / 7;
              const colX = paddingLeft + i * colW;
              const barWidth = 10;
              const spacing = 4;

              // Income Bar calculations
              const incH = (day.income / maxVal) * plotH;
              const incX = colX + (colW - (barWidth * 2 + spacing)) / 2;
              const incY = paddingTop + plotH - incH;

              // Expense Bar calculations
              const expH = (day.expense / maxVal) * plotH;
              const expX = incX + barWidth + spacing;
              const expY = paddingTop + plotH - expH;

              return (
                <g key={day.date}>
                  {/* Income Bar */}
                  <rect
                    x={incX}
                    y={incY}
                    width={barWidth}
                    height={Math.max(incH, 2)}
                    rx="3"
                    fill="var(--success)"
                    opacity={hoveredBar && (hoveredBar.dayIndex !== i || hoveredBar.type !== 'income') ? 0.6 : 1}
                    style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        dayIndex: i,
                        type: 'income',
                        value: day.income,
                        x: incX + barWidth / 2,
                        y: incY
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Expense Bar */}
                  <rect
                    x={expX}
                    y={expY}
                    width={barWidth}
                    height={Math.max(expH, 2)}
                    rx="3"
                    fill="var(--danger)"
                    opacity={hoveredBar && (hoveredBar.dayIndex !== i || hoveredBar.type !== 'expense') ? 0.6 : 1}
                    style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={() =>
                      setHoveredBar({
                        dayIndex: i,
                        type: 'expense',
                        value: day.expense,
                        x: expX + barWidth / 2,
                        y: expY
                      })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Label */}
                  <text
                    x={colX + colW / 2}
                    y={paddingTop + plotH + 18}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="9"
                    fontWeight="600"
                  >
                    {day.label}
                  </text>
                </g>
              );
            })}

            {/* Tooltip Overlay */}
            {hoveredBar && (
              <g>
                <rect
                  x={hoveredBar.x - 45}
                  y={hoveredBar.y - 32}
                  width="90"
                  height="22"
                  rx="6"
                  fill="var(--bg-secondary)"
                  stroke="var(--border)"
                  strokeWidth="1.5"
                  boxShadow="var(--shadow-md)"
                />
                <text
                  x={hoveredBar.x}
                  y={hoveredBar.y - 17}
                  textAnchor="middle"
                  fill={hoveredBar.type === 'income' ? 'var(--success)' : 'var(--danger)'}
                  fontSize="9.5"
                  fontWeight="700"
                >
                  {formatCurrency(hoveredBar.value)}
                </text>
              </g>
            )}
          </svg>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
