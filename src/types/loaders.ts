/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'

export type FCForRouter<
  T extends {
    props?: Record<string, unknown>
    loader?: (...args: any[]) => Promise<Record<string, unknown>>
    action?: (...args: any[]) => Promise<any>
  },
> = FC<T['props']> & {
  loader?: T['loader']
  action?: T['action']
}

export type LoaderData<
  L extends (...args: any[]) => Promise<Record<string, unknown>>,
> = Awaited<ReturnType<L>>
