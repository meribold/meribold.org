addEventListener("keydown", (e) => {
   if (e.isComposing) return;
   if (e.key === "j") scrollBy({ top: 53 });
   if (e.key === "k") scrollBy({ top: -53 });
   if (e.key === "d") scrollBy({ top: innerHeight / 2 });
   if (e.key === "u") scrollBy({ top: -innerHeight / 2 });
   if (e.key === "G") scroll({ top: document.body.scrollHeight - 1.35 * innerHeight + 4 });
   if (e.key === "g") scroll({ top: 0 });
   if (e.key === "t" || e.key === "i") themeToggle.click();
});
