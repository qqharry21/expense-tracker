import * as Types from '@prisma/client';

export { Types };

export enum Frequency {
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
  ONE_TIME = 'ONE_TIME',
}
