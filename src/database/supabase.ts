import { createClient } from '@supabase/supabase-js';
import { User, Message, BroadcastQueue } from '../types';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export class DatabaseService {
  async createUser(user: Omit<User, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('users_info')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserById(userId: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users_info')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) return null;
    return data;
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users_info')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async deleteUser(userId: number) {
    const { error } = await supabase
      .from('users_info')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  async createMessage(message: Omit<Message, 'id'>) {
    const { error } = await supabase
      .from('messages')
      .insert([message]);
    
    if (error) throw error;
  }

  async createBroadcast(broadcast: Omit<BroadcastQueue, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('broadcast_queue')
      .insert([broadcast])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getBroadcast(id: number): Promise<BroadcastQueue | null> {
    const { data, error } = await supabase
      .from('broadcast_queue')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  async updateBroadcast(id: number, updates: Partial<BroadcastQueue>) {
    const { error } = await supabase
      .from('broadcast_queue')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  }

  async getLatestBroadcast(): Promise<BroadcastQueue | null> {
    const { data, error } = await supabase
      .from('broadcast_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) return null;
    return data;
  }
}