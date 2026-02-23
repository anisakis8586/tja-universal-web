const headerTexts = ["TJA Universal", "karameru", "ryo"]; // 協力してくれる人はここに名前を追加して

// 画像のやつ
const slidesData = [
    { id: 1, desc: "1枚目の画像の説明" },
    { id: 2, desc: "2枚目の画像の説明" },
    { id: 3, desc: "3枚目の画像の説明" },
    // { id: 4, desc: "..." } 追加可能
];

const TOTAL_SETS = 5; 

// DOM取得
const headerEl   = document.getElementById("header-anim");
const wrapper    = document.getElementById("slider-wrapper");
const container  = document.getElementById("slider-container");
const descText   = document.getElementById("description-text");
const dotsWrapper = document.getElementById("slider-dots");
const nextBtn    = document.getElementById("nextBtn");
const prevBtn    = document.getElementById("prevBtn");

// CSS変数取得
const gap = parseInt(
    getComputedStyle(document.documentElement)
        .getPropertyValue("--ss-gap") || 40
);

// ヘッダーのアニメーション
let headerIdx = 0;

function playHeader() {
    headerEl.innerHTML = "";

    const isMain = headerIdx === 0;
    const name = headerTexts[headerIdx];
    const prefix = isMain ? "" : "Dev: ";
    const fullText = prefix + name;

    [...fullText].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.className = "char";
        span.style.animationDelay = `${i * 0.05}s`;
        if (!isMain && i < prefix.length) span.classList.add("dev-prefix");
        headerEl.appendChild(span);
    });

    headerIdx = (headerIdx + 1) % headerTexts.length;
}

setInterval(playHeader, 3000);
playHeader();

// スライド生成
function createSlides() {
    for (let i = 0; i < TOTAL_SETS; i++) {
        slidesData.forEach(slide => {
            const div = document.createElement("div");
            div.className = "ss-item";
            div.dataset.desc = slide.desc;

            const imgSrc = `assets/ss-${slide.id}.png`;
            div.innerHTML = `
                <img src="${imgSrc}" onerror="this.style.opacity='0';">
                SS-${slide.id}
            `;
            wrapper.appendChild(div);
        });
    }
}
createSlides();

const items = [...document.querySelectorAll(".ss-item")];

// ドット生成
slidesData.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.dataset.index = index;
    dotsWrapper.appendChild(btn);
});

const dots = [...document.querySelectorAll(".slider-dots button")];

// サイズ関連
function getSlideWidth() {
    return items[0].offsetWidth + gap;
}

function getSingleSetWidth() {
    return getSlideWidth() * slidesData.length;
}

// アクティブ判定
function updateActive() {
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;

    let closest = null;
    let minDiff = Infinity;

    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const diff = Math.abs(centerX - itemCenter);
        item.classList.remove("active");

        if (diff < minDiff) {
            minDiff = diff;
            closest = item;
        }
    });

    if (closest) {
        closest.classList.add("active");
        descText.textContent = closest.dataset.desc;

        const realIndex = items.indexOf(closest) % slidesData.length;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[realIndex]?.classList.add("active");
    }
}

// ループ制御
function jumpTo(position) {
    container.style.scrollBehavior = "auto";
    container.scrollLeft = position;
    requestAnimationFrame(() => {
        container.style.scrollBehavior = "smooth";
    });
}

function handleInfiniteLoop() {
    const x = container.scrollLeft;
    const singleSetWidth = getSingleSetWidth();

    if (x < singleSetWidth * 1.5) {
        jumpTo(x + singleSetWidth);
    } 
    else if (x > singleSetWidth * 2.5) {
        jumpTo(x - singleSetWidth);
    }
}

container.addEventListener("scroll", () => {
    handleInfiniteLoop();
    updateActive();
}, { passive: true });

// ボタン操作
nextBtn.onclick = () => { container.scrollLeft += getSlideWidth(); };
prevBtn.onclick = () => { container.scrollLeft -= getSlideWidth(); };

// ドット操作
dots.forEach(dot => {
    dot.onclick = () => {
        const index = parseInt(dot.dataset.index);
        const targetIndex = slidesData.length * 2 + index;
        const targetItem = items[targetIndex];

        const itemCenter = targetItem.offsetLeft + targetItem.offsetWidth / 2;
        const containerCenter = container.offsetWidth / 2;
        container.scrollLeft = itemCenter - containerCenter;
    };
});

// 初期配置
function initPosition() {
    const targetIndex = slidesData.length * 2;
    const targetItem = items[targetIndex];
    if (!targetItem) return;

    requestAnimationFrame(() => {
        const itemCenter = targetItem.offsetLeft + targetItem.offsetWidth / 2;
        const containerCenter = container.offsetWidth / 2;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = itemCenter - containerCenter;
        updateActive();

        setTimeout(() => { container.style.scrollBehavior = "smooth"; }, 50);
    });
}

window.addEventListener("load", initPosition);

// フッターの西暦自動取得
const currentYear = new Date().getFullYear();
const copyrightEl = document.getElementById("copyright");
if (copyrightEl) {
    copyrightEl.textContent = `© ${currentYear} TJA-Universal All rights reserved.`;
}