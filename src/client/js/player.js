import dummyList from "../data/dummyList.json";

const playlist = document.getElementById("playlist");
const allPlayBtn = document.querySelectorAll(".playBtn");
const STORAGE_KEY = "Recent_PlayList";

//로컬 스토리지 SET/GET
const setLocalState = (data) => {
  return localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const getLocalState = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

//최근재생목록 로드
const loadRecentVideoList = () => {

  const localState = getLocalState();
  setLocalState(localState);

  //재생 비디오
  const nowPlayingVideo = document.createElement("li");

  nowPlayingVideo.className = "nowPlaying";
  nowPlayingVideo.innerText = "재생 비디오"
  playlist.appendChild(nowPlayingVideo);

  //플레이어에 데이터 로드
  localState.forEach((video) => {
    const li = document.createElement("li");
    li.innerText = video.title;
    playlist.appendChild(li);
  });
}

//init
loadRecentVideoList();

//플레이리스트 UI
const resetPlaylistUI = () => {
  while (playlist.firstChild){
    playlist.removeChild(playlist.firstChild);
  }
}

const updatePlaylistUI = (localState) => {

  localState.forEach((video) => {
    const li = document.createElement("li");
    li.innerText = video.title;
    playlist.appendChild(li);
  });
}

const reloadPlaylist = () => {
  const localState = getLocalState();
  updatePlaylistUI(localState);
}

//플레이어로 영상 재생
const playVideoWithPlayer = async (event) => {
  const videoId = event.currentTarget.dataset.id;
  const response = await (await fetch(`/api/video/${videoId}`)).json();

  if(response.ok){
    const { video:newVideo } = response;
    let localState = getLocalState();

    //새 영상이 기존 데이터에 존재하는지 id 체크
    const alreadyExist = localState.filter((prevVideo) => prevVideo._id === newVideo._id );

    if (Object.keys(alreadyExist).length > 0){
      return alert("이미 플리에 존재하는 영상입니다.\n해당 영상 바로 플레이 합니다.");
    }

    //새 영상을 플레이어 리스트에 추가 
    const newLocalState = [response.video, ...localState];
    localState = newLocalState;
    setLocalState(localState);
    resetPlaylistUI();
    reloadPlaylist();
  }
}

//로드후 이벤트
allPlayBtn.forEach((btn) => {
  btn.addEventListener("click", playVideoWithPlayer);
});






