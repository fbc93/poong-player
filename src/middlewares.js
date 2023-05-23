export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Poong Player";
  next();
}