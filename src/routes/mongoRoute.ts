import express, { Router } from "express";
import Dish, { IDish } from "../Models/User";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { name, minPrice, maxPrice } = req.query;
    const query: any = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (minPrice) query.price = { $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    const dishes = await Dish.find(query);
    res.status(200).json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении списка блюд" });
  }
});

router.post("/", async (req, res) => {
  const { name, price } = req.body;

  try {
    let count = await Dish.countDocuments();

    const newDish = new Dish({ id: count + 1, name, price });

    await newDish.save();

    res.status(201).json(newDish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при добавлении блюда" });
  }
});

export default router;