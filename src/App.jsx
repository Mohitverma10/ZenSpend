import React from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Header from './components/Header';
import StatsDashboard from './components/StatsDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Toast from './components/ui/Toast';

function AppContent() {
  return (
    <div className="app-container animate-fade-in">
      {/* Brand Header */}
      <Header />
      
      {/* Dashboard Area */}
      <div className="dashboard-grid">
        {/* Left Area: Summary Stats & Transaction Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <StatsDashboard />
          <TransactionList />
        </div>
        
        {/* Right Area: Interactive Charts & Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AnalyticsDashboard />
        </div>
      </div>
      
      {/* Overlay Drawers/Modals & Notifications */}
      <TransactionForm />
      <Toast />
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
