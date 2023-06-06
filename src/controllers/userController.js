import bcrypt from "bcryptjs";
import User from "../models/User";
import Playlist from "../models/Playlist";

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

    //기본 플레이리스트 생성
    const defaultPlaylist = await Playlist.create({
      name: "기본 플레이리스트",
      user,
      coverUrl: undefined,
      isDefault: true,
    });
    
    await user.playlists.push(defaultPlaylist);
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

export const getEdit = (req, res) => {
  return res.render("user/edit", { pageTitle: "회원정보 수정" });
}

export const postEdit = async (req, res) => {
  const { 
    body: { username, avatarUrl },
    session: { 
      user: { 
        _id: sessionId
      } 
    } 
  } = req;

  const pageTitle = "회원정보 수정";
  const isExistUsername = await User.exists({ username });
  const user = await User.findById(sessionId);

  //유저네임 중복체크, 단 사용자 현재 유저네임은 제외
  if(isExistUsername && username !== user.username){
    return res.status(400).render("user/edit", {
      pageTitle,
      errorMsg: "🚨 이미 존재하는 유저네임입니다.",
    });
  }

  //유저네임 빈값 체크
  if(username === ""){
    return res.status(400).render("user/edit", {
      pageTitle,
      errorMsg: "🚨 유저네임은 필수 입력사항입니다.",
    });
  }

  //사용자 정보 업데이트
  try {
    const updatedUser = await User.findByIdAndUpdate( sessionId, { 
      username,
      avatarUrl
     }, { 
      new:true,
     });

     //세션 저장
     req.session.user = updatedUser;
     return res.redirect("/");
    
  } catch(error){
    console.log(error);

    return res.status(400).render("user/edit", {
      pageTitle,
      errorMsg: error._message,
    });
  }
}

export const postChangePw = async (req, res) => {
  const pageTitle = "회원정보 수정";
  const {
    body: {
      password,
      password_new,
    },
    session: {
      user: {
        _id: sessionId,
      }
    }
  } = req;

  //유저확인
  const user = await User.findById(sessionId);
  if(!user){
    req.flash("error", "존재하지 않는 회원입니다.");
    return res.redirect("/");
  }

  //기존 비밀번호 체크
  const isPwMatch = await bcrypt.compare(password, user.password);
  if(!isPwMatch){
    return res.status(401).render("user/edit", {
      pageTitle,
      errorMsg: "🚨 기존 비밀번호가 일치하지 않습니다.",
    });
  }

  //새 비밀번호 체크
  if(password === password_new){
    return res.status(409).render("user/edit", {
      pageTitle,
      errorMsg: "🚨 기존 비밀번호와 새 비밀번호가 동일합니다.",
    });
  }

  //비밀번호 업데이트
  user.password = password_new;
  await user.save();

  //로그아웃
  return res.redirect("/user/logout");
}

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
}