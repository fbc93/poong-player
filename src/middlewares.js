export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Poong Player";
  res.locals.loggedInUser = req.session.user || {};
  next();
}

export const privateOnlyMiddleware = (req, res, next) => {
  //로그인 하지 않은 사용자의 접근제한
  if(req.session.loggedIn){
    return next();

  } else {
    req.flash("error", "로그인을 먼저 해주세요.");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  //로그인 사용자의 회원가입, 로그인 화면 접근제한
  if(!req.session.loggedIn){
    return next();

  } else {
    req.flash("error", "잘못된 경로입니다.");
    return res.redirect("/");
  }
}