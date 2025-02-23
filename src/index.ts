import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "3327",
  database: "cafebd",
});

connection.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к БД:", err);
    return;
  }
  console.log("Подключение к БД успешно установлено");
});

app.get("/menu", (req, res) => {
  connection.query("SELECT * FROM menuitems", (err, results) => {
    if (err) {
      console.error("Ошибка выполнения запроса:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get("/users", (req, res) => {
  connection.query("SELECT user_id, name FROM users;", (err, results) => {
    if (err) {
      console.error("Ошибка выполнения запроса:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post("/RegisterUser", (req, res) => {
  const { _name, _phone, _email } = req.body;

  if (!_name || !_phone || !_email) {
    return res
      .status(400)
      .json({
        error: "Поля name, description и price обязательны для заполнения.",
      });
  }

  const sql = `CALL RegisterUser(?, ?, ?)`;
  connection.query(sql, [_name, _phone, _email], (err, results) => {
    if (err) {
      console.error("Ошибка при выполнении запроса:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(201).json({
      message: "Запись успешно добавлена в базу данных",
      insertId: (results as mysql.OkPacket).insertId,
    });
  });
});

app.post("/CreateOrder", (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Некорректные данные" });
  }

  const sql = `CALL CreateOrder(?, ?)`;
  const jsonItems = JSON.stringify(items);

  connection.query(sql, [user_id, jsonItems], (err, results) => {
    if (err) {
      console.error("Ошибка при выполнении запроса:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(201).json({
      message: "Заказ успешно создан",
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
