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
const soundRange = document.getElementById("soundRange");
const soundValue = document.querySelector("#soundRange > .value");
const descContainer = document.querySelector(".desc-container");

//플레이 타임
const progressTime = document.getElementById("progressTime");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const progressContainer = document.querySelector(".progress-container");
const toolTip = document.getElementById("toolTip");

//현재 재생 비디오 정보
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const category = document.getElementById("category");

//홈 > 비디오
const videoItemAllPlayBtn = document.querySelectorAll(".play");

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

//재생 중 시간 update
const updateVideoProgressTime = () => {
  if(!youtube) return;
  if(typeof youtube.getPlayerState !== "function") return;
 
  const state = youtube.getPlayerState();
  if(state === 3) return; //종료(3)

  //재생시간 
  currentTime.innerText = formatTime(youtube.getCurrentTime());
  duration.innerText = formatTime(youtube.getDuration());
  
}

//재생 프로그레스 바 update
const updateVideoProgressBar = () => {
  if(!youtube) return;
  if(typeof youtube.getPlayerState !== "function") return;

  const currentTime = youtube.getCurrentTime();
  const duration = youtube.getDuration();

  progressTime.style.width = (currentTime/duration) * 100 + "%";
  return;
}

//재생 프로그레스 바 이동
const changeVideoProgressTime = (event) => {
  event.stopPropagation();
  if(!youtube) return;

  const barFullWidth = progressContainer.clientWidth;
  const clickedPoint = event.offsetX;
  const clickedPointTime = youtube.getDuration() * (clickedPoint / barFullWidth);

  youtube.seekTo(clickedPointTime);
};

//프로그레스바 hover, 재생시간 툴팁 show
const showTimeTooltip = (event) => {
  if (!youtube) return;

  const barFullWidth = progressContainer.clientWidth;
  const hoverPoint = event.offsetX;
  const hoveredPointTime = youtube.getDuration() * (hoverPoint / barFullWidth);

  toolTip.style.display = "block";
  toolTip.style.left = (hoverPoint - 25) + "px";
  toolTip.innerText = formatTime(hoveredPointTime);
}

//프로그레스바 mouseleave, 재생시간 툴팁 hide
const hideTimeTooltip = () => {
  toolTip.style.display = "none";
}

//볼륨 바 이동
const changeSoundbarValue = (event) => {
  event.stopPropagation();
  if(!youtube) return;

  const barFullWidth = soundRange.clientWidth;
  const clickedPoint = event.offsetX;
  const updatedVolume = Math.floor((clickedPoint / barFullWidth) * 100);

  if(updatedVolume === 0){
    volumeBtn.className = "fa-solid fa-volume-xmark";
    youtube.mute();
  } else {
    volumeBtn.className = "fa-solid fa-volume-high";
  }
  
  if(volumeBtn.classList.contains("fa-volume-xmark")){
    youtube.unMute();
  } else {
    volumeBtn.className = "fa-solid fa-volume-high";
  }

  currentVolume = updatedVolume;
  soundValue.style.width = currentVolume + "%";

  youtube.setVolume(updatedVolume);
  localStorage.setItem(STORAGE_VOLUME, currentVolume);
}

//볼륨버튼 > 업데이트
const volumeUpdate = () => {
  console.log("가지고있는 로컬데이터로 볼륨값 업데이트");
  currentVolume = localStorage.getItem(STORAGE_VOLUME);

  if(youtube){
    console.log("유튜브 로드후 볼륨 세팅, 현재: ", typeof Number(currentVolume));
    youtube.setVolume(Number(currentVolume));
  }
  
  soundValue.style.width = currentVolume + "%";
}

//토글 볼륨/뮤트
const toggleVolumeMute = (event) => {
  event.stopPropagation();
  if(!youtube) return;

  if(event.target.classList.contains("fa-volume-high")){
    volumeBtn.className = "fa-solid fa-volume-xmark";
    currentVolume = youtube.getVolume();
    soundValue.style.width = 0 + "%";
    youtube.mute();
    localStorage.setItem(STORAGE_VOLUME, 0);

  } else {
    volumeBtn.className = "fa-solid fa-volume-high";
    youtube.unMute();
    youtube.setVolume(currentVolume);
    soundValue.style.width = currentVolume + "%";
    localStorage.setItem(STORAGE_VOLUME, currentVolume);
  }
}

//랜덤재생 > 업데이트
const randomPlayUpdate = () => {
  console.log("random update");
  const isRandom = getLocalData().setting.isRandom;

  if(isRandom === "off"){
    randomBtn.setAttribute("data-random", "off");
    randomBtn.style.color = "black";

  } else if(isRandom === "on") {
    randomBtn.setAttribute("data-random", "on");
    randomBtn.style.color = "red";
  }
  return;
}

//반복재생 타입 > 업데이트
const repeatPlayTypeUpdate = () => {
  console.log("repeat type update");
  const isRepeat = getLocalData().setting.isRepeat;

  switch (isRepeat) {
    case "off":
      repeatBtn.setAttribute("data-repeat", "off");
      repeatBtn.className = "fa-solid fa-repeat";
      repeatBtn.style.color = "black";
      break;
    case "on":
      repeatBtn.setAttribute("data-repeat", "on");
      repeatBtn.style.color = "red";
      break;
    case "one":
      repeatBtn.setAttribute("data-repeat", "one");
      repeatBtn.style.color = "red";
      repeatBtn.className = "fa-solid fa-rotate-right";
      break;
  }
}

//유튜브 아이프레임 이벤트
const onPlayerReady = (event) => {
  console.log("플레이어 레디");
  playBtn.className = "fa-solid fa-pause";

  let interval_update_time;
  clearInterval(interval_update_time);

  //initial
  updateVideoProgressTime();
  updateVideoProgressBar();
  

  //재생중 시간 & 프로그레스바 업데이트
  interval_update_time = setInterval(() => {
    updateVideoProgressTime();
    updateVideoProgressBar();
  }, 1000);

  //현재 볼륨 업데이트
  volumeUpdate();
  
  //유튜브 재생
  event.target.playVideo();
}

const onPlayerStateChange = async (event, clickedVideoIdx) => {
  const state = event.data;
  const isRandom = getLocalData().setting.isRandom;
  const isRepeat = getLocalData().setting.isRepeat;

  if(state === 1){ //재생
    playBtn.className = "fa-solid fa-pause";
  }

  if(state === 0){ //종료

    //조회수 증가
    const youtubeId = event.target.getVideoData().video_id;

    await fetch(`/api/video/${youtubeId}/view`, {
      method: "POST",
    });
    console.log("조회수 증가");

    //재생타입: 1개 반복
    if(isRepeat === "one"){
      console.log("한개 영상 반복 재생", clickedVideoIdx);
      const playOneVideo = playlist.querySelectorAll("li")[clickedVideoIdx].firstChild;
      playOneVideo.click();

    }

    //재생타입 : 랜덤
    if(isRandom === "on"){
      console.log("랜덤 반복재생 시작");
      const totalLocalVideos = getLocalData().videos.length;
      let randomIndex = Math.floor(Math.random() * totalLocalVideos);

      while(totalLocalVideos !== 1){
        console.log("랜덤재생 시작2");
        randomIndex = Math.floor(Math.random() * totalLocalVideos);
        const randomPlayVideo = getLocalData().videos[randomIndex];
        
        playClickedVideo(randomIndex, randomPlayVideo);
        return;
      }
    }

    //재생타입 :일반 반복
    if(isRepeat === "on"){
      console.log("일반 반복재생 시작");
      const totalLocalVideos = getLocalData().videos.length;
      const playNowVideoIndex = getLocalData().playNowVideo.targetIndex;

      if(totalLocalVideos - 1 === playNowVideoIndex){
        console.log("마지막 영상, 1번 영상으로")
        playlist.querySelectorAll("li")[0].firstChild.click();
        return;
      }
    }
  }

  if(state === 0 || state === 2){
    //일시정지 or 종료
    playBtn.className = "fa-solid fa-play";

    //조회수 1증가 전송(POST)
    //시청시간 전송(POST)
    //재생타입 : 1개만 반복
  }
}

//클릭된 영상 플레이어로 재생
const playClickedVideo = (clickedVideoIdx, video) => {
  console.log("해당 비디오 재생하기", clickedVideoIdx, video);

  //받은 데이터로 Update
  const localData = getLocalData();
  const playNowVideo = {
    targetIndex: clickedVideoIdx,
    targetVideo: video,
  }

  localData.playNowVideo = playNowVideo;
  setLocalData(localData);
  console.log("현재 재생 시작한 비디오", playNowVideo);

  //유튜브 아이프레임 RESET
  if(youtube){
    youtube.destroy();
  }

  //비디오 리스트 정보 Update
  cover.style.backgroundImage = "url('" + video.thumbUrl + "')";
  title.innerText = video.title;
  category.innerText = video.category;
  duration.innerText =  formatTime(video.runningTime);
  
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

//로컬데이터 로드 > 비디오
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
      isRandom: "off",
      isRepeat: "off",
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

    //로컬데이터_기본 볼륨 값 저장
    localStorage.setItem(STORAGE_VOLUME, 50);

    //현재 플레이 비디오 정보
    title.innerText = "오늘 작업 BGM을 골라볼까?"
    category.innerText = "플레이어를 이용해서 영상을 플레이해보세요."
  }

  //가지고있는 로컬데이터를 플레이어리스트 데이터로 UI 업데이트
  videos.forEach((video) => playListUIupdate(video));

  //가지고있는 로컬볼륨 데이터 값으로 업데이트
  volumeUpdate();

  //랜덤플레이 업데이트
  randomPlayUpdate();

  //반복타입 업데이트
  repeatPlayTypeUpdate();
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

      const existVideo = playlist.querySelectorAll("li")[existVideoIdx].firstChild;
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

videoItemAllPlayBtn.forEach((playBtn) => 
  playBtn.addEventListener("click", playVideoWithPlayer)
);

//플레이어 컨트롤 : 재생버튼
playBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  //유튜브 아이프레임이 아직 로드되지 않았을경우
  if(!youtube){
    console.log("유튜브 로드전..");
    const playNowVideoIdx = getLocalData().playNowVideo.targetIndex;
    const playNowVideo = playlist.querySelectorAll("li")[playNowVideoIdx].firstChild;
    playNowVideo.click();
    return;
  }

  //유튜브 아이프레임 로드 후
  const state = youtube.getPlayerState();

  //재생중 -> 정지
  if(state === 1){
    youtube.pauseVideo();
  }

  //일시정지 + 재생끝 -> 재생
  if(state === 2 || state === 0){
    youtube.playVideo();
  }
});

//플레이어 컨트롤 : 프로그레스 시간 위치 변경
progressContainer.addEventListener("click", changeVideoProgressTime);

//플레이어 컨트롤 : 프로그레스바 hover, 타임 툴팁 show
progressContainer.addEventListener("mouseover", showTimeTooltip);
progressContainer.addEventListener("mousemove", showTimeTooltip);
progressContainer.addEventListener("mouseleave", hideTimeTooltip);

//플레이어 컨트롤 : 볼륨아이콘 hover/leave, range show
volumeBtn.addEventListener("click", toggleVolumeMute);

volumeBtn.addEventListener("mouseover", () => {
  soundRange.style.width = 70 + "px";
});

descContainer.addEventListener("mouseleave", () => {
  soundRange.style.width = 0 + "px";
});

soundRange.addEventListener("click", changeSoundbarValue);

//플레이어 컨트롤: 이전 비디오, 다음 비디오 재생
prevBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const totalLocalVideos = getLocalData().videos.length;
  const localPlayNowVideo = getLocalData().playNowVideo.targetIndex;
  const prevVideoIdx = localPlayNowVideo - 1;
  const li = playlist.querySelectorAll("li");
  
  let prevVideo;
  const isRandom = getLocalData().setting.isRandom;
  let randomIndex = Math.floor(Math.random() * totalLocalVideos);

  //랜덤재생 체크
  while(totalLocalVideos !== 1 && isRandom === "on"){
    console.log("랜덤 순서 다음 영상");
    randomIndex = Math.floor(Math.random() * totalLocalVideos);
    const randomPlayVideo = getLocalData().videos[randomIndex];
    
    playClickedVideo(randomIndex, randomPlayVideo);
    return;
  }

  if(prevVideoIdx >= 0){
    prevVideo = li[prevVideoIdx].firstChild;
    console.log("이전 영상", prevVideo);
    prevVideo.click();
    return;
  }
});

nextBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const totalLocalVideos = getLocalData().videos.length;
  const localPlayNowVideo = getLocalData().playNowVideo.targetIndex;
  const nextVideoIdx = localPlayNowVideo + 1;
  const li = playlist.querySelectorAll("li");

  let nextVideo;
  const isRandom = getLocalData().setting.isRandom;
  let randomIndex = Math.floor(Math.random() * totalLocalVideos);

  //랜덤재생 체크
  while(totalLocalVideos !== 1 && isRandom === "on"){
    console.log("랜덤 순서 다음 영상");
    randomIndex = Math.floor(Math.random() * totalLocalVideos);
    const randomPlayVideo = getLocalData().videos[randomIndex];
    
    playClickedVideo(randomIndex, randomPlayVideo);
    return;
  }

  if (nextVideoIdx < totalLocalVideos){
    nextVideo = li[nextVideoIdx].firstChild;
    console.log("다음 영상", nextVideo);
    nextVideo.click();
    return;
  }
});

//플레이어 컨트롤 : 랜덤 재생
randomBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const localData = getLocalData();

  if(repeatBtn.dataset.repeat === "one" || repeatBtn.dataset.repeat === "on"){
    return;
  }
  
  switch (randomBtn.dataset.random){
    case "on":
      randomBtn.setAttribute("data-random", "off");
      randomBtn.style.color = "black";
      localData.setting.isRandom = "off";
      break;
    case "off":
      randomBtn.setAttribute("data-random", "on");
      randomBtn.style.color = "red";
      localData.setting.isRandom = "on";
      break;
  }

  setLocalData(localData);
  console.log("재생 순서 랜덤");
});

//플레이어 컨트롤 : 반복 재생, 1개 반복
repeatBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  const localData = getLocalData();

  if(randomBtn.dataset.random === "on"){
    return;
  }

  switch (repeatBtn.dataset.repeat) {
    case "off":
      repeatBtn.setAttribute("data-repeat", "on");
      localData.setting.isRepeat = "on";
      repeatBtn.style.color = "red";
      break;
    case "on":
      repeatBtn.setAttribute("data-repeat", "one");
      localData.setting.isRepeat = "one";
      repeatBtn.style.color = "red";
      repeatBtn.className = "fa-solid fa-rotate-right";
      break;
    case "one":
      repeatBtn.setAttribute("data-repeat", "off");
      localData.setting.isRepeat = "off";
      repeatBtn.style.color = "black";
      repeatBtn.className = "fa-solid fa-repeat";
      break;
  }

  setLocalData(localData);
  console.log("반복재생 / 1영상 반복 재생");
});

//플레이리스트 재생하기
const playlistPlayBtns = document.querySelectorAll(".playlist-play-btn");

const addPlaylistToPlayer = async (event) => {
  event.stopPropagation();
  const playlistId = event.target.parentNode.parentNode.dataset.id;
  const response = await (await fetch(`/playlist/${playlistId}/play`)).json();

  //기존 플레이리스트 목록 삭제
  while (playlist.childNodes.length > 0){
    playlist.removeChild(playlist.firstChild)
  }

  //플레이할 플리 영상을 로드
  if(response.ok){
    let localData = getLocalData();

    //기존의 플리 영상 삭제 새로운 영상으로 업데이트
    const newVideos = [...response.videos];
    const newPlayNowVideo = {
      targetIndex: 0,
      targetVideo: response.videos[0]
    };

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

playlistPlayBtns.forEach((playBtn) => {
  playBtn.addEventListener("click", addPlaylistToPlayer)
});