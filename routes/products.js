import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import userMiddleware from "../middleware/user.js";
const router = Router();


router.get("/", async (req, res) => {
  const products = await Product.find().lean()
  res.render("index", {
    title: "Boom shop | Dima",
    products,
  });
});
router.get("/products", (req, res) => {
  res.render("product", {
    title: "Products | Dima",
    isProducts: true,
  });
});
router.get("/add", authMiddleware, (req, res) => {
 
  res.render("add", {
    title: "Add products",
    isAdd: true,
    errorAddProduct: req.flash("errorAddProduct"),
  });
});

router.post('/add-products', userMiddleware, async (req, res) => {
  const {title, description, image, price} = req.body
  if (!title || !description || !image || !price) {
    req.flash("errorAddProduct", "All fields is required");
    res.redirect("/add");
    return;
  }
  const products = await Product.create({...req.body, user: req.userId})
  console.log(req.userId)
  res.redirect('/')
})

export default router;
