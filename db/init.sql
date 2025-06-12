-- まず status 用の ENUM 型を定義
DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'done');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- tasks テーブルを作成
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'not_started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 初期データを挿入（必要に応じて）
INSERT INTO tasks (title, description, status)
VALUES
    ('牛乳を買う', 'スーパーで牛乳を購入する', 'not_started'),
    ('プログラミング学習', 'Go言語でAPI作成', 'in_progress'),
    ('ジムに行く', '1時間トレーニング', 'done');
