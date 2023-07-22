import { supabase } from '../supabaseClient';

const getDBData = async (
  table: string,
  eqId?: any,
  eq?: string | number
) => {
  const { data, error } = await supabase.from(table).select('*')?.eq(eqId, eq);

	if (error) {
		console.error(error)
		return;
	}
	
	return data;
};

export default getDBData;
