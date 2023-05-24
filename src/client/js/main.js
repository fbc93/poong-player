import "../scss/styles.scss";

const KEY_NAME = "poong_theme";
const theme = localStorage.getItem(KEY_NAME) || "darkMode";
document.documentElement.setAttribute("data-theme", theme);
localStorage.setItem(KEY_NAME, theme);

const themeToggleBtn = document.getElementById("themeToggleBtn");
themeToggleBtn.className = theme === "darkMode" ? "darkMode" : "lightMode";

const toggleTheme = (event) => {
  if (event.target.className === "darkMode"){
    document.documentElement.setAttribute("data-theme", "lightMode");
    event.target.className = "lightMode";
    localStorage.setItem(KEY_NAME, "lightMode");

  } else if (event.target.className === "lightMode"){
    document.documentElement.setAttribute("data-theme", "darkMode");
    event.target.className = "darkMode";
    localStorage.setItem(KEY_NAME, "darkMode");
  }
}

themeToggleBtn.addEventListener("click", toggleTheme);