let remaining = 300;
let running = false;
let timerId = null;
let uiTimer = null;

const timeEl = document.getElementById("time");
const uiEl = document.getElementById("ui");

function format(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function render() {
  timeEl.textContent = format(remaining);
  fitText();
}

function start() {
  if (running) return;
  running = true;

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
  document.body.classList.remove("idle", "running", "finished");
  document.body.classList.add(state);
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
  if (running) {
    stop();
  } else {
    start();
  }
}
document.addEventListener("keydown", (e) => {
  // 入力中は無効（重要）
  if (e.target.tagName === "INPUT") return;

  if (e.code === "Space") {
    e.preventDefault(); // スクロール防止
    toggleStartStop();
  }
});

function reset() {
  remaining = 0;
  render();
  setState("idle");
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
