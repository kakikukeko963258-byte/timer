let remaining = 300;
let running = false;
let timerId = null;
let uiTimer = null;

// ★追加：表示モード
let mode = "timer"; // "timer" | "clock"
let clockTimer = null;

const timeEl = document.getElementById("time");
const uiEl = document.getElementById("ui");
const modeBtn = document.getElementById("modeToggle"); // ★追加

/* -------------------- 共通 -------------------- */

function format(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function render() {
  if (mode === "timer") {
    timeEl.textContent = format(remaining);
  }
  fitText();
}

/* -------------------- Timer -------------------- */

function start() {
  if (running) return;
  running = true;

  setState("running");
  hideUI();

  if (!timerId) {
    timerId = setInterval(() => {
      if (!running) return;

      if (remaining > 0) {
        remaining--;
        if (mode === "timer") render();
      } else {
        finish();
      }
    }, 1000);
  }
}

function stop() {
  running = false;
  setState("idle");
}

function finish() {
  running = false;
  clearInterval(timerId);
  timerId = null;
  setState("finished");
}

function toggleStartStop() {
  running ? stop() : start();
}

function animateSwitch(updateFn) {
  timeEl.classList.add("switch-out");

  setTimeout(() => {
    updateFn();      // 表示内容を切り替える
    fitText();

    timeEl.classList.remove("switch-out");
    timeEl.classList.add("switch-in");
  }, 200);
}

/* -------------------- Clock -------------------- */

function startClock() {
  clearInterval(clockTimer);

  function tick() {
    if (mode !== "clock") return;

    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    timeEl.textContent = `${h}:${m}:${s}`;
    fitText();
  }

  tick();
  clockTimer = setInterval(tick, 1000);
}

/* -------------------- Mode 切り替え -------------------- */

function toggleMode() {
  animateSwitch(() => {
    if (mode === "timer") {
      mode = "clock";
      modeBtn.textContent = "Timer";
      startClock();
    } else {
      mode = "timer";
      modeBtn.textContent = "Clock";
      render();
    }
  });
}

modeBtn.onclick = toggleMode;

/* -------------------- UI操作 -------------------- */

function addMinute() {
  remaining += 600;
  if (mode === "timer") render();
}

function addMinute2() {
  remaining += 60;
  if (mode === "timer") render();
}

function reset() {
  remaining = 0;
  render();
  setState("idle");
}

/* -------------------- UI表示制御 -------------------- */

function showUI() {
  uiEl.classList.remove("hidden");
  clearTimeout(uiTimer);
  uiTimer = setTimeout(hideUI, 3000);
}

function hideUI() {
  uiEl.classList.add("hidden");
}

/* -------------------- フォント自動フィット -------------------- */

function fitText() {
  const maxWidth = timeEl.parentElement.clientWidth;
  let size = window.innerWidth * 0.4;
  timeEl.style.fontSize = size + "px";

  while (timeEl.scrollWidth > maxWidth && size > 10) {
    size -= 2;
    timeEl.style.fontSize = size + "px";
  }
}

/* -------------------- 状態（色） -------------------- */

function setState(state) {
  document.body.classList.remove("idle", "running", "finished");
  document.body.classList.add(state);
}

/* -------------------- カスタムフォント -------------------- */

document.getElementById("fontFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const fontName = "UserFont_" + Date.now();
  const font = new FontFace(fontName, await file.arrayBuffer());
  await font.load();

  document.fonts.add(font);
  document.documentElement.style.setProperty("--timer-font", fontName);

  fitText();
});

/* -------------------- キー操作 -------------------- */

document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;

  if (e.code === "Space") {
    e.preventDefault();
    toggleStartStop(); // ★ Clock中でも色が変わる
  }
});

/* -------------------- イベント -------------------- */

document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("add").onclick = addMinute;
document.getElementById("add2").onclick = addMinute2;
document.getElementById("reset").onclick = reset;

document.addEventListener("pointerdown", showUI);
window.addEventListener("resize", fitText);

/* -------------------- 初期化 -------------------- */

setState("idle");
render();
