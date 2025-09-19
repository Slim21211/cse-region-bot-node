-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users_info (
  id SERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы сообщений
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name TEXT,
  surname TEXT,
  message TEXT,
  time_sent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы очереди рассылки
CREATE TABLE IF NOT EXISTS broadcast_queue (
  id SERIAL PRIMARY KEY,
  admin_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_users INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  blocked_count INTEGER DEFAULT 0
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users_info(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_admin_id ON broadcast_queue(admin_id);
CREATE INDEX IF NOT EXISTS idx_broadcast_status ON broadcast_queue(status);