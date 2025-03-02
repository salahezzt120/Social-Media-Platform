import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ayvxnhajlmjkpwdrksus.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dnhuaGFqbG1qa3B3ZHJrc3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MTE1ODYsImV4cCI6MjA1NjA4NzU4Nn0.tVo2FYamLLsZuqB0AIIDHfXhL6NhaLU4JFhlEGGhkt4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
