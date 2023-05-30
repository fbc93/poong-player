console.log("toggleLike");

const popularToggleVideoLike = async (event) => {
  const DATA_ID_1 = event.target.parentNode.children[0].dataset.id;

  const videoId = DATA_ID_1;

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

const chartToggleVideoLike = async (event) => {
  const DATA_ID_2 = event.target.parentNode.children[5].dataset.id;
  
  const videoId = DATA_ID_2;

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

const popularLikeBtns = document.querySelectorAll(".popular .like");
popularLikeBtns.forEach((likeBtn) => {
  likeBtn.addEventListener("click", popularToggleVideoLike);
});

const chartLikeBtns = document.querySelectorAll(".chart .like");
chartLikeBtns.forEach((likeBtn) => {
  likeBtn.addEventListener("click", chartToggleVideoLike);
})
