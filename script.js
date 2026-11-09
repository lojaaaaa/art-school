const programBlocks = [
    [
        "Развитие мелкой моторики, декор и узоры",
        "Тренировка руки, ритм линий, декоративное заполнение формы и усидчивость через узорно-орнаментальные задания.",
        "#7B4DFF",
    ],
    [
        "Основы композиции",
        "Композиционное равновесие, выбор формата, статика и динамика, умение выделять композиционный центр.",
        "#FF6FB1",
    ],
    [
        "Основы цветоведения и смешивания цветов",
        "Растяжка цвета, смешивание красок, тёплая и холодная гамма, цветовой контраст и влияние фона.",
        "#E8A064",
    ],
    [
        "Бумажная пластика и аппликация",
        "Объёмно-пространственное мышление, конструирование из бумаги, воздушная перспектива и глубина.",
        "#2BB88A",
    ],
    [
        "Ракурс и масштаб",
        "Точка зрения и масштаб объектов — взгляд «снизу» и «сверху», пространственное воображение.",
        "#FFB800",
    ],
    [
        "Нетрадиционные техники и эксперименты",
        "Кляксография, граттаж, монотипия, пуантилизм, штамповка: творческая смелость и эксперименты.",
        "#FF6FB1",
    ],
    [
        "Творческое воображение и фантазирование",
        "Придумывание образов, персонажей и целых миров; основы шрифта, иллюстрации и стилизации.",
        "#7B4DFF",
    ],
    [
        "Игры и коммуникация",
        "Командная работа, коллективное творчество и презентация через игровые и проектные форматы.",
        "#2BB88A",
    ],
    [
        "Культура и искусство народов мира",
        "Беларусь, Китай, Древняя Греция, первобытное искусство и их символика.",
        "#E8A064",
    ],
    [
        "Жанры изобразительного искусства",
        "Портрет, натюрморт, пейзаж, анималистика: пропорции, композиция и декоративная переработка.",
        "#1B1030",
    ],
];

function renderProgramCard([title, description], index) {
    const blockNumber = String(index + 1).padStart(2, "0");
    const slides = [1, 2, 3].map((photoNumber) => {
        const source = `./images/program/block-${blockNumber}-${photoNumber}.jpg`;
        return `<div class="sl"><img src="${source}" alt="${title} — фото ${photoNumber}" loading="lazy" draggable="false"></div>`;
    });


    return `<article class="bl rv">
        <div class="ph">
            <div class="tr">${slides.join("")}</div>
            <button class="pv" aria-label="Назад">‹</button>
            <button class="nx" aria-label="Далее">›</button>
            <i><b></b><b></b><b></b></i>
        </div>
        <h3>${title}</h3>
        <p>${description}</p>
    </article>`;
}


const programCards = programBlocks.map(renderProgramCard);

const programContainer = document.getElementById("blocks");

programContainer.innerHTML = [programCards.slice(0, 5), programCards.slice(5)]
    .map((row) => `<div class="brow">${row.join("")}</div>`)
    .join("");

programContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const ph = btn.closest(".ph");
    let n = ((+ph.dataset.i || 0) + (btn.classList.contains("nx") ? 1 : 2)) % 3;
    ph.dataset.i = n;
    ph.querySelector(".tr").style.transform = `translateX(-${n * 100}%)`;
    ph.querySelectorAll("i b").forEach(
        (x, k) => (x.style.background = k === n ? "#fff" : "rgba(255,255,255,.5)"),
    );
});

const revealObserver = new IntersectionObserver(
    (e) =>
        e.forEach((x) => {
            if (x.isIntersecting) {
                x.target.classList.add("in");
                revealObserver.unobserve(x.target);
            }
        }),
    { threshold: 0.12 },
);

document.querySelectorAll(".rv").forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 60 + "ms";
    revealObserver.observe(el);
});

document.querySelectorAll("p.sub:empty").forEach((p) => p.remove());

const prefersReducedMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;

const counterObserver = new IntersectionObserver(
    (e) =>
        e.forEach((x) => {
            if (!x.isIntersecting) return;
            counterObserver.unobserve(x.target);
            const el = x.target,
                to = +el.dataset.to,
                s = el.dataset.suf || "",
                t0 = performance.now();
            (function f(t) {
                const p = Math.min((t - t0) / 1600, 1);
                el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(f);
            })(t0);
        }),
    { threshold: 0.6 },
);

document.querySelectorAll("[data-to]").forEach((el) => {
    if (prefersReducedMotion) return;
    el.textContent = "0";
    counterObserver.observe(el);
});

const lb = document.createElement("div");
lb.className = "lb";
lb.setAttribute("role", "dialog");
lb.setAttribute("aria-modal", "true");
lb.innerHTML =
    '<div class="lbw"><button class="lbx" aria-label="Закрыть">×</button><button class="lbp" aria-label="Назад">‹</button><img alt=""><button class="lbn" aria-label="Далее">›</button></div>';

document.body.appendChild(lb);
["wheel", "touchmove"].forEach((t) =>
    lb.addEventListener(t, (e) => e.preventDefault(), { passive: false }),
);

let galleryItems = [],
    galleryIndex = 0;

const galleryImage = lb.querySelector("img");

const show = (i) => {
    galleryIndex = (i + galleryItems.length) % galleryItems.length;
    const el = galleryItems[galleryIndex];
    galleryImage.src = getComputedStyle(el).backgroundImage.slice(5, -2);
    galleryImage.alt = el.getAttribute("aria-label") || "";
    lb.classList.toggle("one", galleryItems.length < 2);
};

const openGallery = (el) => {
    galleryItems = [...document.querySelectorAll('[data-zoom="' + el.dataset.zoom + '"]')];
    show(galleryItems.indexOf(el));
    lb.classList.add("on");
    lb.querySelector(".lbx").focus({ preventScroll: true });
};

const closeGallery = () => {
    lb.classList.remove("on");
};

document.addEventListener("click", (e) => {
    const z = e.target.closest("[data-zoom]");
    if (z) {
        openGallery(z);
        return;
    }
    if (!lb.classList.contains("on")) return;
    if (e.target.closest(".lbx") || e.target === lb) closeGallery();
    else if (e.target.closest(".lbp")) show(galleryIndex - 1);
    else if (e.target.closest(".lbn")) show(galleryIndex + 1);
});

document.addEventListener("keydown", (e) => {
    if (lb.classList.contains("on")) {
        if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key))
            e.preventDefault();
        if (e.key === "Escape") closeGallery();
        if (e.key === "ArrowLeft") show(galleryIndex - 1);
        if (e.key === "ArrowRight") show(galleryIndex + 1);
    } else if (
        (e.key === "Enter" || e.key === " ") &&
        e.target.matches &&
        e.target.matches("[data-zoom]")
    ) {
        e.preventDefault();
        openGallery(e.target);
    }

});

document.querySelectorAll(".brow").forEach((bx) => {
    let d = false,
        sx = 0,
        sl = 0,
        moved = false,
        wt;
    bx.addEventListener("pointerdown", (e) => {
        if (
            e.pointerType !== "mouse" ||
            e.button !== 0 ||
            bx.scrollWidth <= bx.clientWidth ||
            e.target.closest("button")
        )
            return;
        d = true;
        moved = false;
        sx = e.clientX;
        sl = bx.scrollLeft;
        bx.classList.add("drag");
    });
    addEventListener("pointermove", (e) => {
        if (!d) return;
        const dx = e.clientX - sx;
        if (Math.abs(dx) > 4) moved = true;
        bx.scrollLeft = sl - dx;
    });
    addEventListener("pointerup", () => {
        if (!d) return;
        d = false;
        bx.classList.remove("drag");
    });
    bx.addEventListener(
        "click",
        (e) => {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
                moved = false;
            }
        },
        true,
    );
    bx.addEventListener(
        "wheel",
        (e) => {
            if (bx.scrollWidth <= bx.clientWidth) return;
            const dx = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX,
                max = bx.scrollWidth - bx.clientWidth;
            if ((dx < 0 && bx.scrollLeft <= 0) || (dx > 0 && bx.scrollLeft >= max - 1)) return;
            e.preventDefault();
            bx.classList.add("drag");
            bx.scrollLeft += dx;
            clearTimeout(wt);
            wt = setTimeout(() => bx.classList.remove("drag"), 160);
        },
        { passive: false },
    );
});

const equalizeCardHeights = () => {
    const c = [...document.querySelectorAll("#blocks .bl")];
    c.forEach((x) => (x.style.minHeight = ""));
    if (!matchMedia("(max-width:820px)").matches) return;
    const m = Math.max(...c.map((x) => x.offsetHeight));
    c.forEach((x) => (x.style.minHeight = m + "px"));
};
equalizeCardHeights();

addEventListener("resize", equalizeCardHeights);

if (document.fonts && document.fonts.ready) document.fonts.ready.then(equalizeCardHeights);

const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
toast.textContent = "Номер скопирован";

document.body.appendChild(toast);

document.querySelectorAll("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const t = btn.dataset.copy;
        toast.textContent = btn.dataset.msg;
        const done = () => {
            toast.classList.add("on");
            clearTimeout(window._t);
            window._t = setTimeout(() => toast.classList.remove("on"), 2200);
        };
        const fb = () => {
            const a = document.createElement("textarea");
            a.value = t;
            a.style.cssText = "position:fixed;opacity:0";
            document.body.appendChild(a);
            a.select();
            try {
                document.execCommand("copy");
            } catch (x) {}
            a.remove();
            done();
        };
        navigator.clipboard && navigator.clipboard.writeText
            ? navigator.clipboard.writeText(t).then(done, fb)
            : fb();
    }),
);

if (!prefersReducedMotion && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const NS = "http://www.w3.org/2000/svg",
        d = document.createElementNS(NS, "svg"),
        p = document.createElementNS(NS, "path");
    d.setAttribute("class", "drop");
    d.setAttribute("aria-hidden", "true");
    d.appendChild(p);
    document.body.appendChild(d);
    const N = 16,
        P = Array.from({ length: N }, () => ({ x: -200, y: -200 }));
    let mx = -200,
        my = -200,
        px = -200,
        py = -200,
        g = 0,
        first = true,
        dx = 1,
        dy = 0;
    const f1 = (v) => v.toFixed(1),
        mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
        pt = (a) => f1(a[0]) + " " + f1(a[1]);
    addEventListener("pointermove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (first) {
            P.forEach((q) => {
                q.x = mx;
                q.y = my;
            });
            px = mx;
            py = my;
            first = false;
        }
    });
    (function f() {
        const h = P[0];
        h.x += (mx - h.x) * 0.3;
        h.y += (my - h.y) * 0.3;
        for (let i = 1; i < N; i++) {
            const q = P[i],
                o = P[i - 1];
            q.x += (o.x - q.x) * 0.34;
            q.y += (o.y - q.y) * 0.34;
            const ex = q.x - o.x,
                ey = q.y - o.y,
                el = Math.hypot(ex, ey);
            if (el > 2.4) {
                q.x = o.x + (ex / el) * 2.4;
                q.y = o.y + (ey / el) * 2.4;
            }
        }
        const sp = Math.hypot(h.x - px, h.y - py);
        px = h.x;
        py = h.y;
        const hl = Math.hypot(P[0].x - P[1].x, P[0].y - P[1].y);
        if (hl > 0.5) {
            dx = (P[0].x - P[1].x) / hl;
            dy = (P[0].y - P[1].y) / hl;
        }
        const tg = Math.min(sp / 9, 1);
        g += (tg - g) * (tg > g ? 0.09 : 0.05);
        const R = 2 + 9 * g,
            Ls = [],
            Rs = [];
        for (let i = 0; i < N; i++) {
            const a = P[Math.max(i - 1, 0)],
                b = P[Math.min(i + 1, N - 1)];
            let vx = a.x - b.x,
                vy = a.y - b.y;
            const l = Math.hypot(vx, vy);
            if (l < 0.05) {
                vx = dx;
                vy = dy;
            } else {
                vx /= l;
                vy /= l;
            }
            const r = R * Math.pow(1 - i / (N - 1), 0.85);
            Ls.push([P[i].x - vy * r, P[i].y + vx * r]);
            Rs.push([P[i].x + vy * r, P[i].y - vx * r]);
        }
        let s = "M" + pt(Ls[0]);
        for (let i = 1; i < N - 1; i++) s += "Q" + pt(Ls[i]) + " " + pt(mid(Ls[i], Ls[i + 1]));
        s += "L" + pt(Ls[N - 1]);
        for (let i = N - 2; i >= 1; i--) s += "Q" + pt(Rs[i]) + " " + pt(mid(Rs[i], Rs[i - 1]));
        s += "L" + pt(Rs[0]) + "A" + f1(R) + " " + f1(R) + " 0 0 1 " + pt(Ls[0]) + "Z";
        p.setAttribute("d", s);
        d.style.opacity = g < 0.03 ? 0 : Math.min(g * 3, 1) * 0.9;
        requestAnimationFrame(f);
    })();
}
