const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let users = [];

app.post('/register', (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: 'Все поля обязательны!' });
  }

  const token = 'fake-jwt-token';  // Это будет твой "токен" для теста
  users.push({ name, phone, email, password, token });

  res.status(201).json({ token });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Неверные email или пароль' });
  }

  res.json({ token: user.token });
});

app.get('/main', (req, res) => {
  res.json({ message: 'Добро пожаловать на главную страницу!' });
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
