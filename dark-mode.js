const lightsOffLabel = "月";
const lightsOnLabel = "日";
const lightsOffTitle = "Enable dark mode";
const lightsOnTitle = "Enable light mode";

function toggleDarkMode() {
   if (themeToggle.innerHTML === lightsOffLabel) {
      localStorage.setItem("theme", "dark");
      themeToggle.innerHTML = lightsOnLabel;
      themeToggle.title = lightsOnTitle;
      document.body.classList.add("dark");
   } else {
      localStorage.setItem("theme", "light");
      themeToggle.innerHTML = lightsOffLabel;
      themeToggle.title = lightsOffTitle;
      document.body.classList.remove("dark");
   }
}

document.addEventListener("DOMContentLoaded", () => {
   window.themeToggle = document.querySelector("#theme-toggle");
   const theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches && "dark") ||
      "light";
   if (theme === "light") {
      themeToggle.innerHTML = lightsOffLabel;
      themeToggle.title = lightsOffTitle;
   } else {
      themeToggle.innerHTML = lightsOnLabel;
      themeToggle.title = lightsOnTitle;
      document.body.classList.add("dark");
   }
   themeToggle.style.display = "revert";
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
   if (localStorage.getItem("theme")) {
      return;
   }
   if (e.matches) {
      themeToggle.innerHTML = lightsOnLabel;
      themeToggle.title = lightsOnTitle;
      document.body.classList.add("dark");
   } else {
      themeToggle.innerHTML = lightsOffLabel;
      themeToggle.title = lightsOffTitle;
      document.body.classList.remove("dark");
   }
});

window.addEventListener("storage", (e) => {
   if (e.key !== "theme") {
      return;
   }
   if (e.newValue === "dark") {
      themeToggle.innerHTML = lightsOnLabel;
      themeToggle.title = lightsOnTitle;
      document.body.classList.add("dark");
   } else if (e.newValue === "light") {
      themeToggle.innerHTML = lightsOffLabel;
      themeToggle.title = lightsOffTitle;
      document.body.classList.remove("dark");
   }
});
