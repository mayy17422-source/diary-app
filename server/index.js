const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'diary_app_secret_key_2024';
const DB_PATH = path.join(__dirname, 'database.json');

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── JSON 文件数据库 ────────────────────────────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const init = { users: [], notes: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(init, null, 2), 'utf-8');
    return init;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function newId(list) {
  return list.length === 0 ? 1 : Math.max(...list.map(i => i.id)) + 1;
}

function now() {
  return new Date().toISOString();
}

console.log('✅ JSON 数据库路径:', DB_PATH);

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: '未登录，请先登录' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch {
    res.status(401).json({ error: 'Token 无效或已过期，请重新登录' });
  }
}

// ─── 注册 ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: '用户名和密码不能为空' });
  if (username.length < 2 || username.length > 20)
    return res.status(400).json({ error: '用户名长度需在 2~20 个字符之间' });
  if (password.length < 6)
    return res.status(400).json({ error: '密码长度不能少于 6 位' });

  const db = readDB();
  if (db.users.find(u => u.username === username))
    return res.status(409).json({ error: '用户名已存在，请换一个' });

  const hashed = bcrypt.hashSync(password, 10);
  const user = { id: newId(db.users), username, password: hashed, created_at: now() };
  db.users.push(user);
  writeDB(db);

  const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({ token, username });
});

// ─── 登录 ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: '用户名和密码不能为空' });

  const db = readDB();
  const user = db.users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: '用户名或密码错误' });

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, username: user.username });
});

// ─── 获取日记列表 ───────────────────────────────────────────────────────────────
app.get('/api/notes', authenticate, (req, res) => {
  const db = readDB();
  const notes = db.notes
    .filter(n => n.user_id === req.userId)
    .map(({ id, title, updated_at, created_at }) => ({ id, title, updated_at, created_at }))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  res.json(notes);
});

// ─── 创建日记 ───────────────────────────────────────────────────────────────────
app.post('/api/notes', authenticate, (req, res) => {
  const { title = '', content = '' } = req.body;
  const db = readDB();
  const t = now();
  const note = { id: newId(db.notes), user_id: req.userId, title, content, updated_at: t, created_at: t };
  db.notes.push(note);
  writeDB(db);
  res.status(201).json(note);
});

// ─── 获取单篇日记 ───────────────────────────────────────────────────────────────
app.get('/api/notes/:id', authenticate, (req, res) => {
  const db = readDB();
  const note = db.notes.find(n => n.id === Number(req.params.id) && n.user_id === req.userId);
  if (!note) return res.status(404).json({ error: '日记不存在' });
  res.json(note);
});

// ─── 更新日记 ───────────────────────────────────────────────────────────────────
app.put('/api/notes/:id', authenticate, (req, res) => {
  const { title, content } = req.body;
  const db = readDB();
  const idx = db.notes.findIndex(n => n.id === Number(req.params.id) && n.user_id === req.userId);
  if (idx === -1) return res.status(404).json({ error: '日记不存在' });

  db.notes[idx] = { ...db.notes[idx], title: title ?? '', content: content ?? '', updated_at: now() };
  writeDB(db);
  res.json(db.notes[idx]);
});

// ─── 删除日记 ───────────────────────────────────────────────────────────────────
app.delete('/api/notes/:id', authenticate, (req, res) => {
  const db = readDB();
  const idx = db.notes.findIndex(n => n.id === Number(req.params.id) && n.user_id === req.userId);
  if (idx === -1) return res.status(404).json({ error: '日记不存在' });
  db.notes.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});


// ─── 健康检查 ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: now() }));

// ─── 启动 ───────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  // ─── 日程 CRUD ─────────────────────────────────────────────────────────────────
// 获取所有日程
app.get('/api/todos', authenticate, (req, res) => {
  const db = readDB();
  if (!db.todos) db.todos = [];
  const todos = db.todos
    .filter(t => t.user_id === req.userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(todos);
});

// 创建日程
app.post('/api/todos', authenticate, (req, res) => {
  const { title, due_date } = req.body;
  const db = readDB();
  if (!db.todos) db.todos = [];
  const todo = {
    id: newId(db.todos),
    user_id: req.userId,
    title: title || '新日程',
    completed: false,
    due_date: due_date || null,
    created_at: now(),
    updated_at: now(),
  };
  db.todos.push(todo);
  writeDB(db);
  res.status(201).json(todo);
});

// 更新日程（切换完成状态、修改标题等）
app.put('/api/todos/:id', authenticate, (req, res) => {
  const { title, completed, due_date } = req.body;
  const db = readDB();
  if (!db.todos) db.todos = [];
  const idx = db.todos.findIndex(t => t.id === Number(req.params.id) && t.user_id === req.userId);
  if (idx === -1) return res.status(404).json({ error: '日程不存在' });

  if (title !== undefined) db.todos[idx].title = title;
  if (completed !== undefined) db.todos[idx].completed = completed;
  if (due_date !== undefined) db.todos[idx].due_date = due_date;
  db.todos[idx].updated_at = now();
  writeDB(db);
  res.json(db.todos[idx]);
});

// 删除日程
app.delete('/api/todos/:id', authenticate, (req, res) => {
  const db = readDB();
  if (!db.todos) db.todos = [];
  const idx = db.todos.findIndex(t => t.id === Number(req.params.id) && t.user_id === req.userId);
  if (idx === -1) return res.status(404).json({ error: '日程不存在' });
  db.todos.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
