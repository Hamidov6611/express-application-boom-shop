export default function (req, res, next) {
    const isAuth = req.cookies.token ? true : false
    console.log(isAuth)
    res.locals.token = isAuth
    next();
  };