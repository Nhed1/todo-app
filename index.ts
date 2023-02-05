import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
// parse body to "application/x-www-form-urlencoded" and "json"
app.use(bodyParser.urlencoded({ extended: true }));
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

  res.send();
});

app.get("/todos", (req: Request, res: Response) => {
  res.json(todos);
});

app.listen(PORT, () =>
  console.log(`Server running on at http://localhost:${PORT}`)
);
