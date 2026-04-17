import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqghzmvjmdrpyktuxahj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZ2h6bXZqbWRycHlrdHV4YWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDA3ODksImV4cCI6MjA5MTMxNjc4OX0.qmOE5zKcmVlAmHvOxkeMUkCfxM5a4mXBRyugeOgW_OQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
