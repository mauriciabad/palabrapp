import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

export const supabase = createClient<Database>(
  'https://tsnycpxyfsftylvafhbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbnljcHh5ZnNmdHlsdmFmaGJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMTU5NDgsImV4cCI6MjAyMjg5MTk0OH0.Uah_7UWZu6d-zyIWYQqcIKYkmaHsF13vnnRLGtaHOck',
)
