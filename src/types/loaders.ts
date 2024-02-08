import { FC } from 'react'

export type FCWithLoader<
  T extends Record<string, unknown>,
  L extends () => Promise<Record<string, unknown>>,
> = FC<T> & {
  loader: L
}

export type LoaderData<L extends () => Promise<Record<string, unknown>>> =
  Awaited<ReturnType<L>>
