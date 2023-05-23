export const join = (req, res) => {

  return res.render("user/join", { pageTitle: "회원가입" });
}

export const edit = (req, res) => {

  return res.render("user/edit", { pageTitle: "회원정보 수정" });
}

export const login = (req, res) => {

  return res.render("user/login", { pageTitle: "로그인" });
}

export const changePw = (req, res) => {
  return res.send("change password");
}

export const logout = (req, res) => {
  return res.send("logout");
}

export const remove = (req, res) => {
  return res.send("remove user");
}