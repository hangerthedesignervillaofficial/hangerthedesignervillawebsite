const { supabase } = require('./src/lib/supabase/client'); supabase.from('categories').select('*').limit(1).then(console.log);
