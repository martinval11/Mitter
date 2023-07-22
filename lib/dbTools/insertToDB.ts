import { supabase } from '../supabaseClient';

const insertToDB = async (table: string, content: object, fn: Promise<void>) => {
  const { error }: any = await supabase.from(table).insert(content);

  {
    error ? console.error(error) : fn;
  }
};

export default insertToDB;
