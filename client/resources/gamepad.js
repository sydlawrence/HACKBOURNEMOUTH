var buttonDivs = {
  a: document.getElementById("xBoxAButton"),
  b: document.getElementById("xBoxBButton"),
  x: document.getElementById("xBoxXButton"),
  y: document.getElementById("xBoxYButton")
  // xBoxDpadUp = document.getElementById("xBoxDpadUp"),
  // xBoxDpadDown = document.getElementById("xBoxDpadDown"),
  // xBoxDpadLeft = document.getElementById("xBoxDpadLeft"),
  // xBoxDpadRight = document.getElementById("xBoxDpadRight")
}

 // Controller change stuff
 controllerDisconnected = document.getElementById("controllerDisconnected"),
 controllerXbox = document.getElementById("xboxController"),

 // RAF and Chrome stuff
 requestAnimFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame,
 isChrome = navigator.webkitGamepads !== undefined;


updateController();

// Generic controller update check
function updateController() {

 // Clear button pressed styles
  buttonsDom = document.getElementsByClassName("button");
  for (int j = 0; j < buttonsDom.length; j++) {
    buttonsDom[j].classList.remove("pressed");
 }

 // Clear stick pressed styles
 sticksDom = document.getElementsByClassName("stick");
 for (int j = 0; j < sticksDom.length; j++) {
   sticksDom[j].classList.remove("pressed");
 }

 // Buttons
 for (var buttonName in controller.state) {
   var button = controller.state[buttonName];
   var buttonType = layout[buttonName].type;
  
   if (buttonType == 'button') {
     buttonDivs[buttonName].classList.add('pressed');
   } else if (buttonType == 'dpad') {
     
   } else if (buttonType == 'joy') {
     xBoxLeftStick.getElementsByTagName("span")[0].style.left = (button.x*20).toString()+"px";
     xBoxLeftStick.getElementsByTagName("span")[0].style.top = (button.y*20).toString()+"px";
   }
 }


  // Next controller check
  requestAnimFrame(updateController);
}
