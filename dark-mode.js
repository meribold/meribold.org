const lightsOffLabel = "月";
const lightsOnLabel = "日";
const lightsOffTitle = "Enable dark mode";
const lightsOnTitle = "Enable light mode";

function toggleDarkMode() {
   if (themeToggle.innerHTML === lightsOffLabel) {
      document.cookie = "theme=dark; SameSite=Lax; path=/; Max-Age=2147483647";
      themeToggle.innerHTML = lightsOnLabel;
      themeToggle.title = lightsOnTitle;
      document.body.classList.add("dark");
   } else {
      document.cookie = "theme=light; SameSite=Lax; path=/; Max-Age=2147483647;";
      themeToggle.innerHTML = lightsOffLabel;
      themeToggle.title = lightsOffTitle;
      document.body.classList.remove("dark");
   }
}

document.addEventListener("DOMContentLoaded", () => {
   window.themeToggle = document.querySelector("#theme-toggle");
   const theme =
      document.cookie
         .split("; ")
         .find((row) => row.startsWith("theme="))
         ?.split("=")[1] ?? "light";
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
