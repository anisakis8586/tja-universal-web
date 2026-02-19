const texts = [
    "TJA UNiVERSAL",
    "karameru"
];

const charDelay = 0.07;
const animDuration = 3.2;

const el = document.getElementById("bottom");
let index = 0;

function playText() {
    el.innerHTML = "";
    const text = texts[index];

    el.style.setProperty("--duration", `${animDuration}s`);

    [...text].forEach((c, i) => {
        const span = document.createElement("span");
        span.textContent = c;
        span.className = "char";
        span.style.animationDelay = `${i * charDelay}s`;
        el.appendChild(span);
    });

    index = (index + 1) % texts.length;
}

/* 初回 */
playText();

/* アニメーション1周ごとに次へ */
setInterval(playText, animDuration * 1000);
