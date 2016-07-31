$(document).ready(function() {
  /* global variables */
  var clockFace = document.getElementById("clock_face"),
    clockBack = document.getElementById("clock_back"),
    showClockTime = document.getElementById("clock_time"),
    clockSession = document.getElementById("clock_session"),
    clockStart = document.getElementById("clock_start"),
    showBreakLength = document.getElementById("break_length"),
    showSessionLength = document.getElementById("session_length"),
    countingDown = false,
    breakMinus = document.getElementById("break_minus"),
    breakPlus = document.getElementById("break_plus"),
    sessionMinus = document.getElementById("session_minus"),
    sessionPlus = document.getElementById("session_plus"),
    breakTime = Number(showBreakLength.innerHTML),
    sessionTime = Number(showSessionLength.innerHTML),
    counter,
    sec = minsToSecs(sessionTime),
    totalTime = sec,
    onBreak = false,
    ding = new Audio("/sounds/91926__corsica-s__ding.wav"),
    fillSize = 300,
    resetButton = document.getElementById("reset");
  /* /global variables */

  /* functions */
  function minsToSecs(m){
    // convert minutes to seconds
    var inSeconds =  m * 60;
    return inSeconds;
  }

  function secsToTime(s){
    // convert seconds to MM:SS
    var mins = Math.floor(s / 60);
    var secsRemaining = s % 60;
    if (secsRemaining < 10) {
      return mins + ":0" + secsRemaining;
    } else {
      return mins + ":" + secsRemaining;
    }
  }

  function displayTime(s) {
    clockStart.style.visibility="hidden";
    showClockTime.innerHTML = secsToTime(s);
    if (onBreak) {
      clockSession.innerHTML = "BREAK";
      clockFace.style.backgroundColor = "#008A9F";
      clockFace.style.borderColor="#008A9F";
    }
    else {
      clockSession.innerHTML = "SESSION";
      clockFace.style.backgroundColor="#66BA12";
      clockFace.style.borderColor="#66BA12";
    }
  }

  function initialiseClock() {
    showClockTime.innerHTML = sessionTime;
  }

  function resetClock(bool) {
    clockStart.style.visibility="visible";
    clockStart.innerHTML="click to start";
    if (bool) {
      if (onBreak) {
        showClockTime.innerHTML = breakTime
        clockBack.style.marginTop="300px";
        } else {
        showClockTime.innerHTML = sessionTime;
        clockBack.style.marginTop="300px";
      }
    }
    else if (!bool){
      clearInterval(counter);
      countingDown = false;
      onBreak = false;
      sec = minsToSecs(sessionTime);
      totalTime = sec;
      showClockTime.innerHTML = sessionTime;
      clockBack.style.marginTop="300px";
      clockSession.innerHTML = "SESSION";
      clockFace.style.backgroundColor="#66BA12";
      clockFace.style.borderColor="#66BA12";
    }
  }

  function controlTimer() {
    if (countingDown) {
      //stop countdown
      countingDown = false;
      stopTimer();
      return;
    }
    else {
      //start countdown
      startTimer();
    }
  }

  function startTimer() {
    counter = setInterval(countDown, 1000);
    countingDown = true;
  }

  function stopTimer() {
    clearInterval(counter);
    countingDown = false;
    if (sec > 0) {
      clockStart.innerHTML="paused";
    }
    clockStart.style.visibility="visible";
  }

  function countDown() {
    sec--;
    displayTime(sec);
    clockFill(sec,totalTime);
    if (sec === 0 && !onBreak) {
      ding.play();
      sec = minsToSecs(breakTime);
      totalTime = minsToSecs(breakTime);
      onBreak = true;
      } else if (sec === 0) {
      ding.play();
      sec = minsToSecs(sessionTime);
      totalTime = minsToSecs(sessionTime);
      onBreak = false;
    }
  } /* /countDown */

  /* time adjusters */
  function adjustTime(brk, inc){
    if (countingDown){
      return;
    } else {
      if (brk) {
        if(inc) { /* increase break */
          breakTime++;
          showBreakLength.innerHTML = breakTime;
          if (onBreak) {
            sec = minsToSecs(breakTime);
            totalTime = minsToSecs(breakTime);
            resetClock(true);
          }
        } else /*decrease break*/ {
          if (breakTime > 1) {
            breakTime--;
            showBreakLength.innerHTML = breakTime;
            if (onBreak) {
              sec = minsToSecs(breakTime);
              totalTime = minsToSecs(breakTime);
              resetClock(true);
            }
          } else {
            return;
          }
        }
      } else /*increase session*/ {
        if(inc) {
          sessionTime++;
          showSessionLength.innerHTML = sessionTime;
          if (!onBreak) {
            sec = minsToSecs(sessionTime);
            totalTime = minsToSecs(sessionTime);
            resetClock(true);
          }
        } else /*decrease session*/ {
          if (sessionTime > 1) {
            sessionTime--;
            showSessionLength.innerHTML = sessionTime;
            if (!onBreak) {
              sec = minsToSecs(sessionTime);
              totalTime = minsToSecs(sessionTime);
              resetClock(true);
            }
          }
        }
      }
    }
  }
  /* /time adjusters */
  /*clock fill */
  function clockFill(s,t){
    if(s === 0) {
      fillSize = 0;
    } else {
      fillSize = Math.ceil((s+1)/t*300);
    }
    clockBack.style.marginTop=fillSize + "px";
  }
  /* /clock fill */
  /* /functions */ //

  initialiseClock();

  clockFace.addEventListener("click", controlTimer);
  breakPlus.addEventListener("click",function() {
    adjustTime(true,true);
  });
  breakMinus.addEventListener("click",function() {
    adjustTime(true,false);
  });
  sessionPlus.addEventListener("click",function() {
    adjustTime(false,true);
  });
  sessionMinus.addEventListener("click",function() {
    adjustTime(false,false);
  });
  resetButton.addEventListener("click",function() {
    resetClock(false);
  });

}); // /docready()
