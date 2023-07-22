import { supabase } from '../supabaseClient';

const updateToDB = async (
  table: string,
  content: object,
  id: number,
  fn: Promise<void> | null
) => {
  const { data, error } = await supabase.from(table).update(content).eq('id', id);
  console.log(data)
  {
    error ? console.error(error) : fn;
  }
};

export default updateToDB;
