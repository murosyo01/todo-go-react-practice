-- 1. 既存のテーブルと型を削除
DROP TABLE IF EXISTS tasks;
DROP TYPE IF EXISTS task_status;

-- 2. ENUMを作り直す
CREATE TYPE task_status AS ENUM ('未着手', '進行中', '完了');

-- 3. テーブルを作り直す
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT '未着手',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. INSERT
INSERT INTO tasks (title, description, status)
VALUES
    ('牛乳を買う', 'スーパーで牛乳を購入する', '未着手'),
    ('洗濯をする', '週末の洗濯', '進行中'),
    ('読書', '新しい本を読む', '完了'),
    ('料理', '夕食の準備をする', '未着手'),
    ('掃除', '部屋の掃除をする', '進行中'),
    ('プログラミング学習', 'Reactでフロントエンド開発', '未着手'),
    ('プログラミング学習', 'Go言語でAPI作成', '進行中'),
    ('ジムに行く', '1時間トレーニング', '完了');
