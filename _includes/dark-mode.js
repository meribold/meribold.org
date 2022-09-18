const followUaThemeLabel = "明";
const lightThemeLabel = "日";
const darkThemeLabel = "月";

let uaThemePreference = window.matchMedia("(prefers-color-scheme: dark)").matches
   ? "dark"
   : "light";

let followingUaThemePreference = localStorage.getItem("theme") === null;

function updateThemeToggle(currentTheme) {
   if (followingUaThemePreference || currentTheme !== uaThemePreference) {
      const otherTheme = currentTheme === "light" ? "dark" : "light";
      themeToggle.title = `Click to use the ${otherTheme} theme`;
   } else {
      themeToggle.title = "Click to follow your system color scheme preference";
   }
   themeToggle.innerHTML = followingUaThemePreference
      ? followUaThemeLabel
      : currentTheme === "light"
      ? lightThemeLabel
      : darkThemeLabel;
}

function enableTheme(theme) {
   if (theme === "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
   } else if (theme === "dark") {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
   }
   updateThemeToggle(theme);
}

function changeTheme() {
   const currentTheme = followingUaThemePreference
      ? uaThemePreference
      : themeToggle.innerHTML === lightThemeLabel
      ? "light"
      : "dark";
   if (currentTheme === uaThemePreference) {
      const otherTheme = currentTheme === "light" ? "dark" : "light";
      if (followingUaThemePreference) {
         // Stop following the user agent theme preference and change the theme.
         localStorage.setItem("theme", otherTheme);
         followingUaThemePreference = false;
         enableTheme(otherTheme);
      } else {
         // Start following the user agent theme preference but don't change the theme.
         localStorage.removeItem("theme");
         followingUaThemePreference = true;
         updateThemeToggle(currentTheme);
      }
   } else {
      // Keep not following the user agent theme preference and change the theme.
      localStorage.setItem("theme", uaThemePreference);
      enableTheme(uaThemePreference);
   }
}

const initialTheme =
   localStorage.getItem("theme") ||
   (window.matchMedia("(prefers-color-scheme: dark)").matches && "dark") ||
   "light";
if (initialTheme === "dark") {
   document.body.classList.remove("light");
   document.body.classList.add("dark");
}

function initThemeToggle() {
   window.themeToggle = document.querySelector("#theme-toggle");
   if (initialTheme === "dark" || !followingUaThemePreference) {
      updateThemeToggle(initialTheme);
   }
   themeToggle.style.visibility = "visible";
   themeToggle.addEventListener("click", (e) => {
      changeTheme();
      e.stopPropagation();
   });
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
   uaThemePreference = e.matches ? "dark" : "light";
   if (followingUaThemePreference) {
      enableTheme(uaThemePreference);
   }
});

window.addEventListener("storage", (e) => {
   if (e.key !== "theme") {
      return;
   }
   if (e.newValue === null) {
      followingUaThemePreference = true;
      updateThemeToggle(uaThemePreference);
   } else {
      followingUaThemePreference = false;
      enableTheme(e.newValue);
   }
});
