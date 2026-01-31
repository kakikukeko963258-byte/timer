/* =========================
   状態
========================= */
let mode = "timer"; // "timer" or "clock"
let timeFormat = "decimal"; // "decimal" or "normal"

let remainingMs = 300000; // タイマー初期値（5分）
let running = false;

let rafId = null;
let lastTime = 0;
let uiTimer = null;

const timeEl = document.getElementById("time");
const uiEl = document.getElementById("ui");
const modeBtn = document.getElementById("mode");
const formatBtn = document.getElementById("format");

/* =========================
   フォーマット
========================= */
function formatTimer(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const sec = String(totalSec % 60).padStart(2, "0");
  const cs  = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  
  if (timeFormat === "decimal") {
    // 小数点表示: MM:SS.CS
    return `${min}:${sec}.${cs}`;
  } else {
    // 通常表示: MM:SS
    return `${min}:${sec}`;
  }
}

function formatClock(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* =========================
   描画
========================= */
function renderTimer() {
  const text = formatTimer(remainingMs);
  timeEl.innerHTML = "";

  for (const ch of text) {
    if (ch === ":" || ch === ".") {
      const span = document.createElement("span");
      span.className = "time-sep";
      span.textContent = ch;
      timeEl.appendChild(span);
    } else {
      timeEl.append(ch);
    }
  }

  fitText();
}

function renderClock() {
  const text = formatClock(new Date());
  timeEl.innerHTML = "";

  for (const ch of text) {
    if (ch === ":") {
      const span = document.createElement("span");
      span.className = "time-sep";
      span.textContent = ch;
      timeEl.appendChild(span);
    } else {
      timeEl.append(ch);
    }
  }

  fitText();
}

/* =========================
   メインループ
========================= */
function loop(now) {
  // タイマーが running なら常に動作（背景でカウント）
  if (running) {a
    const delta = now - lastTime;
    lastTime = now;

    remainingMs -= delta;
    if (remainingMs <= 0) {
      remainingMs = 0;
      running = false;
      setState("finished");
    }
  }

  // 表示モードに応じて描画
  if (mode === "timer") {
    renderTimer();
  } else if (mode === "clock") {
    renderClock();
  }

  rafId = requestAnimationFrame(loop);
}

/* =========================
   タイマー制御
========================= */
function start() { 
  running = true;
  lastTime = performance.now();
  setState("running");
  hideUI();
}

function stop() {
  running = false;
  setState("idle");
}

function reset() {
  if (mode !== "timer") return;
  remainingMs = 0;
  renderTimer();
  setState("idle");
}

function addMinute() {
  if (mode !== "timer") return;
  remainingMs += 60000;
  renderTimer();
}

function addSecond() {
  if (mode !== "timer") return;
  remainingMs += 1000;
  renderTimer();
}

/* =========================
   モード切り替え
========================= */
function toggleMode() {

  if (mode === "timer") {
    mode = "clock";
    modeBtn.textContent = "Timer";
    renderClock();
  } else {
    mode = "timer";
    modeBtn.textContent = "Clock";
    renderTimer();
  }
}

/* =========================
   表示形式切り替え
========================= */
function toggleFormat() {
  if (mode !== "timer") return;
  
  if (timeFormat === "decimal") {
    timeFormat = "normal";
    formatBtn.textContent = "小数点表示";
  } else {
    timeFormat = "decimal";
    formatBtn.textContent = "通常表示";
  }
  
  renderTimer();
}

/* =========================
   UI表示制御
========================= */
function showUI() {
  uiEl.classList.remove("hidden");
  clearTimeout(uiTimer);
  uiTimer = setTimeout(hideUI, 3000);
}

function hideUI() {
  uiEl.classList.add("hidden");
}

/* =========================
   フォント自動フィット
========================= */
function fitText() {
  const maxWidth = timeEl.parentElement.clientWidth;
  let size = window.innerWidth * 0.4;
  timeEl.style.fontSize = size + "px";

  while (timeEl.scrollWidth > maxWidth && size > 10) {
    size -= 2;
    timeEl.style.fontSize = size + "px";
  }
}

/* =========================
   状態スタイル
========================= */
function setState(state) {
  document.body.classList.remove("idle", "running", "finished");
  document.body.classList.add(state);
}

/* =========================
   カスタムフォント
========================= */
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

/* =========================
   キー操作
========================= */
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;

  if (e.code === "Space") {
    e.preventDefault();
    if (mode === "timer") {
      running ? stop() : start();
    }
  }
});

/* =========================
   イベント
========================= */
document.getElementById("start").onclick = start;
document.getElementById("stop").onclick = stop;
document.getElementById("add").onclick = addMinute;
document.getElementById("add2").onclick = addSecond;
document.getElementById("reset").onclick = reset;
modeBtn.onclick = toggleMode;
formatBtn.onclick = toggleFormat;

document.addEventListener("pointerdown", showUI);
window.addEventListener("resize", fitText);

/* =========================
   初期化
========================= */
setState("idle");
renderTimer();
rafId = requestAnimationFrame(loop); 
