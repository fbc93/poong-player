import "../scss/styles.scss";
import "./player";

const STORAGE_KEY = "PoongTheme";
const DARK = "darkMode";
const LIGHT = "lightMode";

const themeState = localStorage.getItem(STORAGE_KEY) || DARK;
const themeToggleBtn = document.getElementById("themeToggleBtn");

document.documentElement.setAttribute("data-theme", themeState);

localStorage.setItem(STORAGE_KEY, themeState);
themeToggleBtn.className = (themeState === DARK ? DARK : LIGHT);

const toggleTheme = (event) => {
  if (event.target.className === DARK){
    document.documentElement.setAttribute("data-theme", LIGHT);
    event.target.className = LIGHT;
    localStorage.setItem(STORAGE_KEY, LIGHT);

  } else if (event.target.className === LIGHT){
    document.documentElement.setAttribute("data-theme", DARK);
    event.target.className = DARK;
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