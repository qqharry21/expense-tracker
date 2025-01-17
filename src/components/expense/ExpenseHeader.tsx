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
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">支出</h1>
      <div className="inline-flex items-center justify-center gap-x-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="default" size="sm">
              <PlusIcon size={16} />
              <span className="ml-2 max-md:hidden">新增支出</span>
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
