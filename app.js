let remaining = 300;
let running = false;
let timerId = null;
let uiTimer = null;
let mode = "timer"; // "timer" | "clock"


const timeEl = document.getElementById("time");
const uiEl = document.getElementById("ui");

let clockInterval = null;

function updateClockDisplay() {
  clearInterval(clockInterval);

  function tickTimer() {
  if (!running) return;

  remainingSeconds--;
  if (remainingSeconds <= 0) {
    remainingSeconds = 0;
    running = false;
    updateTheme();
  }

  if (mode === "timer") {
    updateTimerDisplay();
  }
}
  
  function tick() {
    if (mode !== "clock") return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    timerEl.textContent = `${h}:${m}:${s}`;
  }

  tick();
  clockInterval = setInterval(tick, 1000);
}
function startClockDisplay() {
  clearInterval(clockInterval);

  function tick() {
    if (mode !== "clock") return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    timerEl.textContent = `${h}:${m}:${s}`;
  }

  tick();
  clockInterval = setInterval(tick, 1000);
}

function format(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}
function updateTheme() {
  document.documentElement.classList.toggle("running", running);
  document.body.classList.toggle("running", running);

  document.documentElement.classList.toggle("idle", !running);
  document.body.classList.toggle("idle", !running);
}running);
}
function tickTimer() {
  if (!running) return;

  remainingSeconds--;

  if (remainingSeconds <= 0) {
    remainingSeconds = 0;
    running = false;
    onTimerFinished();
  }

  if (mode === "timer") {
    updateTimerDisplay();
  }
}
function render() {
  timeEl.textContent = format(remaining);
  fitText();
}

function start() {
  if (running) return;
  running = true;
  
  updateTheme()
  setState("running");
  hideUI();

  timerId = setInterval(() => {
    if (remaining > 0) {
      remaining--;
      render();
    } else {
      finish();
    }
  }, 1000);
}

function stop() {
  running = false;
  clearInterval(timerId);
  setState("idle");
  
  updateTheme();

}

function finish() {
  running = false;
  clearInterval(timerId);
  setState("finished");
}

function addMinute() {
  remaining += 600;
  render();
}
function addMinute2() {
  remaining += 60;
  render();
}

/* UI表示制御 */
function showUI() {
  uiEl.classList.remove("hidden");
  clearTimeout(uiTimer);
  uiTimer = setTimeout(hideUI, 3000);
}

function hideUI() {
  uiEl.classList.add("hidden");
}

/* フォント自動フィット */
function fitText() {
  const maxWidth = timeEl.parentElement.clientWidth;
  let size = window.innerWidth * 0.4;
  timeEl.style.fontSize = size + "px";

  while (timeEl.scrollWidth > maxWidth && size > 10) {
    size -= 2;
    timeEl.style.fontSize = size + "px";
  }
}

function setState(state) {
  document.documentElement.className = state;
  document.body.className = state;
}


/* カスタムフォント対応 */
document.getElementById("fontFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fontName = "UserFont_" + Date.now();
  const font = new FontFace(fontName, await file.arrayBuffer());
  await font.load();

  document.fonts.add(font);

  // ★ デフォルトを上書き
  document.documentElement.style.setProperty("--timer-font", fontName);

  fitText();
});

function toggleStartStop() {
  running ? stop() : start();
}
document.addEventListener("keydown", (e) => {
  // 入力中は無効（重要）
  if (e.target.tagName === "INPUT") return;

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;
  e.preventDefault();
  toggleStartStop();
});
controls.style.display = "flex";
function reset() {
  remaining = 0;
  render();
  setState("idle");
}
function refreshDisplay() {
  if (mode === "clock") {
    updateClockDisplay();
  } else {
    updateTimerDisplay();
  }
}

const timerEl = document.getElementById("timer");const timerEl = document.getElementById("timer");
const modeBtn = document.getElementById("modeToggle");
const controls = document.querySelector(".controls"); // UI一式

modeBtn.addEventListener("click", toggleMode);

function toggleMode() {
  if (mode === "timer") {
    switchToClock();
  } else {
    switchToTimer();
  }
}

function switchToClock() {
  mode = "clock";
  modeBtn.textContent = "Timer";
  refreshDisplay();
}

function switchToTimer() {
  mode = "timer";
  modeBtn.textContent = "Clock";
  refreshDisplay();
}

function toggleMode() {
  if (mode === "timer") {
    switchToClock();
  } else {
    switchToTimer();
  }
}
/* イベント */
document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("add").onclick = addMinute;
document.getElementById("add2").onclick = addMinute2;
document.getElementById("reset").onclick = reset;


document.addEventListener("pointerdown", showUI);
window.addEventListener("resize", fitText);

setState("idle");
render();




