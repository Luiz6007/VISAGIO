class SupabaseConfig {
  static const url = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://vjzakhgqkmuijoprnfim.supabase.co',
  );

  static const anonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ2anpha2hncWttdWlqb3BybmZpbSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc5OTcwMjU1LCJleHAiOjIwOTU1NDYyNTV9.-HHw-hnEW98dm3P-i3FsgS0fWnSxN3janeazFC9wVSY',
  );
}
