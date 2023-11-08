const comments = [
   [
      "Registered just to thank you for making this addon.  No more hand pain due to " +
         "holding that right mouse button down all the time.  I really like the " +
         "override bindings feature.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=14",
      "_ForgeUser17641536",
   ],
   [
      "This addon rocks!  Mouselook is so much more comfortable than holding right " +
         "click.  Thank you!",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=17",
      "BellewTheBear",
   ],
   [
      "This is a great addon, thanks!",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=23",
      "_ForgeUser6524262",
   ],
   [
      'Amazing addon, I can\'t play without it.  The "hold ALT" lua worked wonders too.',
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=26",
      "TheDeadEd",
   ],
   [
      "Man, you are my hero!",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=36",
      "_ForgeUser617969",
   ],
   [
      "Brilliant addon!",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=54",
      "ughmeh",
   ],
   [
      "I have used your add-on (which is amazing) to create a very intuitive Steam " +
         "Controller WoW setup.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=57",
      "Jimfro",
   ],
   [
      "<b>this addon is really good.  thank you for your hard work!  I hope I can see " +
         "this add on again in Legion this year.. I can't play wow without this " +
         "addon</b>",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=58",
      "_ForgeUser23105614",
   ],
   [
      "Me love you long time!",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=64",
      "KonungrJoe",
   ],
   [
      "First off, thanks for a truly great mod and for the quick updates.  I've lost " +
         "some use in one of my hands due to injury, and this mod has been immensely " +
         "helpful in aiding me to get back into this game again.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=66",
      "DoctorLeeches",
   ],
   [
      "had to recover my password for this... :D<br>" +
         "anyway, this is literally <u>the best addon for wow ever</u>... i love it, " +
         "works like a charm... takes little getting used to... and also to anyone, " +
         "make sure you keybind toggle so you can easy unlock you camera to click " +
         "things... thank you very much for making this...!!!",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=76",
      "_ForgeUser12461638",
   ],
   [
      "This addon is simply awesome, allows for a much more enjoyable play style.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=77",
      "_ForgeUser12168535",
   ],
   [
      "Great mod!  I've been looking for something like this forever.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=85",
      "_ForgeUser27970387",
   ],
   [
      "This is freaking awesome.  The big feature that I wanted from GW2.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=87",
      "_ForgeUser3251137",
   ],
   [
      "Dude this addon is slicker than a greased up pig in a field of eels.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=108",
      "unklben",
   ],
   [
      "TY very much for the great addon",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=109",
      "sencdestan",
   ],
   [
      "STILL WORKING IN BFA!  Thanks So Much!  WAAOO heewee go Xbox One Controller! xD",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=110",
      "ARCORIAN1",
   ],
   [
      "I'd have to quit playing WoW without this addon because it saves my hand from " +
         "cramping up.",
      "https://www.curseforge.com/wow/addons/mouselookhandler?comment=119",
      "Parsley_us",
   ],
];

function changeComment() {
   const [comment, url, author] = comments[Math.floor(Math.random() * comments.length)];
   document.querySelector("blockquote").innerHTML =
      comment + `<br>—<a href="${url}">${author}</a>`;
   setTimeout(changeComment, Math.max(5000, 75 * comment.length));
}

changeComment();
