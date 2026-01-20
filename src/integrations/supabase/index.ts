/**
 * Supabase Integration
 * 
 * Este módulo proporciona acceso al cliente de Supabase y tipos de base de datos.
 * 
 * Uso:
 * import { supabase } from '@/integrations/supabase';
 * 
 * const { data, error } = await supabase
 *   .from('tu_tabla')
 *   .select('*');
 */

export { supabase } from './client';
export type { Database } from './types';
