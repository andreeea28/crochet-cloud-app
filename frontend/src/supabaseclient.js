import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vxsfdtnhrgibhllmlixy.supabase.co";
const supabaseAnonKey = "sb_publishable_iwGJNBtdfLuf4RciHaBIWQ_WpDeHCII";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);