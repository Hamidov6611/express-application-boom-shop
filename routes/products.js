import { Router } from "express";
const router = Router();


router.get("/", (req, res) => {
  res.render("index", {
    title: "Boom shop | Dima",
  });
});
router.get("/products", (req, res) => {
  res.render("product", {
    title: "Products | Dima",
    isProducts: true,
  });
});
router.get("/add", (req, res) => {
  res.render("add", {
    title: "Add products",
    isAdd: true,
  });
});

export default router;
