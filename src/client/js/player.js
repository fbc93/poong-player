import defaultData from "../data/dummyList.json";

const STORAGE_KEY = "recent_pl";
const viewScreen = document.getElementById("viewScreen");
const playlist = document.getElementById("playlist");
const playBtn = document.querySelector("#playBtn");
const duration = document.querySelector("#duration");
const cover = document.querySelector("#cover");
const title = document.querySelector("#title");
let youtube;

//로컬스토리지 GET / SET
const getLocalData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

const setLocalData = (data) => {
  return localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

//비디오 재생
const playVideo = (video, currentIdx) => {
  let localData = getLocalData();

  const playNowVideo = {
    targetIndex: currentIdx,
    targetVideo: video,
  }

  localData.playNowVideo = playNowVideo;
  setLocalData(localData);

  //기존 영상 삭제
  if(youtube){
    youtube.destroy();
  }

  const currentVideoIdx = playNowVideo.targetIndex;

  const videoItems = playlist.querySelectorAll("li");
  videoItems.forEach((videoItem) => {
    videoItem.className = "";
  });

  const targetVideo = playlist.querySelectorAll("li")[currentVideoIdx];
  targetVideo.className = "playing";

  youtube = new YT.Player("viewScreen", {
    videoId: video.youtubeId,
    playerVars: { 
      controls: 0,
      autoplay: 1
     },
    events: {
      onReady: onPlayerReady,
      onStateChange: (event) => onPlayerStateChange(event, currentIdx),
    },
  });
}

const resetList = () => {
  while (playlist.firstChild){
    playlist.removeChild(playlist.firstChild);
  }
}

const playVideoOnPlayer = async (event) => {
  event.stopPropagation();
  console.log("hey")

  const videoId = event.currentTarget.dataset.id;
  const response = await (await fetch(`api/video/${videoId}`)).json();
  console.log(response)

  if(response.ok){
    let localData = getLocalData();
    const prevVideoList = localData.recentList;

    //기존리스트에 새 데이터가 존재하는지 확인
    let existVideoIdx;
    prevVideoList.forEach((prevVideo, index) => {
      return prevVideo._id === response.video._id ? (existVideoIdx = index) : null;
    });

    if (existVideoIdx !== undefined){
      alert("이미 영상이 리스트에 존재합니다.\n해당 영상을 재생합니다.");
      
      const existVideoList = playlist.querySelectorAll("li")[existVideoIdx];
      existVideoList.click();
      return;
    }

    const newRecentList = [response.video, ...localData.recentList];
    const NewPlayNowVideo = {
      targetIndex: 0,
      targetVideo: response.video,
    };

    localData.recentList = newRecentList;
    localData.playNowVideo = NewPlayNowVideo;
    setLocalData(localData);
    resetList();
    loadRecentList();

    const firstVideo = playlist.querySelectorAll("li")[0];
    firstVideo.click();
  }
}

//유튜브 onReady
const onPlayerReady = (event) => {
  return;
}

//유튜브 onPlayerChange
const onPlayerStateChange = (event, currentIdx) => {
  const localData = getLocalData();
  const currentVideoIdx = localData.playNowVideo.targetIndex;
  const targetVideo = playlist.querySelectorAll("li")[currentVideoIdx];
}

const playBtns = document.querySelectorAll(".playBtn");
playBtns.forEach((btn) => btn.addEventListener("click", playVideoOnPlayer));


//비디오 클릭 이벤트
const clickVideo = (event, video) => {
  console.log("clickVideo")
  event.stopPropagation();

  const recentList = getLocalData().recentList;

  let currentIdx;
  recentList.map((recentVideo, index) => {
    recentVideo._id === video._id ? (currentIdx = index) : null;
  });

  playVideo(video, currentIdx);
}

const addPlayListItem = (video) => {
  const li = document.createElement("li");
  const titleSpan = document.createElement("span");
  const deleteBtn = document.createElement("button");

  li.dataset.id = video._id;
  titleSpan.innerText = video.title;
  deleteBtn.innerText = "❌";

  li.appendChild(titleSpan);
  li.appendChild(deleteBtn);
  li.addEventListener("click", (event) => clickVideo(event, video));

  playlist.appendChild(li);


  //삭제버튼
  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    let localData = getLocalData();
    const prevRecentList = localData.recentList;

    let deleteIdx;
    prevRecentList.map((prevVideo, index) => {
      prevVideo._id === video._id ? (deleteIdx = index) : null;
    });

    const recentList = localData.recentList;
    let currentVideoIdx = localData.playNowVideo.targetIndex;

    if(deleteIdx === currentVideoIdx) {
      alert("재생중인 곡은 삭제할수 없어요.");
      return;
    }

    const newRecentList = prevRecentList.filter((prevVideo, index) => index !== deleteIdx);
    
    newRecentList.map((newVideo, index) => {
      newVideo._id === recentList._id ? (currentVideoIdx = index) : null
    });

    localData.playNowVideo.targetIndex = currentVideoIdx;
    localData.recentList = newRecentList;
    setLocalData(localData);
    console.log(li)
    li.remove();
  });
}

const loadPlayer = () => {
  let recentList, playNowVideo, settings;
  const localData = getLocalData();
  
  //로컬스토리지 데이터가 없을때
  if(!localData){
    playNowVideo = {
      targetVideo: defaultData[0],
      targetIndex: 0,
    };

    recentList = defaultData;

    settings = {
      isRandom: false,
      isRepeat: false,
      isPlay: false,
      isPause: false,
      isBuffer: false,
      currentTime: 0,
      totalTime: 0,
    };

    const data = { recentList, playNowVideo, settings };
    setLocalData(data);
  }

  if(localData){
    playNowVideo = localData.playNowVideo;
    recentList = localData.recentList;

  }

  //데이터 플레이어 리스트에 추가
  recentList.forEach((video) => addPlayListItem(video));
}

//Data Load
loadPlayer();
