import bcrypt from "bcrypt";
import User from "../models/User";

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

   //유저네임 중복 여부
   const isUserNameExist = await User.exists({ username });
   if(isUserNameExist){
    return res.status(400).render("user/join", {
      pageTitle,
      errorMsg: "🚨 이미 존재하는 유저네임입니다.",
    });
   }

   //비밀번호와 비밀번호 확인 체크
   if(password !== password_confirm){
    return res.status(400).render("user/join", {
      pageTitle,
      errorMsg: "🚨 비밀번호가 일치하지 않습니다.",
    });
   }

   //사용자 생성
   try {
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
  const user = await User.findOne({ username });
  
  if(!user){
    return res.status(400).render("user/login", {
      pageTitle,
      errorMsg: "🚨 해당 유저네임을 가진 사용자가 없습니다.",
    });
  }
  
  //DB해시비번과 Req로 받은 해시비번이 같은지 확인
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if(!isPasswordMatch){
    return res.status(400).render("user/login", {
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
  req.session.destroy();
  return res.redirect("/login");
}

export const remove = (req, res) => {
  return res.send("remove user");
}