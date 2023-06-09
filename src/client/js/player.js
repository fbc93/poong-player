import defaultVideos from "../data/dummyList.json";

const STORAGE_KEY = "poong_videos";
const STORAGE_VOLUME = "poong_volume";

let currentVolume;
let youtube;

//플레이어 영역
const playlist = document.getElementById("playlist");

//플레이어 컨트롤 버튼
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const descContainer = document.querySelector(".desc-container");

const volumeBtn = document.getElementById("volumeBtn");
const soundRange = document.getElementById("soundRange");
const soundValue = document.querySelector("#soundRange .value");

const repeatBtn = document.getElementById("repeatBtn");
const randomBtn = document.getElementById("randomBtn");

//플레이 타임 progressBar
const progressTime = document.getElementById("progressTime");
const progressContainer = document.querySelector(".progress-container");
const toolTip = document.getElementById("toolTip");

//플레이 타임 value
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

//현재 재생 비디오 정보
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const category = document.getElementById("category");

//영상 썸네일 > 재생버튼, 영상 목록 > 재생버튼
const videoItemAllPlayBtn = document.querySelectorAll(".play");

//업로드 시간 포멧
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

//재생 중 시간 & 재생 전체시간 update
const updateVideoProgressTime = () => {
  if(!youtube) return;
  if(typeof youtube.getPlayerState !== "function") return; //function type check
  const state = youtube.getPlayerState(); //state = 시작되지 않음(-1), 버퍼링(3), 동영상신호(5)

  if(state === -1 || state === 3 || state === 5) return;

  //재생시간 UI에 반영
  currentTime.innerText = formatTime(youtube.getCurrentTime());
  duration.innerText = formatTime(youtube.getDuration());
}

//재생 프로그레스 바 style width update
const updateVideoProgressBar = () => {
  if(!youtube) return;
  if(typeof youtube.getCurrentTime !== "function" || typeof youtube.getDuration !== "function") return; //function type check

  const currentTime = youtube.getCurrentTime();
  const duration = youtube.getDuration();

  return progressTime.style.width = (currentTime/duration) * 100 + "%";
}

//클릭하여 프로그레스 바 시간 위치 변경
const changeVideoProgressTime = (event) => {
  event.stopPropagation();
  if(!youtube) return;
  if(typeof youtube.getDuration !== "function" || typeof youtube.seekTo !== "function") return; //function type check

  const barFullWidth = progressContainer.clientWidth;
  const clickedPoint = event.offsetX;
  const clickedPointTime = youtube.getDuration() * (clickedPoint / barFullWidth);

  youtube.seekTo(clickedPointTime);
};

//프로그레스바 hover, 재생시간 툴팁 show
const showTimeTooltip = (event) => {
  if (!youtube) return;
  if(typeof youtube.getDuration !== "function") return;

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
  if(typeof youtube.mute !== "function" || typeof youtube.unMute !== "function" || typeof youtube.setVolume !== "function") return; //function type check

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
  currentVolume = localStorage.getItem(STORAGE_VOLUME);

  if(youtube){
    youtube.setVolume(Number(currentVolume));
  }
  
  soundValue.style.width = currentVolume + "%";
}

//토글 볼륨/뮤트
const toggleVolumeMute = (event) => {
  event.stopPropagation();
  if(!youtube) return;
  if(typeof youtube.mute !== "function" || typeof youtube.unMute !== "function" || typeof youtube.setVolume !== "function" || typeof youtube.getVolume !== "function") return; //function type check

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
  const isRandom = getLocalData().setting.isRandom;

  if(isRandom === "off"){
    randomBtn.setAttribute("data-random", "off");
    randomBtn.classList.remove("active");

  } else if(isRandom === "on") {
    randomBtn.setAttribute("data-random", "on");
    randomBtn.classList.add("active");
  }
}

//반복재생 타입 > 업데이트
const repeatPlayTypeUpdate = () => {
  const isRepeat = getLocalData().setting.isRepeat;

  switch (isRepeat) {
    case "off":
      repeatBtn.setAttribute("data-repeat", "off");
      repeatBtn.className = "fa-solid fa-repeat";
      break;
    case "on":
      repeatBtn.setAttribute("data-repeat", "on");
      repeatBtn.classList.add("active");
      break;
    case "one":
      repeatBtn.setAttribute("data-repeat", "one");
      repeatBtn.className = "fa-solid fa-rotate-right active";
      break;
  }
}

//YT Event_onPlayerReady
const onPlayerReady = (event) => {
  playBtn.className = "fa-solid fa-pause";

  let interval_update_time;
  clearInterval(interval_update_time);

  //init update
  updateVideoProgressTime();
  updateVideoProgressBar();
  
  //재생중 시간 & 프로그레스바 1초마다 업데이트
  interval_update_time = setInterval(() => {
    updateVideoProgressTime();
    updateVideoProgressBar();
  }, 1000);

  //현재 볼륨 업데이트
  volumeUpdate();
  
  //유튜브 재생
  event.target.playVideo();
}

//YT Event_onStateChange
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
    await fetch(`/api/video/${youtubeId}/view`, { method: "POST" });

    //재생타입: 1개 영상 반복
    if(isRepeat === "one"){
      const playOneVideo = playlist.querySelectorAll("li")[clickedVideoIdx].firstChild;
      playOneVideo.click();
    }

     //재생타입 :일반 반복
     if(isRepeat === "on"){
      const totalLocalVideos = getLocalData().videos.length;
      const playNowVideoIndex = getLocalData().playNowVideo.targetIndex;

      if(totalLocalVideos - 1 === playNowVideoIndex){
        return playlist.querySelectorAll("li")[0].firstChild.click();
      }

      playlist.querySelectorAll("li")[playNowVideoIndex + 1].firstChild.click();
    }

    //재생타입 : 랜덤 반복
    if(isRandom === "on"){
      const totalLocalVideos = getLocalData().videos.length;
      let randomIndex = Math.floor(Math.random() * totalLocalVideos);

      while(totalLocalVideos !== 1){
        randomIndex = Math.floor(Math.random() * totalLocalVideos);
        const randomPlayVideo = getLocalData().videos[randomIndex];
        
        return playClickedVideo(randomIndex, randomPlayVideo);
      }
    }
  }

  if(state === 0 || state === 2){
    //일시정지 or 종료
    playBtn.className = "fa-solid fa-play";
  }
}

//클릭된 영상 플레이어로 재생
const playClickedVideo = (clickedVideoIdx, video) => {

  //받은 데이터로 Update
  const localData = getLocalData();
  const playNowVideo = {
    targetIndex: clickedVideoIdx,
    targetVideo: video,
  }

  localData.playNowVideo = playNowVideo;
  setLocalData(localData);

  //유튜브 아이프레임 RESET
  if(youtube){
    youtube.destroy();
  }

  //비디오 리스트 정보 UI Update
  cover.style.backgroundImage = "url('" + video.thumbUrl + "')";
  title.innerText = video.title;
  category.innerText = video.category;

  switch (video.category) {
    case "풍월량":
      category.setAttribute("class", "");
      category.setAttribute("class", "category poong");
      break;
    case "쉬는시간":
      category.setAttribute("class", "");
      category.setAttribute("class", "category rest-time");
      break;
    case "기타영상":
      category.setAttribute("class", "");
      category.setAttribute("class", "category etc");
      break;
  }

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
  event.stopPropagation();

  const localVideos = getLocalData().videos;
  let clickedVideoIdx;

  //클릭된 영상 인덱스 구하기
  localVideos.map((localVideo, index) => localVideo._id === video._id ? (
    clickedVideoIdx = index
  ) : null);

  //클릭된 영상 플레이어로 재생
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

  switch (video.category) {
    case "풍월량":
      category.setAttribute("class", "");
      category.setAttribute("class", "category poong");
      break;
    case "쉬는시간":
      category.setAttribute("class", "");
      category.setAttribute("class", "category rest-time");
      break;
    case "기타영상":
      category.setAttribute("class", "");
      category.setAttribute("class", "category etc");
      break;
  }

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
    //기존에 저장된 로컬데이터 로드
    videos = localData.videos;
    const playNowVideo = localData.playNowVideo;

    cover.style.backgroundImage = "url('" + playNowVideo.targetVideo.thumbUrl + "')";
    title.innerText = playNowVideo.targetVideo.title;
    category.innerText = playNowVideo.targetVideo.category;

    switch (playNowVideo.targetVideo.category) {
      case "풍월량":
        category.setAttribute("class", "");
        category.setAttribute("class", "category poong");
        break;
      case "쉬는시간":
        category.setAttribute("class", "");
        category.setAttribute("class", "category rest-time");
        break;
      case "기타영상":
        category.setAttribute("class", "");
        category.setAttribute("class", "category etc");
        break;
    }

    duration.innerText = formatTime(playNowVideo.targetVideo.runningTime);

  } else {
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

//플레이어 컨트롤 : 프로그레스 바 시간 위치 변경
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
    randomIndex = Math.floor(Math.random() * totalLocalVideos);
    const randomPlayVideo = getLocalData().videos[randomIndex];
    
    playClickedVideo(randomIndex, randomPlayVideo);
    return;
  }

  if(prevVideoIdx >= 0){
    prevVideo = li[prevVideoIdx].firstChild;
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
    randomIndex = Math.floor(Math.random() * totalLocalVideos);
    const randomPlayVideo = getLocalData().videos[randomIndex];
    
    playClickedVideo(randomIndex, randomPlayVideo);
    return;
  }

  if (nextVideoIdx < totalLocalVideos){
    nextVideo = li[nextVideoIdx].firstChild;
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
      randomBtn.classList.remove("active");
      localData.setting.isRandom = "off";
      break;
    case "off":
      randomBtn.setAttribute("data-random", "on");
      randomBtn.classList.add("active");
      localData.setting.isRandom = "on";
      break;
  }

  setLocalData(localData);
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
      repeatBtn.classList.add("active");
      break;
    case "on":
      repeatBtn.setAttribute("data-repeat", "one");
      localData.setting.isRepeat = "one";
      repeatBtn.className = "fa-solid fa-rotate-right active";
      break;
    case "one":
      repeatBtn.setAttribute("data-repeat", "off");
      localData.setting.isRepeat = "off";
      repeatBtn.className = "fa-solid fa-repeat";
      break;
  }

  setLocalData(localData);
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

//플레이리스트 개별 페이지
const playlistPagePlayBtns = document.querySelectorAll(".playlistPage-play-btn");

const addPlaylistPageToPlayer = async (event) => {
  event.stopPropagation();
  const playlistId = event.currentTarget.parentNode.dataset.id;
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

playlistPagePlayBtns.forEach((playBtn) => {
  playBtn.addEventListener("click", addPlaylistPageToPlayer)
});