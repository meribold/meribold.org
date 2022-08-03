const [space, note] = [document.createElement("span"), document.createElement("span")];
const somePunctuation = new Set(",;.");
let hiddenSup;

space.innerText = " ";
note.classList.add("inline-note");
note.addEventListener("click", (e) => {
   e.stopPropagation();
});

document.querySelectorAll("a.footnote").forEach((fnref, _) => {
   let footnoteContent = document.getElementById(fnref.getAttribute("href").slice(1))
      .children[0].innerHTML;
   footnoteContent = footnoteContent.slice(0, footnoteContent.lastIndexOf("&nbsp;"));
   fnref.removeAttribute("href");
   fnref.setAttribute("role", "button");
   fnref.setAttribute("tabindex", "0");
   fnref.addEventListener("click", (e) => {
      const sup = fnref.parentElement;
      const precedingNode = sup.previousSibling;
      const precedingText = precedingNode.textContent;
      const precedingChar = precedingText.slice(-1);

      sup.insertAdjacentElement("beforebegin", space);
      sup.insertAdjacentElement("beforebegin", note);

      if (somePunctuation.has(precedingChar)) {
         if (precedingChar != "." || footnoteContent.slice(-1) != ".") {
            precedingNode.textContent = precedingText.slice(0, -1);
            sup.insertAdjacentText("beforebegin", precedingChar);
         }
      }

      if (hiddenSup !== undefined) hiddenSup.style.display = "initial";
      sup.style.display = "none";
      hiddenSup = sup;
      note.innerHTML = "(" + footnoteContent + ")";
      space.style.display = note.style.display = "initial";
      e.stopPropagation();
   });
   fnref.addEventListener("keydown", (e) => {
      if (e.key == " ") e.preventDefault();
      if (e.key == "Enter") e.target.click();
   });
   fnref.addEventListener("keyup", (e) => {
      if (e.key == " ") e.target.click();
   });
   fnref.innerText = "*";
});

document.addEventListener("click", () => {
   space.style.display = note.style.display = "none";
   if (hiddenSup !== undefined) {
      hiddenSup.style.display = "initial";
      hiddenSup = undefined;
   }
});
