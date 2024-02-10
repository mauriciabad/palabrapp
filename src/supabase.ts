import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

export const SUPABASE_PROJECT_ID = 'tsnycpxyfsftylvafhbp'
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`

export const supabase = createClient<Database>(
  SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbnljcHh5ZnNmdHlsdmFmaGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMTU5NDgsImV4cCI6MjAyMjg5MTk0OH0.Uah_7UWZu6d-zyIWYQqcIKYkmaHsF13vnnRLGtaHOck',
)
