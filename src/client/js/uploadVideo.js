const uploadForm = document.getElementById("uploadForm");
const previewBtn = document.getElementById("previewBtn");
const youtubeUrlInput = document.getElementById("youtubeUrl");
const titleInput = document.getElementById("title");
const youtubeIdInput = document.getElementById("youtubeId");
const runningTimeInput = document.getElementById("runningTime");
let previewPlayer;



const showPreviewPlayer = () => {
  const url = youtubeUrlInput.value;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  const matchedUrlInfo = url.match(regExp);
  

  if(matchedUrlInfo && matchedUrlInfo[7].length === 11){
    const youtubeId = matchedUrlInfo[7];
    youtubeIdInput.value = youtubeId;
    loadPreviewPlayer(youtubeId);

  } else {
    alert("잘못된 ID 입니다. 다시 한번 링크를 확인하세요.");
    youtubeUrlInput.focus();
    youtubeUrlInput.value = "";
    youtubeIdInput.value = "";
  }
}

const loadPreviewPlayer = (youtubeId) => {
  if(previewPlayer){
    previewPlayer.destroy();
  }

  previewPlayer = new YT.Player("youtubeIframe", {
    videoId: youtubeId,
    playerVars: { autoplay: 0 },
    events: {
      onReady: onPreviewPlayerReady,
      //onStateChange: onStateChange
    }
  });
}

const onPreviewPlayerReady = (event) => {
  const { 
    playerInfo: { 
      videoData: { 
        video_id,
        title
      },
      duration,
    } 
  } = event.target;

  titleInput.value = title;
  youtubeIdInput.value = video_id;
  runningTimeInput.value = duration;
}

previewBtn.addEventListener("click", showPreviewPlayer);