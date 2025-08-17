-- 1. 既存のテーブルと型を削除
DROP TABLE IF EXISTS tasks;
DROP TYPE IF EXISTS task_status;
DROP TABLE IF EXISTS users;

-- 2. ENUMを作り直す
CREATE TYPE task_status AS ENUM ('未着手', '進行中', '完了');

-- 3. テーブルを作り直す
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    mail_address VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT '未着手',
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. サンプルデータの投入 (パスワードはbcryptでハッシュ化済み)
-- password1 -> $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- password2 -> $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (username, mail_address, password)
VALUES
    ('testuser1', 'test1@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('testuser2', 'test2@test.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO tasks (title, description, status, user_id)
VALUES
    ('牛乳を買う', 'スーパーで牛乳を購入する', '未着手', 1),
    ('洗濯をする', '週末の洗濯', '進行中', 1),
    ('読書', '新しい本を読む', '完了', 1),
    ('料理', '夕食の準備をする', '未着手', 2),
    ('掃除', '部屋の掃除をする', '進行中', 2),
    ('プログラミング学習', 'Reactでフロントエンド開発', '未着手', 1),
    ('プログラミング学習', 'Go言語でAPI作成', '進行中', 2),
    ('ジムに行く', '1時間トレーニング', '完了', 1);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_mail_address ON users(mail_address);