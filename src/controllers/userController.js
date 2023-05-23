import User from "./../models/User";

export const getJoin = (req, res) => {
  return res.render("user/join", { pageTitle: "회원가입" });
}

export const postJoin = async (req, res) => {
  const { 
    body: { 
      username,
      password,
      password_confirm, 
      avatarUrl 
    }
   } = req;
   const pageTitle = "회원가입";

   //유저네임 중복확인
   const usernameExist = await User.exists({ username });
   if(usernameExist){
    return res.status(409).render("user/join", {
      pageTitle,
      errorMsg: "🚨 이미 존재하는 유저네임입니다.",
    });
   }

   //비밀번호 일치 확인
   if(password !== password_confirm){
    return res.status(409).render("user/join", {
      pageTitle,
      errorMsg: "🚨 비밀번호가 일치하지 않습니다.",
    });
   }

   try {
    //사용자 생성
   const user = await User.create({
    username,
    password,
    avatarUrl,
   });

   await user.save();
   return res.redirect("/login");

   } catch (error) {
    return res.status(400).render("user/join", {
      pageTitle,
      errorMsg: error._message,
    });
  }
}

export const getLogin = (req, res) => {
  return res.render("user/login", { pageTitle: "로그인" });
}

export const postLogin = async (req, res) => {
  const { 
    body: { username, password }
  } = req;
  const pageTitle = "로그인";
  
  //Request 유저네임 체크
  const user = await User.findOne({ username });
  if(!user){
    return res.status(409).render("user/login", {
      pageTitle,
      errorMsg: "🚨 해당 유저네임을 가진 사용자가 없습니다.",
    });
  }

   //Request 비밀번호 체크
  if(user.password !== password){
    return res.status(409).render("user/login", {
      pageTitle,
      errorMsg: "🚨 비밀번호가 일치하지 않습니다.",
    });
  }

  //세션저장
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
}

export const edit = (req, res) => {
  return res.render("user/edit", { pageTitle: "회원정보 수정" });
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