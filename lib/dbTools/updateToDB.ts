import { supabase } from '../supabaseClient';

const updateToDB = async (
  table: string,
  content: object,
  id: number,
  fn: Promise<void> | null
) => {
  const { error } = await supabase.from(table).update(content).eq('id', id);

  {
    error ? console.error(error) : fn;
  }
};

export default updateToDB;
