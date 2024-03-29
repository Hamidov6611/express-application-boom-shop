import { Router } from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import userMiddleware from "../middleware/user.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find({}).lean();
  res.render("index", {
    title: "Boom shop | Dima",
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  });
});
router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null;
  const myProduct = await Product.find({ user }).populate("user").lean();
  console.log(req.userId);
  res.render("products", {
    title: "Products | Dima",
    isProducts: true,
    myProduct: myProduct,
  });
});
router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    title: "Add products",
    isAdd: true,
    errorAddProduct: req.flash("errorAddProduct"),
  });
});

router.get("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("user").lean();
    res.render("product.hbs", {
      product: product,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/add-products", userMiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;
  if (!title || !description || !image || !price) {
    req.flash("errorAddProduct", "All fields is required");
    res.redirect("/add");
    return;
  }
  const products = await Product.create({ ...req.body, user: req.userId });
  console.log(req.userId);
  res.redirect("/");
});

export default router;
