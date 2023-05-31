const modal = document.getElementById("modal");
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
    response.playlists.forEach((playlist) => makePlaylistUI(playlist, videoId));
  }
}

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

popularAddPlaylistBtns.forEach((addBtn) => {
  addBtn.addEventListener("click", showPlaylistInModal);
});

removeBtns.forEach((removeBtn) => {
  removeBtn.addEventListener("click", removeVideoFromPlaylist);
});