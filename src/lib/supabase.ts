import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xwzcxntihpwvyluxties.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3emN4bnRpaHB3dnlsdXh0aWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Nzk1MjMsImV4cCI6MjA2MDI1NTUyM30.gaEdqzr1HV-fbva3KqUci7JZtHKdVl1BWUwZff75uc0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);