const modal = document.getElementById("modal");
const chartAddPlaylistBtns = document.querySelectorAll(".chart .add");
const popularAddPlaylistBtns = document.querySelectorAll(".popular .add");
const removeBtns = document.querySelectorAll(".remove");

const showModal = (title) => {
  const modalTitle = modal.querySelector(".title");
  modal.style.display = "block";
  modalTitle.innerText = title;
}

const hideModal = () => {
  modal.style.display = "none";
}

const makePlaylistUI = (playlist, videoId) => {
  const li = document.createElement("li");
  li.dataset.playlist = playlist._id;
  li.innerText = playlist.name;

  li.addEventListener("click", () => addVideoToPlaylist(playlist, videoId));
  modal.querySelector(".content-list").append(li);
}

//플레이리스트에 영상 추가
const addVideoToPlaylist = async (playlist, videoId) => {
  const response = await (
    await fetch("/api/playlist/add-video", {
      method: "POST",
      body: JSON.stringify({
        playlistId: playlist._id,
        videoId,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
  ).json();

  if(response.ok){
    alert(`1개의 영상을 ${playlist.name}에 추가하였습니다.`);
    hideModal();

  } else {
    alert(response.errorMsg);
    hideModal();
  }
}

const showPlaylistInModal = async (event) => {
  const videoId = event.target.parentNode.children[0].dataset.id;
  const response = await ( await fetch("/api/playlist/add-video")).json();

  if(response.ok){
    showModal("내 플레이리스트에 추가!");

    //기존 모달 내용 제거
    const contentList = modal.querySelector(".content-list");
    
    while (contentList.childNodes.length > 0){
      contentList.removeChild(contentList.firstChild)
    }

    response.playlists.forEach((playlist) => makePlaylistUI(playlist, videoId));
  }
}

popularAddPlaylistBtns.forEach((addBtn) => {
  addBtn.addEventListener("click", showPlaylistInModal);
});





//chart
const chartAddVideoToPlaylist = async (playlist, videoId) => {
  const response = await (
    await fetch("/api/playlist/add-video", {
      method: "POST",
      body: JSON.stringify({
        playlistId: playlist._id,
        videoId,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
  ).json();

  if(response.ok){
    alert(`1개의 영상을 ${playlist.name}에 추가하였습니다.`);
    hideModal();

  } else {
    alert(response.errorMsg);
    hideModal();
  }
}

const chartMakePlaylistUI = (playlist, videoId) => {
  const li = document.createElement("li");
  li.dataset.playlist = playlist._id;
  li.innerText = playlist.name;

  li.addEventListener("click", () => chartAddVideoToPlaylist(playlist, videoId));
  modal.querySelector(".content-list").append(li);
}


const showChartPlaylistInModal = async (event) => {
  const videoId = event.target.parentNode.children[5].dataset.id;
  const response = await ( await fetch("/api/playlist/add-video")).json();

  if(response.ok){
    showModal("내 플레이리스트에 추가!");

    //기존 모달 내용 제거
    const contentList = modal.querySelector(".content-list");

    while (contentList.childNodes.length > 0){
      contentList.removeChild(contentList.firstChild)
    }

    response.playlists.forEach((playlist) => chartMakePlaylistUI(playlist, videoId));
  }
}

chartAddPlaylistBtns.forEach((addBtn) => {
  addBtn.addEventListener("click", showChartPlaylistInModal)
});





//플레이리스트에서 영상 삭제
const removeVideoFromPlaylist = async (event) => {
  const playlistId = event.target.parentNode.parentNode.dataset.id;
  const videoId = event.target.parentNode.children[5].dataset.id;

  const response = await (
    await fetch("/api/playlist/remove-video", {
      method: "POST",
      body: JSON.stringify({
        playlistId,
        videoId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  if(response.ok){
    window.location.reload();
  }

  if(!response.ok && response.errorMsg){
    alert(errorMsg);
  }
}

removeBtns.forEach((removeBtn) => {
  removeBtn.addEventListener("click", removeVideoFromPlaylist);
});


//플레이리스트 삭제, 제목수정
const modalCloseBtns = document.querySelectorAll(".fa-xmark");
const menuBtns = document.querySelectorAll(".menu");
const playlistMenuModal = document.querySelector("#playlistMenuModal");
const modalPlaylistDeleteBtn = document.querySelector(".delete");

const showPlaylistMenu = async (event) => {
  event.stopPropagation();

  playlistMenuModal.style.display = "block";
  const playlistId = event.target.parentNode.parentNode.parentNode.dataset.id;
  const response = await (await fetch(`/api/playlist/${playlistId}`)).json();
  const nameInput = playlistMenuModal.querySelector("#name"); 
  const playlistIdInput = playlistMenuModal.querySelector("#playlistId");
  const content = playlistMenuModal.querySelector(".content");
  
  if(response.ok){
    nameInput.value = response.result.name;
    playlistIdInput.value = response.result._id;
    content.dataset.id = response.result._id;
  }
}

menuBtns.forEach((menuBtn) => {
  menuBtn.addEventListener("click", showPlaylistMenu);
});

modalCloseBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    playlistMenuModal.style.display = "none";
    modal.style.display = "none";
  })
});

//플레이리스트 삭제
modalPlaylistDeleteBtn.addEventListener("click", async (event) => {
  const playlistId = event.target.parentNode.dataset.id;

  const response = await (
    await fetch("/api/playlist/remove-playlist", {
      method: "POST",
      body: JSON.stringify({
        playlistId
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  if(response.ok){
    window.location.reload();
  }
});