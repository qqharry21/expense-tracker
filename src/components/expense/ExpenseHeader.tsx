'use client';

import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ExpenseForm } from './ExpenseForm';

export const ExpenseHeader = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold">支出記錄</h2>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="default" size="sm">
            <PlusIcon className="h-4 w-4" />
            <span className="ml-2 max-md:hidden">新增支出</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增支出</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto md:max-h-[650px]">
            <ExpenseForm mode="create" onSuccess={() => setDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
