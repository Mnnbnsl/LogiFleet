import React from 'react';
import Card from './Card';

export default function ExpensesPageContent() {
  return (
    <Card title="Expenses">
      <div className="p-4 text-sm text-slate-600 dark:text-slate-300">No expenses recorded — this page is a placeholder.</div>
    </Card>
  );
}
