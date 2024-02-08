import { QueryData } from '@supabase/supabase-js'
import { supabase } from '../supabase'

export const selectAllEntries = supabase
  .from('entries')
  .select(`*, categories (*, category_groups (*))`)

export type EntryFullInfo = QueryData<typeof selectAllEntries>[number]
