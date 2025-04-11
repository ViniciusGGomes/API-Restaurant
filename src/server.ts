import express, { Request, Response } from "express";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/errorHandling";

const PORT = 3333;
const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandling);

app.listen(PORT, () => console.log("Server is running on port: " + PORT));
