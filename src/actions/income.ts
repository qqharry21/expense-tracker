'use server';

import { auth } from '@/auth';
import { actionData } from 'http-react';

export async function createIncome(data: any) {
  try {
    const session = await auth();
    if (!session) return actionData('Unauthorized', { status: 401 });
  } catch (error) {
    console.log('🚨 - error', error);
    return actionData(error, { status: 500 });
  }
}
