import defaultVideos from "../data/dummyList.json";

const STORAGE_KEY = "poong_videos";
const STORAGE_VOLUME = "poong_volume";
let currentVolume;
let youtube;

//플레이어 영역
const player = document.getElementById("player");
const controlBar = document.getElementById("controlBar");
const viewScreen = document.getElementById("viewScreen");
const playlist = document.getElementById("playlist");

//플레이어 컨트롤
const prevBtn = document.getElementById("prevBtn");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const volumeBtn = document.getElementById("volumeBtn");
const repeatBtn = document.getElementById("repeatBtn");
const randomBtn = document.getElementById("randomBtn");

//플레이 타임
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

//현재 재생 비디오 정보
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const category = document.getElementById("category");

//시간 변환
function formatTime(seconds) {
  if (seconds < 3600) {
    return new Date(seconds * 1000).toISOString().slice(14, 19);
  } else {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  }
}

//로컬스토리지 GET/SET
const getLocalData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

const setLocalData = (data) => {
  return localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

//유튜브 아이프레임 이벤트
const onPlayerReady = (event) => {
  console.log("플레이어 레디")
  event.target.playVideo();
}

const onPlayerStateChange = (event, clickedVideoIdx) => {}

//클릭된 영상 플레이어로 재생
const playClickedVideo = (clickedVideoIdx, video) => {
  console.log("해당 비디오 재생하기", clickedVideoIdx, video);

  //받은 데이터로 Update
  const localData = getLocalData();
  const playNowVideo = {
    targetIndex: clickedVideoIdx,
    targetVideo: video,
  }

  console.log("현재 재생 시작한 비디오", playNowVideo);

  //유튜브 아이프레임 RESET
  if(youtube){
    youtube.destroy();
  }

  //비디오 리스트 정보 Update
  cover.style.backgroundImage = "url('" + video.thumbUrl + "')";
  title.innerText = video.title;
  category.innerText = video.category;
  
  //플레이 리스트 클래스값 RESET
  const playlistVideos = playlist.querySelectorAll("li");
  playlistVideos.forEach((item) => item.className = "");

  //클릭된 비디오 재생중 클래스 추가
  const targetVideoIndex = playNowVideo.targetIndex;
  const clickedVideo = playlist.querySelectorAll("li")[targetVideoIndex];
  clickedVideo.className = "playing";

  //유튜브 아이프레임 로드
  youtube = new YT.Player("viewScreen", {
    videoId: video.youtubeId,
    playerVars: { controls: 0 },
    events: {
      onReady: onPlayerReady,
      onStateChange: (event) => onPlayerStateChange(event, clickedVideoIdx),
    },
  });
}

//비디오 클릭시, 플레이어로 재생 + 현재 플레이리스트 맨앞 추가
const addVideoAndStartPlay = (event, video) => {
  console.log("플레이리스트 > 클릭된 영상 인덱스 구하기");
  event.stopPropagation();

  const localVideos = getLocalData().videos;
  let clickedVideoIdx;

  //클릭된 영상 인덱스 구하기
  localVideos.map((localVideo, index) => localVideo._id === video._id ? (
    clickedVideoIdx = index
  ) : null);

  //클릭된 영상 플레이어로 재생
  console.log(clickedVideoIdx);
  playClickedVideo(clickedVideoIdx, video);
}

//플레이어 > 플레이리스트 UI 삭제
const playListUIRemove = () => {
  while(playlist.firstChild){
    playlist.removeChild(playlist.firstChild);
  }
}

//플레이어 > 플레이리스트 UI 업데이트
const playListUIupdate = (video) => {
  const li = document.createElement("li");
  li.dataset.id = video._id;

  //커버이미지
  const coverBox = document.createElement("div");
  coverBox.className = "cover-box";

  const playIcon = document.createElement("i");
  playIcon.className = "fa-solid fa-play";

  const coverImage = document.createElement("div");
  coverImage.className = "cover-image";
  coverImage.style.backgroundImage = "url('" + video.thumbUrl + "')";
  coverImage.append(playIcon);
  coverBox.append(coverImage);
  
  //타이틀
  const titleBox = document.createElement("div");
  titleBox.className = "title-box";

  const title = document.createElement("div");
  title.className = "title";
  title.innerText = video.title;

  const category = document.createElement("div");
  category.className = "category";
  category.innerText = video.category;
  titleBox.append(title, category);

  
  //duration 타임 & 삭제버튼
  const descBox = document.createElement("div");
  descBox.className = "desc-box";

  const duration = document.createElement("div");
  duration.className = "duration";
  duration.innerText = formatTime(video.runningTime);

  const deleteBtn = document.createElement("i");
  deleteBtn.className = "fa-regular fa-circle-xmark";
  descBox.append(duration, deleteBtn);

  li.append(coverBox, titleBox, descBox);
  coverBox.addEventListener("click", (event) => addVideoAndStartPlay(event, video));

  //플레이어 리스트 UI Update
  playlist.appendChild(li);

  //플레이어 리스트에서 비디오 삭제하기
  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    let localData = getLocalData();
    const localVideos = localData.videos;
    const localPlayNowVideo = localData.playNowVideo;

    let clickedVideoIdx;
    localVideos.map((localVideo, index) => localVideo._id === video._id ? (
      clickedVideoIdx = index
    ):null);

    //재생중인 영상은 삭제 불가
    if(localPlayNowVideo.targetVideo._id === video._id){
      alert("재생중인 영상은 삭제할 수 없어요.");
      return;
    }

    //삭제 후, 업데이트된 비디오 데이터 
    const updateVideos = localVideos.filter((localVideo, index) => clickedVideoIdx !== index);

    //업데이트된 비디오 인덱스 갱신
    updateVideos.map((updateVideo, index) => updateVideo._id === localPlayNowVideo._id ? (
      clickedVideoIdx = index
    ):null);

    //로컬 데이터 저장
    localData.playNowVideo.targetIndex = clickedVideoIdx;
    localData.videos = updateVideos;
    setLocalData(localData);

    //클릭된 영상 삭제
    li.remove();
  });
}

//로컬데이터 최초 LOAD
const loadVideos = () => {
  let videos, playNowVideo, setting;
  const localData = getLocalData();

  if(localData){
    console.log("로컬데이터 있음");
    //기존에 저장된 로컬데이터 로드
    videos = localData.videos;
    const playNowVideo = localData.playNowVideo;

    cover.style.backgroundImage = "url('" + playNowVideo.targetVideo.thumbUrl + "')";
    title.innerText = playNowVideo.targetVideo.title;
    category.innerText = playNowVideo.targetVideo.category;
    duration.innerText = formatTime(playNowVideo.targetVideo.runningTime);

  } else {
    console.log("로컬데이터 없음");
    //로컬데이터_기본셋업 (재생중비디오, 로컬 저장된 비디오 리스트, 플레이어설정값)
    videos = defaultVideos;

    playNowVideo = {
      targetIndex: 0,
      targetVideo: videos[0],
    }

    setting = {
      isRandom: false,
      isRepeat: false,
      isPlay: false,
      isPause: false,
      isBuffer: false,
      currentTime: 0,
      totalTime: 0,
    }

    const defaultData = {
      videos,
      playNowVideo,
      setting,
    }
    
    //셋업완료된 기본데이터 저장
    setLocalData(defaultData);

    //로컬데이터_볼륨 값 저장
    localStorage.setItem(STORAGE_VOLUME, 30);

    //현재 플레이 비디오 정보
    title.innerText = "오늘 작업 BGM을 골라볼까?"
    category.innerText = "플레이어를 이용해서 영상을 플레이해보세요."
  }

  //받은 로컬데이터를 플레이어리스트 데이터로 UI 업데이트
  videos.forEach((video) => playListUIupdate(video));

  //볼륨 업데이트
  //랜덤플레이 업데이트
  //반복타입 업데이트
}

// START
loadVideos();

//홈 > 비디오 클릭시 플레이어 리스트 추가 & 재생
const playVideoWithPlayer = async (event) => {
  event.stopPropagation();

  const videoId = event.currentTarget.dataset.id;
  const response = await (await fetch(`/api/video/${videoId}`)).json();
  
  if(response.ok){
    let localData = getLocalData();
    const localVideos = localData.videos;

    //로컬에 있는 비디오와 fetch결과 비디오가 같은지 체크
    let existVideoIdx;
    localVideos.forEach((localVideo, index) => localVideo._id === response.video._id ? (
      existVideoIdx = index
    ): null)

    if(existVideoIdx !== undefined){
      alert("이미 플레이어에 존재하는 영상입니다.\n해당 영상을 플레이합니다.");

      const existVideo = playlist.querySelectorAll("li")[existVideoIdx];
      existVideo.click();
      return;
    }

    //리스트에 없는 비디오 기존 로컬데이터에 추가 > 로컬데이터 Update
    const newVideos = [response.video, ...localVideos];
    const newPlayNowVideo = {
      targetIndex: 0,
      targetVideo: response.video,
    }

    localData.playNowVideo = newPlayNowVideo;
    localData.videos = newVideos;
    setLocalData(localData);
    
    //플레이어 리스트 기존 UI제거
    playListUIRemove();

    //업데이트 후 새로운 데이터로 UI 다시 그리기
    loadVideos();

    //추가한 비디오 바로 플레이 (첫번째영상)
    const firstVideo = playlist.querySelectorAll("li")[0].firstChild;
    firstVideo.click();
  }
}

const videoItemAllPlayBtn = document.querySelectorAll(".play");

videoItemAllPlayBtn.forEach((playBtn) => 
  playBtn.addEventListener("click", playVideoWithPlayer)
);