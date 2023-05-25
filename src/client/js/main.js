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