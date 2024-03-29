import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { genereteToken } from "../services/token.js";
import isAuth from "../middleware/isAuth.js";
const router = Router();

router.get("/login", isAuth, (req, res) => {
  res.render("login", {
    title: "Login | Dima",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.get("/register", isAuth, (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
  res.render("register", {
    title: "Register | Dima",
    isRegister: true,
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("loginError", "All fields is required");
      res.redirect("/login");
      return;
    }

    const existUser = await User.findOne({ email });
    if (!existUser) {
      req.flash("loginError", "User Not Found");
      res.redirect("/login");
      return;
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);

    if (!isPassEqual) {
      req.flash("loginError", "Password wrong");
      res.redirect("/login");
      return;
    }
    const token = genereteToken(existUser._id);
    console.log(token)
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect("/");
  } catch (error) {
    console.log(error + " ");
  }
});
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      req.flash("registerError", "All fields is required");
      res.redirect("/register");
      return;
    }

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash("registerError", "User already exist");
      res.redirect("/register");
      return;
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const userData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
    };
    const user = await User.create(userData);
    const token = genereteToken(user._id);
    res.cookie("token", token, { httpOnly: true, secure: true });
  } catch (error) {
    console.log(error);
  }

  res.redirect("/");
});
export default router;
