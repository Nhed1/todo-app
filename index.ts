import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(bodyParser.json());

dotenv.config();
const PORT = process.env.PORT;

interface Todo {
  id: string;
  title: string;
  description?: string;
  isDone?: boolean;
  createdAt: Date;
}

const todos: Todo[] = [];

app.post("/todo", (req: Request, res: Response) => {
  const { title, description = "", isDone = false } = req.body as Todo;

  if (!title) {
    return res.status(400).json({
      error: "Title is a required field",
    });
  }

  const todo = {
    id: uuidv4(),
    title,
    description,
    isDone,
    createdAt: new Date(),
  };

  todos.push(todo);

  res.status(201).send();
});

app.get("/todos", (req: Request, res: Response) => {
  res.json(todos);
});

app.get("/todos/:id", (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id) {
    return res.send(400).json({
      error: "Id was not provided",
    });
  }

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.send(404).json({
      error: "Todo not found",
    });
  }

  return res.status(200).json(todo);
});

app.put("/todos/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, isDone } = req.body;

  if (!id) {
    return res.status(400).json({
      error: "Id was not provided",
    });
  }

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    return res.send(404).json({
      error: "Todo not found",
    });
  }

  if (title) todo.title = title;
  if (isDone) todo.isDone = isDone;
  if (description) todo.description = description;

  return res.status(204).send();
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: "Id was not provided",
    });
  }

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (!todoIndex) {
    return res.send(404).json({
      error: "Todo not found",
    });
  }

  todos.splice(todoIndex, 1);

  return res.status(204).send();
});

app.listen(PORT, () =>
  console.log(`Server running on at http://localhost:${PORT}`)
);
