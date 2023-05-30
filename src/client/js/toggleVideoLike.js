console.log("toggleLike");

const toggleVideoLike = async (event) => {
  const videoId = event.target.parentNode.children[0].dataset.id;

  const response = await (
    await fetch(`/api/video/${videoId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  if(response.ok){
    const target = event.target;
    
    if(response.like){
      target.className = "fa-solid fa-thumbs-up like";
    } else {
      target.className = "fa-regular fa-thumbs-up like";
    }
  }
}

const likeBtns = document.querySelectorAll(".like");
likeBtns.forEach((likeBtn) => {
  likeBtn.addEventListener("click", toggleVideoLike);
});

