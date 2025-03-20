import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "path";
import { RowDataPacket } from "mysql2/promise";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

async function initDatabase() {
  const connection = await mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "3327",
    database: "cafebd",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("Подключение к БД успешно установлено");

  app.get("/api/menu", async (req, res) => {
    const sql = `
      SELECT menuitems.*, categories.category_name 
      FROM menuitems
      JOIN categories ON menuitems.category_id = categories.category_id;
    `;

    try {
      const [results] = await connection.query<RowDataPacket[]>(sql);
      const menuItems = results.map((item) => ({
        ...item,
        image_url: item.image_url
          ? `http://localhost:${PORT}${item.image_url}`
          : `http://localhost:${PORT}/uploads/default.jpg`,
      }));
      res.json(menuItems);
    } catch (err) {
      console.error("Ошибка выполнения запроса:", err);
      res.status(500).json({ error: err });
    }
  });

  app.get("/api/gallery", (req, res) => {
    const images = [
      `http://localhost:${PORT}/uploads/gallery1.jpg`,
      `http://localhost:${PORT}/uploads/gallery2.jpg`,
      `http://localhost:${PORT}/uploads/gallery3.jpg`,
      `http://localhost:${PORT}/uploads/gallery4.jpg`,
      `http://localhost:${PORT}/uploads/gallery5.jpg`,
    ];
    res.json(images);
  });

  app.get("/users", async (req, res) => {
    try {
      const [results] = await connection.query<RowDataPacket[]>(
        "SELECT user_id, name FROM users;"
      );
      res.json(results);
    } catch (err) {
      console.error("Ошибка выполнения запроса:", err);
      res.status(500).json({ error: err });
    }
  });

  app.post("/RegisterUser", async (req, res) => {
    const { _name, _phone, _email } = req.body;

    if (!_name || !_phone || !_email) {
      return res.status(400).json({ error: "Все поля обязательны" });
    }

    try {
      const [rows] = await connection.execute<RowDataPacket[]>(
        "CALL RegisterUser(?, ?, ?)",
        [_name, _phone, _email]
      );

      console.log("DEBUG procedure result:", rows);

      const userRow = rows[0]?.[0];
      const user_id = userRow.user_id;

      if (!userRow || !userRow.user_id) {
        throw new Error("Не удалось получить user_id");
      }

      return res
        .status(201)
        .json({ message: "Пользователь зарегистрирован", user_id });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Неизвестная ошибка";
      const errorStack =
        err instanceof Error ? err.stack : "Стек ошибки отсутствует";

      console.error(
        "Ошибка при регистрации пользователя:",
        errorMessage,
        errorStack
      );
      return res.status(500).json({ error: errorMessage });
    }
  });

  app.post("/CreateOrder", async (req, res) => {
    const { user_id, items } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Некорректные данные" });
    }

    try {
      const sql = `CALL CreateOrder(?, ?)`;
      const jsonItems = JSON.stringify(items);

      await connection.execute(sql, [user_id, jsonItems]);
      return res.status(201).json({ message: "Заказ успешно создан" });
    } catch (err) {
      console.error("Ошибка при выполнении запроса:", err);
      return res.status(500).json({ error: err });
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
  });
}

initDatabase().catch((err) => {
  console.error("Ошибка при запуске сервера:", err);
});
