import chalk from "chalk";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { engine, create } from "express-handlebars";
import AuthRoutes from "./routes/auth.js";
import varMiddleware from "./middleware/var.js";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import session from "express-session";
import ProductsRoutes from "./routes/products.js";
dotenv.config();

const app = express();

const hbs = create({ defaultLayout: "main", extname: "hbs" });

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(session({ secret: "Dima", resave: false, saveUninitialized: false}));
app.use(flash());
app.use(varMiddleware)
app.use("/", AuthRoutes);
app.use("/", ProductsRoutes);



const PORT = process.env.PORT || 4100;
app.listen(PORT, () =>
  console.log(chalk.bgRed(`Server is running on port ${PORT}...`))
);



const startApp = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
    console.log(chalk.redBright.bgYellow("MongoDB connected"));
    return mongo;
  } catch (error) {
    console.log(error + "");
  }
};

startApp();
