import express, { Request, Response } from "express";

const router = express.Router();

interface Dish {
  id: number;
  name: string;
  price: number;
}

let dishes: Dish[] = [{id: 0, name: "Peperoni", price: 1000}, {id: 1, name: "Margaritta", price: 350}, {id: 2, name: "Caesar", price: 400}];

router.get("/", (req: Request, res: Response) => {
  res.json(dishes);
}); 

router.post("/", (req: Request, res: Response) => {
  const { name, price } = req.body;

  if (!name || typeof price !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  const newDish: Dish = {
    id: dishes.length + 1,
    name,
    price,
  };

  dishes.push(newDish);
  res.status(201).json(newDish);
});

export default router;
