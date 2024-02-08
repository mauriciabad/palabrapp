import { QueryData } from '@supabase/supabase-js'
import { supabase } from '../supabase'

export const selectEntryFullInfo =
  `*, categories (*, category_groups (*))` as const

const selectAllEntries = supabase.from('entries').select(selectEntryFullInfo)

export type EntryFullInfo = QueryData<typeof selectAllEntries>[number]
