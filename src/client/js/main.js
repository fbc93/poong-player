import "../scss/styles.scss";
import "../images/image1.png";
import "../images/image2.png";
import "../images/image3.png";
import "../images/image4.png";
import "../images/favicon.png";
import "../images/og_image.png";
import "../images/apple-icon-180x180.png";
import "../images/android-icon-192x192.png";
import "../images/sort-down-solid.svg";
import "./player";
import "./toggleLike";
import "./playlist";

const STORAGE_KEY = "PoongTheme";
const DARK = "darkMode";
const LIGHT = "lightMode";

const themeState = localStorage.getItem(STORAGE_KEY) || DARK;
const themeToggleBtn = document.getElementById("themeToggleBtn");

document.documentElement.setAttribute("data-theme", themeState);

localStorage.setItem(STORAGE_KEY, themeState);
themeToggleBtn.className = (themeState === DARK ? DARK : LIGHT);
themeToggleBtn.firstChild.className = (themeState === DARK ? "fa-solid fa-lightbulb" : "fa-regular fa-lightbulb");

const toggleTheme = (event) => {
  
  if (event.currentTarget.className === DARK){
    document.documentElement.setAttribute("data-theme", LIGHT);
    event.currentTarget.className = LIGHT;

    event.target.className = "fa-regular fa-lightbulb";
    localStorage.setItem(STORAGE_KEY, LIGHT);

  } else if (event.currentTarget.className === LIGHT){
    document.documentElement.setAttribute("data-theme", DARK);
    event.currentTarget.className = DARK;

    event.target.className = "fa-solid fa-lightbulb";
    localStorage.setItem(STORAGE_KEY, DARK);
  }
}

themeToggleBtn.addEventListener("click", toggleTheme);

//플레이어 뷰 토글
const playlistViewToggleBtn = document.getElementById("playlistViewToggleBtn");
const playlistView = document.getElementById("playlistView");

const togglePlaylistView = (event) => {
  const btnClassName = event.target.classList[1];

  if(btnClassName === "fa-caret-up"){
    playlistView.style.transform = "translateY(0px)";
    event.target.className = "fa-solid fa-caret-down";
  } else {
    playlistView.style.transform = "translateY(9999px)";
    event.target.className = "fa-solid fa-caret-up";
  }
  
}

playlistViewToggleBtn.addEventListener("click", togglePlaylistView);


//popular
const popularAllItems = document.querySelectorAll(".popular > li");

const showPopularItem = (event) => {
  event.currentTarget.lastChild.style.display = "flex";
};

const hidePopularItem = (event) => {
  event.currentTarget.lastChild.style.display = "none";
};

popularAllItems.forEach((item) =>
  item.addEventListener("mouseover", showPopularItem)
);

popularAllItems.forEach((item) => 
  item.addEventListener("mouseleave", hidePopularItem)
);

//최신 업로드 영상 시간 포멧
const allCreatedAt = document.querySelectorAll(".createdAt");

const makeCreatedTimeFormat = () => {
  allCreatedAt.forEach((item) => {
    const start = new Date (Date.parse(item.innerText));
    const end = new Date();

    const diff = (end - start) / 1000;

    const times = [
      {name: "년", ms: 60 * 60 * 24 * 365},
      {name: "개월", ms: 60 * 60 * 24 * 30},
      {name: "일", ms: 60 * 60 * 24},
      {name: "시간", ms: 60 * 60},
      {name: "분", ms: 60},
    ];

    for (const value of times) {
      const betweenTime = Math.floor(diff / value.ms);

      if (betweenTime > 0) {
        return item.innerText = `⏰ ${betweenTime}${value.name} 전`;
      }
    }

    return item.innerText = '방금 전';
  });
}

makeCreatedTimeFormat();

//navbar menu toggle
const menuToggleBtn = document.getElementById("menuToggleBtn");
const mainNav = document.querySelector(".main-nav");
const closeBtn = document.querySelector(".closeBtn");

const showMenu = () => {
  mainNav.style.display = "block";
  mainNav.style.width = "100%";
  mainNav.style.zIndex = "10000";
}

const hideMenu = () => {
  mainNav.style.display = "none";
}

menuToggleBtn.addEventListener("click", showMenu);
closeBtn.addEventListener("click", hideMenu);

//최신 업로드 영상 > 더보기 버튼
const showMoreBtn = document.querySelector(".show-more-btn");
const uploadItems = document.querySelectorAll(".new li");

if(showMoreBtn && uploadItems){
  showMoreBtn.addEventListener("click", () => {
    uploadItems.forEach((uploadItem) => {
      uploadItem.style.display = "block";
      showMoreBtn.style.display = "none";
    })
  });
}
