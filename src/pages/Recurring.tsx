import { BottomNav } from '@/components/BottomNav';
import { RecurringTransactionSheet } from '@/components/RecurringTransactionSheet';
import { RecurringTransactionList } from '@/components/RecurringTransactionList';
import { ArrowLeft, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecurringPage = () => {
  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="px-4 pt-safe pb-4 border-b border-border">
        <div className="pt-4 flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Repeat className="w-5 h-5 text-primary" />
              Recurring Transactions
            </h1>
            <p className="text-sm text-muted-foreground">Manage bills, subscriptions & regular income</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Add button */}
        <div className="flex justify-end">
          <RecurringTransactionSheet />
        </div>

        {/* List */}
        <RecurringTransactionList />
      </main>

      <BottomNav />
    </div>
  );
};

export default RecurringPage;