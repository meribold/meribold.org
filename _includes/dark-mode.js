const followUaThemeLabel = "明";
const lightThemeLabel = "日";
const darkThemeLabel = "月";

let uaThemePreference = getUaThemePreference();
let followingUaThemePreference = localStorage.getItem("theme") === null;
let themeToggle;

function getUaThemePreference() {
   return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

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

function getCurrentTheme() {
   return {
      [followUaThemeLabel]: uaThemePreference,
      [lightThemeLabel]: "light",
      [darkThemeLabel]: "dark",
   }[themeToggle.innerHTML];
}

function changeTheme() {
   const currentTheme = getCurrentTheme();
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

const initialTheme = localStorage.getItem("theme") || getUaThemePreference();
if (initialTheme === "dark") {
   document.body.classList.remove("light");
   document.body.classList.add("dark");
}

function initThemeToggle() {
   themeToggle = document.querySelector("#theme-toggle");
   if (initialTheme === "dark" || !followingUaThemePreference) {
      updateThemeToggle(initialTheme);
   }
   themeToggle.style.visibility = "visible";
   themeToggle.addEventListener("click", (e) => {
      changeTheme();
      e.stopPropagation();
   });
}

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
   uaThemePreference = e.matches ? "dark" : "light";
   if (followingUaThemePreference) {
      enableTheme(uaThemePreference);
   }
});

addEventListener("storage", (e) => {
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

// Among other things, a return to the page via history navigation triggers this event.
// Check whether the desired theme has changed and switch the theme if necessary.
addEventListener("pageshow", (e) => {
   uaThemePreference = getUaThemePreference();
   const currentTheme = getCurrentTheme();
   const desiredTheme = localStorage.getItem("theme") || uaThemePreference;
   const actuallyFollowingUaThemePreference = localStorage.getItem("theme") === null;
   if (currentTheme !== desiredTheme) {
      followingUaThemePreference = actuallyFollowingUaThemePreference;
      enableTheme(desiredTheme);
   } else if (followingUaThemePreference !== actuallyFollowingUaThemePreference) {
      followingUaThemePreference = actuallyFollowingUaThemePreference;
      updateThemeToggle(currentTheme);
   }
});
