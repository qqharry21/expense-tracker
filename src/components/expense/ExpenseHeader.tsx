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
    <div className="flex justify-between gap-4 max-sm:flex-col sm:items-center">
      <div>
        <h1 className="mb-2 text-3xl font-bold">支出</h1>
        <p className="text-sm text-muted-foreground">
          記錄下你已知的固定支出，以便更好地了解你的財務狀況。
        </p>
      </div>
      <div className="flex items-center justify-center gap-x-4 max-sm:w-full">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="max-sm:w-full"
            >
              <PlusIcon size={16} />
              <span>新增支出</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增支出</DialogTitle>
            </DialogHeader>
            <div className="max-h-[600px] overflow-auto md:max-h-[650px]">
              <ExpenseForm
                mode="create"
                onSuccess={() => setDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
