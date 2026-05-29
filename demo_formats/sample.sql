-- SQL示例文件

CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tools (name, category, description) VALUES
    ('Write', '文件操作', '写入文件到本地文件系统'),
    ('Read', '文件操作', '读取本地文件'),
    ('RunCommand', '命令执行', '执行终端命令'),
    ('WebSearch', '网络', '搜索互联网');

SELECT t.name, t.category, t.description
FROM tools t
WHERE t.active = TRUE
ORDER BY t.id;
