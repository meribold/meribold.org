const lightsOffLabel = "月";
const lightsOnLabel = "日";
const lightsOffTitle = "Enable dark mode";
const lightsOnTitle = "Enable light mode";

function enableDarkMode() {
   themeToggle.innerHTML = lightsOnLabel;
   themeToggle.title = lightsOnTitle;
   document.body.classList.add("dark");
}

function enableLightMode() {
   themeToggle.innerHTML = lightsOffLabel;
   themeToggle.title = lightsOffTitle;
   document.body.classList.remove("dark");
}

function toggleDarkMode() {
   if (themeToggle.innerHTML === lightsOffLabel) {
      localStorage.setItem("theme", "dark");
      enableDarkMode();
   } else {
      localStorage.setItem("theme", "light");
      enableLightMode();
   }
}

document.addEventListener("DOMContentLoaded", () => {
   window.themeToggle = document.querySelector("#theme-toggle");
   const theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches && "dark") ||
      "light";
   if (theme === "dark") {
      enableDarkMode();
   }
   themeToggle.style.display = "revert";
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
   if (localStorage.getItem("theme")) {
      return;
   }
   if (e.matches) {
      enableDarkMode();
   } else {
      enableLightMode();
   }
});

window.addEventListener("storage", (e) => {
   if (e.key !== "theme") {
      return;
   }
   if (e.newValue === "dark") {
      enableDarkMode();
   } else if (e.newValue === "light") {
      enableLightMode();
   }
});
