import { Context } from 'telegraf';

export interface User {
  id?: number;
  user_id: number;
  name: string;
  surname: string;
  city: string;
  created_at?: string;
}

export interface Message {
  id?: number;
  user_id: number;
  name: string;
  surname: string;
  message: string;
  time_sent: string;
}

export interface BroadcastQueue {
  id?: number;
  admin_id: number;
  content: string;
  status: 'pending' | 'processing' | 'completed';
  created_at?: string;
  total_users: number;
  sent_count: number;
  failed_count: number;
  blocked_count: number;
}

export interface PendingMessage {
  type: 'text' | 'photo';
  text?: string;
  file_id?: string;
  caption?: string;
}

export interface SessionData {
  awaitingName?: boolean;
  awaitingSurname?: boolean;
  awaitingCity?: boolean;
  awaitingBroadcast?: boolean;
  name?: string;
  surname?: string;
}

// Расширяем контекст Telegraf
export interface MyContext extends Context {
  session?: SessionData;
}