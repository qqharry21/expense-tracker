'use client';

import { EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Toggle } from '../ui/toggle';
import { IncomeForm } from './IncomeForm';

export const IncomeHeader = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">收入</h1>
      <div className="inline-flex items-center justify-center gap-x-4">
        <Toggle pressed={showChart} onPressedChange={setShowChart} asChild>
          <Button type="button" variant="outline" size="sm" className="h-8">
            {showChart ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
            <span className="ml-2 max-md:hidden">圖表</span>
          </Button>
        </Toggle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="default" size="sm">
              <PlusIcon size={16} />
              <span className="ml-2 max-md:hidden">新增收入</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增收入</DialogTitle>
            </DialogHeader>
            <div className="overflow-auto md:max-h-[650px]">
              <IncomeForm
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
