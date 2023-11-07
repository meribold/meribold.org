addEventListener("keydown", (e) => {
   if (e.isComposing) return;
   if (e.key === "j") scrollBy({ top: 53 });
   if (e.key === "k") scrollBy({ top: -53 });
   if (e.key === "G") scroll({ top: document.body.scrollHeight - 1.35 * innerHeight + 4 });
   if (e.key === "g") scroll({ top: 0 });
});
