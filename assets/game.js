/* ============================================================
   GODZILLA : MAÎTRE DES TABLES — moteur de jeu
   Tables de multiplication 2 à 9, kaijus cachés dans des
   cristaux de camouflage, Godzilla tire le rayon final.
   ============================================================ */

// ======================= CONFIG NIVEAUX =======================
// decor: fichier dans assets/ (jpg, nommé par kaiju). kaiju: clé dans KAIJU_IMAGES.
// NOTE JULIE : Mothra n'est PAS un adversaire caché dans un cristal — elle
// reste la gardienne bienveillante (voir combo plus bas), donc elle est
// sortie de cette liste. Space Godzilla la remplace comme 8e adversaire,
// juste avant Biollante comme demandé.
const LEVELS = [
    { table: 2, kaiju: "rodan",         nom: "Rodan",          decor: "decors_rodan.jpg",         palier: 1 },
    { table: 3, kaiju: "anguirus",      nom: "Anguirus",       decor: "decors_anguirus.jpg",      palier: 1 },
    { table: 4, kaiju: "mechagodzilla", nom: "Mechagodzilla",  decor: "decors_mechagodzilla.jpg", palier: 2 },
    { table: 5, kaiju: "gigan",         nom: "Gigan",          decor: "decors_gigan.jpg",         palier: 2 },
    { table: 6, kaiju: "spacegodzilla", nom: "Space Godzilla", decor: "decors_space_godzilla.jpg", palier: 3 },
    { table: 7, kaiju: "biollante",     nom: "Biollante",      decor: "decors_biollante.jpg",     palier: 3 },
    { table: 8, kaiju: "destroyah",     nom: "Destoroyah",     decor: "decors_destroyah.jpg",     palier: 4 },
    { table: 9, kaiju: "ghidorah",      nom: "King Ghidorah",  decor: "decors_ghidorah.jpg",      palier: 4 },
];

// Couleur du rayon / halo par palier (teinte appliquée en code,
// pas besoin d'images Godzilla différentes par palier)
const PALIER_TINT = {
    1: { beam: "rgba(140,220,255,0.0)", glow: "#8fdcff", particle: [190, 60] }, // bleu-blanc
    2: { beam: "rgba(70,160,255,0.0)",  glow: "#4aa8ff", particle: [205, 70] }, // bleu intense
    3: { beam: "rgba(150,110,255,0.0)", glow: "#a066ff", particle: [265, 70] }, // bleu-violet
    4: { beam: "rgba(255,110,50,0.0)",  glow: "#ff6a2e", particle: [15, 85]  }, // rouge-orangé incandescent
};

const KAIJU_FILES = {
    rodan: "assets/kaiju_rodan.png",
    anguirus: "assets/kaiju_anguirus.png",
    mechagodzilla: "assets/kaiju_mechagodzilla.png",
    gigan: "assets/kaiju_gigan.png",
    spacegodzilla: "assets/kaiju_space_godzilla.png",
    biollante: "assets/kaiju_biollante.png",
    destroyah: "assets/kaiju_destroyah.png",
    ghidorah: "assets/kaiju_ghidorah.png",
};

// Mothra n'est PAS un adversaire : elle apparaît uniquement lors du
// combo bienveillant (voir registerCorrectForCombo). Chargée à part.
const MOTHRA_FILE = "assets/kaiju_mothra.png";

// Mode "burning" (Godzilla incandescent) : déclenché quand plusieurs
// niveaux sont enchaînés rapidement (voir BURNING_TIME_THRESHOLD).
// Les 3 fichiers ci-dessous sont optionnels : tant qu'ils ne sont pas
// fournis, un filtre orange est appliqué en code sur les images
// normales pour simuler l'effet "en feu" (voir drawGodzilla / drawBeam).
const GODZILLA_BURNING_FILE = "assets/godzilla_burning.png";
const GODZILLA_BURNING_OUVERT_FILE = "assets/godzilla_burning_ouvert.png";
const RAYON_BURNING_FILE = "assets/rayon_burning.png";
const BURNING_TIME_THRESHOLD = 10; // secondes : niveau bouclé sous ce temps = "rapide"
const BURNING_STREAK_NEEDED = 2;    // nb de niveaux rapides d'affilée pour activer le mode

// Durée du mode burning : dépend de l'écart ("gap") entre le temps réalisé et le seuil.
// Choix (non précisé par Julie, fixé ici — modifiable librement) :
//   - petit écart (gap < BURNING_GAP_BIG) -> 10s de mode burning
//   - gros écart (gap >= BURNING_GAP_BIG)  -> 20s de mode burning
// Le burning est un vrai décompte en temps réel (pas seulement "jusqu'au prochain raté") :
// il s'éteint tout seul après ce délai, et chaque niveau rapide/propre supplémentaire
// pendant que le mode est actif RELANCE le décompte (voir stopLevelTimerAndComputeBonus).
// Volontairement AUCUN chiffre de compte à rebours n'est affiché à l'écran pour ce mode
// (uniquement le badge "🔥 BURNING" allumé/éteint) afin de ne jamais créer de pression
// chronométrée supplémentaire au-dessus du chrono de niveau déjà présent.
const BURNING_GAP_BIG = 3;            // secondes d'écart sous le seuil pour obtenir le palier long
const BURNING_DURATION_SHORT = 10000; // ms (base, avant bonus de maîtrise)
const BURNING_DURATION_LONG = 20000;  // ms (base, avant bonus de maîtrise)
const BURNING_KILL_BONUS = 5;             // points bonus immédiats par cristal correct pendant le burning
const BURNING_LEVEL_BONUS_MULTIPLIER = 1.5; // multiplicateur sur le bonus de rapidité de fin de niveau pendant le burning

// ======================= MAÎTRISE PROGRESSIVE DU MODE BURNING =======================
// Au début, le mode burning doit rester rare et court pour ne pas être acquis
// tout de suite. Plus l'élève enchaîne de niveaux rapides et propres au fil
// des parties (persistant via localStorage, indépendant d'un niveau précis),
// plus il devient FACILE à déclencher (moins de niveaux rapides nécessaires
// d'affilée) ET plus il dure LONGTEMPS une fois activé.
const MASTERY_STORAGE_KEY = "gmt_mastery_points_v1";
function loadMasteryPoints() {
    try { return parseInt(localStorage.getItem(MASTERY_STORAGE_KEY) || "0", 10) || 0; } catch (e) { return 0; }
}
function saveMasteryPoints() {
    try { localStorage.setItem(MASTERY_STORAGE_KEY, String(masteryPoints)); } catch (e) { /* tant pis */ }
}
let masteryPoints = loadMasteryPoints();

// nb de niveaux rapides/propres d'affilée requis pour activer le burning :
// commence à 2 (comme avant), descend à 1 après 6 points de maîtrise
function getBurningStreakNeeded() {
    return masteryPoints >= 6 ? 1 : BURNING_STREAK_NEEDED;
}
// durée du burning une fois activé : augmente progressivement avec la maîtrise
// (jusqu'à +10s de bonus, atteint à 15 points de maîtrise)
function getBurningDuration(isLongGap) {
    const base = isLongGap ? BURNING_DURATION_LONG : BURNING_DURATION_SHORT;
    const bonus = Math.min(10000, Math.floor(masteryPoints / 3) * 2000);
    return base + bonus;
}

// ======================= GALERIE DES CŒURS DE RÉSONANCE (médailles) =======================
// 10 paliers faciles à obtenir, avec des écarts de score volontairement petits
// (renforcement positif). Basé sur masteryPoints, qui est déjà persistant et
// augmente à chaque niveau rapide/propre (rejouer un niveau compte aussi).
const MEDALS = [
    { name: "Cœur Godzilla",           threshold: 0,  glow: "rgba(120,170,255,0.5)",  grad: "radial-gradient(circle at 35% 30%, #7db8ff, #1c3a63)" },
    { name: "Cœur Godzilla Alpha",     threshold: 2,  glow: "rgba(90,150,255,0.55)",   grad: "radial-gradient(circle at 35% 30%, #5a9bff, #16305c)" },
    { name: "Cœur Godzilla Burning",   threshold: 5,  glow: "rgba(255,140,60,0.6)",    grad: "radial-gradient(circle at 35% 30%, #ffb15c, #7a2a0a)" },
    { name: "Cœur Shin Godzilla",      threshold: 8,  glow: "rgba(255,90,90,0.55)",    grad: "radial-gradient(circle at 35% 30%, #ff7a7a, #5c1414)" },
    { name: "Cœur Godzilla Earth",     threshold: 12, glow: "rgba(150,90,255,0.55)",   grad: "radial-gradient(circle at 35% 30%, #a888ff, #2a1a4a)" },
    { name: "Cœur Godzilla Ultima",    threshold: 16, glow: "rgba(255,214,102,0.6)",   grad: "radial-gradient(circle at 35% 30%, #ffe08a, #7a5a10)" },
    { name: "Cœur MechaGodzilla",      threshold: 21, glow: "rgba(160,220,255,0.6)",   grad: "radial-gradient(circle at 35% 30%, #cdeeff, #2c4a5c)" },
    { name: "Cœur SpaceGodzilla",      threshold: 27, glow: "rgba(200,120,255,0.6)",   grad: "radial-gradient(circle at 35% 30%, #d9a6ff, #3a1a4a)" },
    { name: "Cœur Godzilla Evolved",   threshold: 34, glow: "rgba(120,255,190,0.6)",   grad: "radial-gradient(circle at 35% 30%, #8affca, #124a38)" },
    { name: "Cœur Roi des Monstres",   threshold: 42, glow: "rgba(255,225,150,0.75)",  grad: "radial-gradient(circle at 35% 30%, #fff2c0, #a5731a)" },
];

function renderMedalsGallery() {
    const grid = document.getElementById("medal-grid");
    const progress = document.getElementById("medals-progress");
    if (!grid) return;
    grid.innerHTML = "";
    const pts = masteryPoints;
    const next = MEDALS.find(m => pts < m.threshold);
    if (progress) {
        progress.textContent = next
            ? `🔥 Maîtrise actuelle : ${pts} pts — encore ${next.threshold - pts} pt(s) pour débloquer « ${next.name} » !`
            : `🔥 Maîtrise actuelle : ${pts} pts — tous les cœurs de résonance sont débloqués, bravo !`;
    }
    MEDALS.forEach((m) => {
        const unlocked = pts >= m.threshold;
        const cell = document.createElement("div");
        cell.className = "medal-core " + (unlocked ? "unlocked" : "locked");

        const orb = document.createElement("div");
        orb.className = "medal-orb";
        orb.style.setProperty("--orb-grad", m.grad);
        orb.style.setProperty("--orb-glow", m.glow);
        orb.textContent = unlocked ? "🦖" : "🔒";

        const name = document.createElement("div");
        name.className = "medal-name";
        name.textContent = unlocked ? m.name : "???";

        const thresh = document.createElement("div");
        thresh.className = "medal-threshold";
        thresh.textContent = unlocked ? "Débloqué" : `${m.threshold} pts`;

        cell.appendChild(orb);
        cell.appendChild(name);
        cell.appendChild(thresh);
        grid.appendChild(cell);
    });
}

const DECOR_START = "assets/presentation.png"; // écran de démarrage (illustration Godzilla fournie par Julie)

// Décor + barreaux de la prison Monarch (Parc des Kaijus) :
// - decors_prison.jpg : fond de la cellule (image plate, pas de détourage)
// - barreaux_prison.png : barreaux en premier plan, fond bleu pur -> détourés
//   comme les personnages, pour laisser voir le kaiju capturé au travers.
const DECOR_PRISON_FILE = "assets/decors_prison.jpg";
const BARREAUX_PRISON_FILE = "assets/barreaux_prison.png";

// ======================= PROGRESSION / KAIJUS INCONNUS =======================
// Un kaiju est "inconnu" (❓, pas de nom ni d'image sur l'écran d'accueil) tant
// qu'il n'a jamais été vaincu une première fois. Une fois vaincu, il est révélé
// définitivement (sauvegardé en local) ET son niveau redevient rejouable
// librement depuis l'écran d'accueil pour augmenter son score, sans avoir à
// retraverser les niveaux précédents.
const DEFEATED_STORAGE_KEY = "gmt_defeated_levels_v1";

function loadDefeatedLevels() {
    try {
        const raw = localStorage.getItem(DEFEATED_STORAGE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
        return new Set();
    }
}
function saveDefeatedLevels() {
    try { localStorage.setItem(DEFEATED_STORAGE_KEY, JSON.stringify([...defeatedLevels])); } catch (e) { /* stockage indisponible, tant pis */ }
}
let defeatedLevels = loadDefeatedLevels();
function markLevelDefeated(idx) {
    if (!defeatedLevels.has(idx)) { defeatedLevels.add(idx); saveDefeatedLevels(); }
}
// premier niveau jamais vaincu = prochain défi ; si tout est vaincu, reste sur le dernier
function getFrontierLevelIndex() {
    for (let i = 0; i < LEVELS.length; i++) if (!defeatedLevels.has(i)) return i;
    return LEVELS.length - 1;
}

// ======================= CHARGEMENT + CHROMA KEY =======================
// Toutes les images "personnages" (Godzilla, kaijus, rayon) sont sur
// fond bleu pur #0000FF. On les détoure automatiquement au chargement.
function loadAndKeyImage(src, onReady) {
    const img = new Image();
    img.onload = () => {
        const off = document.createElement("canvas");
        off.width = img.naturalWidth;
        off.height = img.naturalHeight;
        const octx = off.getContext("2d");
        octx.drawImage(img, 0, 0);
        try {
            const data = octx.getImageData(0, 0, off.width, off.height);
            const px = data.data;
            for (let i = 0; i < px.length; i += 4) {
                const r = px[i], g = px[i + 1], b = px[i + 2];
                // Bleu pur dominant -> transparent. Zones limitrophes -> alpha réduit (anti-frange).
                const blueness = b - Math.max(r, g);
                if (b > 140 && blueness > 60) {
                    const alpha = Math.max(0, 1 - blueness / 170);
                    px[i + 3] = Math.min(px[i + 3], Math.round(alpha * 255));
                    // suppression du "spill" bleu sur les pixels de bord restants
                    if (px[i + 3] > 0) {
                        px[i + 2] = Math.min(b, Math.max(r, g) + 25);
                    }
                }
            }
            octx.putImageData(data, 0, 0);
            // IMPORTANT : toDataURL() peut lui-même lever une SecurityError (canvas
            // "taint" par certains navigateurs en file:// / double-clic sans serveur,
            // voir README) même quand getImageData a réussi juste au-dessus. Sans ce
            // second try/catch, une erreur ici n'était jamais rattrapée : onReady()
            // n'était jamais appelé et le chargement restait bloqué indéfiniment
            // (bouton "Affronter" qui ne s'active jamais). On retombe alors sur
            // l'image d'origine (fond bleu visible, mais le jeu reste jouable).
            const keyed = new Image();
            keyed.onload = () => onReady(keyed);
            keyed.onerror = () => onReady(img);
            keyed.src = off.toDataURL();
        } catch (e) {
            console.warn("Chroma-key impossible pour", src, "— image utilisée telle quelle (fond bleu visible).", e);
            onReady(img);
        }
    };
    img.onerror = () => {
        console.warn("Image manquante :", src);
        onReady(null);
    };
    img.src = src;
}

function loadPlainImage(src, onReady, fallbackSrc) {
    const img = new Image();
    img.onload = () => onReady(img);
    img.onerror = () => {
        if (fallbackSrc) {
            const fb = new Image();
            fb.onload = () => onReady(fb);
            fb.onerror = () => onReady(null);
            fb.src = fallbackSrc;
        } else {
            onReady(null);
        }
    };
    img.src = src;
}

// Assets chargés (remplis de façon asynchrone), lecture directe dans le jeu
const ASSETS = {
    godzilla: null,
    godzillaOuvert: null,
    godzillaBurning: null,       // optionnel
    godzillaBurningOuvert: null, // optionnel
    rayon: null,
    rayonBurning: null,          // optionnel
    mothra: null,   // gardienne bienveillante (combo), pas un adversaire
    decorStart: null,
    decorPrison: null,    // fond de cellule (Parc des Kaijus)
    barreauxPrison: null, // barreaux en premier plan, détourés (Parc des Kaijus)
    kaiju: {},      // clé -> HTMLImageElement (détourée) ou null
    decors: {},     // niveau index -> HTMLImageElement
    ready: false,
};

function preloadAllAssets(onAllReady) {
    let pending = 0;
    let done = 0;
    function tick() { done++; if (done >= pending) { ASSETS.ready = true; onAllReady(); } }

    pending++; loadAndKeyImage("assets/godzilla.png", (img) => { ASSETS.godzilla = img; tick(); });
    pending++; loadAndKeyImage("assets/godzilla_ouvert.png", (img) => { ASSETS.godzillaOuvert = img; tick(); });
    pending++; loadAndKeyImage("assets/rayon.png", (img) => { ASSETS.rayon = img; tick(); });
    pending++; loadAndKeyImage(MOTHRA_FILE, (img) => { ASSETS.mothra = img; tick(); });
    // assets "burning" optionnels : pas d'erreur si absents, juste null -> filtre de secours
    pending++; loadAndKeyImage(GODZILLA_BURNING_FILE, (img) => { ASSETS.godzillaBurning = img; tick(); });
    pending++; loadAndKeyImage(GODZILLA_BURNING_OUVERT_FILE, (img) => { ASSETS.godzillaBurningOuvert = img; tick(); });
    pending++; loadAndKeyImage(RAYON_BURNING_FILE, (img) => { ASSETS.rayonBurning = img; tick(); });

    for (const key in KAIJU_FILES) {
        const file = KAIJU_FILES[key];
        pending++;
        if (!file) { ASSETS.kaiju[key] = null; tick(); continue; }
        loadAndKeyImage(file, (img) => { ASSETS.kaiju[key] = img; tick(); });
    }

    LEVELS.forEach((lvl, idx) => {
        pending++;
        loadPlainImage("assets/" + lvl.decor.replace(/^assets\//, ""), (img) => {
            ASSETS.decors[idx] = img; tick();
        }, DECOR_START);
    });
    pending++; loadPlainImage(DECOR_START, (img) => { ASSETS.decorStart = img; tick(); });
    pending++; loadPlainImage(DECOR_PRISON_FILE, (img) => { ASSETS.decorPrison = img; tick(); });
    pending++; loadAndKeyImage(BARREAUX_PRISON_FILE, (img) => { ASSETS.barreauxPrison = img; tick(); });
}

// ======================= FAITS & LEURRES =======================
function buildFactsPool(table) {
    const facts = [];
    for (let factor = 1; factor <= 10; factor++) {
        facts.push({ table, factor, produit: table * factor });
    }
    return facts;
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildOptionsForFact(fact) {
    const { table, factor, produit } = fact;
    const candidates = new Set();
    const add = (v) => { if (v > 0 && v !== produit) candidates.add(v); };

    add((table - 1) * factor);
    add((table + 1) * factor);
    add(table * (factor - 1));
    add(table * (factor + 1));
    add(produit - table);
    add(produit + table);
    add(produit - 1);
    add(produit + 1);
    add((table + 1) * (factor - 1));
    add((table - 1) * (factor + 1));

    let pool = shuffle([...candidates]);
    const leurres = pool.slice(0, 3);
    let guard = 0;
    while (leurres.length < 3 && guard < 50) {
        guard++;
        const v = produit + Math.floor(Math.random() * 21) - 10;
        if (v > 0 && v !== produit && !leurres.includes(v)) leurres.push(v);
    }
    const options = shuffle([produit, ...leurres]);
    return options.map((val) => ({ val, correct: val === produit }));
}

function getAstuce(table, factor, produit) {
    if (factor === 1) return `${table} × 1 = ${table} (un nombre multiplié par 1 ne change pas).`;
    if (factor === 10) return `${table} × 10 = ${produit} (on ajoute simplement un 0).`;
    if (factor === 9) return `${table} × 9 = ${table} × 10 − ${table} = ${table * 10} − ${table} = ${produit}.`;
    if (factor === 5 && table % 2 === 0) return `${table} × 5 = ${table} ÷ 2 × 10 = ${table / 2}0.`;
    let a, b;
    if (factor > 5) { a = 5; b = factor - 5; } else { a = Math.ceil(factor / 2); b = Math.floor(factor / 2); }
    return `${table} × ${factor} = ${table}×${a} + ${table}×${b} = ${table * a} + ${table * b} = ${produit}.`;
}

// ======================= AUDIO (synthétisé, ton "impact kaiju") =======================
let audioCtx = null;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === "suspended") audioCtx.resume(); }

function playImpactSound() {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc.start(now); osc.stop(now + 0.4);
}

function playCrumbleSound() {
    initAudio();
    const bufferSize = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.22, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 1400;
    noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    noise.start();
}

function playBeamSound() {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.28);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc.start(now); osc.stop(now + 0.32);
}

function playFanfare() {
    initAudio();
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.frequency.value = f; osc.type = "triangle";
        const t = audioCtx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        osc.start(t); osc.stop(t + 0.5);
    });
}

function playVictory() {
    initAudio();
    const melody = [523, 587, 659, 784, 880, 1047, 1319];
    melody.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.frequency.value = f; osc.type = "sine";
        const t = audioCtx.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
        osc.start(t); osc.stop(t + 0.7);
    });
}

function playComboChime() {
    initAudio();
    const notes = [784, 988, 1245];
    notes.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.frequency.value = f; osc.type = "sine";
        const t = audioCtx.currentTime + i * 0.09;
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.start(t); osc.stop(t + 0.35);
    });
}

// ======================= CANVAS / ÉTAT GLOBAL =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const SAFE_TOP = 110;
const SAFE_BOTTOM = 100;

let currentLevelIndex = 0;
let currentScore = 0;
let errors = 0;
let gameActive = false;
let animationId = null;
let cristaux = [];
let particles = [];
let fireworks = [];
let factsPool = [];
let currentFact = null;
let mouseXPos = 550, mouseYPos = 400;
let levelStartTime = 0, currentLevelTime = 0, totalTimeBonus = 0;
let chronoInterval = null;
let victoryFireworks = false;
let activeCard = null;
let cardTimeout = null;
let shotLock = false; // verrouille les clics pendant l'animation du rayon

// combo Mothra
let comboTimestamps = [];
let mothraFlyby = null; // { t, duration } animation de survol bienveillant

// mode burning (Godzilla incandescent après plusieurs niveaux rapides)
let burningStreak = 0;
let burningMode = false;
let burningExpiresAt = 0; // timestamp (performance.now()) auquel le mode burning s'éteint tout seul

// apparition de l'ennemi derrière les pierres quand il ne reste plus que 3
// calculs à trouver dans le niveau : Godzilla passe alors automatiquement
// (et reste) en mode burning jusqu'à la fin du niveau.
let enemyRevealed = false;
let forcedBurning = false;
const ENEMY_REVEAL_REMAINING = 3; // nb de calculs restants (dont le courant) déclenchant l'apparition

// beam animation state
let beam = null; // { x1,y1,x2,y2, progress, phase, targetCristal, hue }
let godzillaMouthOpen = false;
let palierFlashTimer = 0;

// ======================= PARTICULES =======================
class Particle {
    constructor(x, y, hue) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 9;
        this.vy = (Math.random() - 0.5) * 9 - 3;
        this.life = 1;
        this.color = `hsl(${hue}, 80%, 62%)`;
        this.size = Math.random() * 7 + 3;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += 0.2; this.life -= 0.02; return this.life > 0; }
    draw() { ctx.fillStyle = this.color; ctx.globalAlpha = this.life; ctx.beginPath(); ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
}

// éclats de roche (mauvaise réponse -> cristal éclate à vide)
class DustParticle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6 - 2;
        this.life = 1;
        this.size = Math.random() * 5 + 2;
        this.rot = Math.random() * Math.PI * 2;
        this.vrot = (Math.random() - 0.5) * 0.3;
        this.gray = 90 + Math.random() * 60;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += 0.22; this.rot += this.vrot; this.life -= 0.025; return this.life > 0; }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `rgb(${this.gray},${this.gray - 10},${this.gray - 15})`;
        ctx.beginPath();
        ctx.moveTo(-this.size, -this.size * 0.6);
        ctx.lineTo(this.size, -this.size * 0.3);
        ctx.lineTo(this.size * 0.6, this.size);
        ctx.lineTo(-this.size * 0.8, this.size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1;
    }
}

// petit texte flottant "+5🔥" affiché au point d'impact pendant le mode burning.
// Purement décoratif / feedback immédiat — ne remplace pas et n'ajoute pas de
// minuteur ou de chiffre de compte à rebours du mode burning lui-même.
class FloatingText {
    constructor(x, y, text) {
        this.x = x; this.y = y; this.text = text; this.life = 1;
    }
    update() { this.y -= 1.1; this.life -= 0.018; return this.life > 0; }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.font = "bold 24px 'Bebas Neue', sans-serif";
        ctx.fillStyle = "#ffb347";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 6;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
        ctx.globalAlpha = 1;
    }
}
let floatingTexts = [];
function spawnBurningBonusPopup(x, y) {
    floatingTexts.push(new FloatingText(x, y, `+${BURNING_KILL_BONUS} 🔥`));
}

class Firework {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.particles = [];
        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            this.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: `hsl(${Math.random() * 360}, 85%, 65%)`, size: Math.random() * 5 + 2 });
        }
    }
    update() {
        let alive = false;
        for (const p of this.particles) { p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.02; if (p.life > 0) alive = true; }
        return alive;
    }
    draw() { for (const p of this.particles) { ctx.fillStyle = p.color; ctx.globalAlpha = p.life * 0.8; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
}

// ======================= CRISTAL DE CAMOUFLAGE =======================
// Remplace les ballons. Rocher/cristal semi-translucide ; identique en
// apparence entre cristaux d'une même manche (seul le chiffre change).
// La teinte de base varie aléatoirement (alien/tech) sans corréler
// avec la bonne réponse.
class Cristal {
    constructor(value, isCorrect, kaijuKey, variant = null) {
        this.value = value;
        this.isCorrect = isCorrect;
        this.kaijuKey = kaijuKey;
        this.radius = 50;
        this.state = "idle"; // idle | cracking | revealing | exploding | dead
        this.stateT = 0;
        this.hue = 185 + Math.random() * 110; // 185-295 : cyan -> violet (alien)
        this.facets = this.generateFacets();

        let side = variant !== null ? variant : Math.floor(Math.random() * 4);
        if (side === 0) { this.x = this.radius + 5; this.y = rand(SAFE_TOP + this.radius, canvas.height - this.radius - SAFE_BOTTOM); this.vx = rand(1.0, 2.2); this.vy = rand(-0.8, 0.8); }
        else if (side === 1) { this.x = canvas.width - this.radius - 5; this.y = rand(SAFE_TOP + this.radius, canvas.height - this.radius - SAFE_BOTTOM); this.vx = -rand(1.0, 2.2); this.vy = rand(-0.8, 0.8); }
        else if (side === 2) { this.x = rand(this.radius, canvas.width - this.radius); this.y = SAFE_TOP + this.radius + 5; this.vx = rand(-0.9, 0.9); this.vy = rand(0.8, 1.4); }
        else { this.x = rand(this.radius, canvas.width - this.radius); this.y = canvas.height - this.radius - SAFE_BOTTOM - 5; this.vx = rand(-0.9, 0.9); this.vy = -rand(0.8, 1.4); }

        this.floatAngle = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.02 + Math.random() * 0.015;
    }

    generateFacets() {
        // polygone irrégulier façon cristal (8 points, rayon variable)
        const pts = [];
        const n = 8;
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2;
            const r = this.radius * (0.78 + Math.random() * 0.28);
            pts.push({ a, r });
        }
        return pts;
    }

    update() {
        if (this.state === "idle") {
            this.x += this.vx; this.y += this.vy;
            this.floatAngle += this.floatSpeed;
            this.y += Math.sin(this.floatAngle) * 0.5;
            const top = SAFE_TOP + this.radius, bottom = canvas.height - this.radius - SAFE_BOTTOM;
            if (this.x - this.radius < 5) { this.x = this.radius + 5; this.vx = Math.abs(this.vx) * 0.97; }
            if (this.x + this.radius > canvas.width - 5) { this.x = canvas.width - this.radius - 5; this.vx = -Math.abs(this.vx) * 0.97; }
            if (this.y < top) { this.y = top; this.vy = Math.abs(this.vy) * 0.97; }
            if (this.y > bottom) { this.y = bottom; this.vy = -Math.abs(this.vy) * 0.97; }
            const maxSpeed = 2.6;
            if (Math.abs(this.vx) > maxSpeed) this.vx = Math.sign(this.vx) * maxSpeed;
            if (Math.abs(this.vy) > maxSpeed) this.vy = Math.sign(this.vy) * maxSpeed;
        } else {
            this.stateT += 1 / 60;
        }
        return this.state !== "dead";
    }

    clipPath() {
        ctx.beginPath();
        this.facets.forEach((p, i) => {
            const px = this.x + Math.cos(p.a) * p.r;
            const py = this.y + Math.sin(p.a) * p.r;
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
    }

    drawRock(alpha) {
        ctx.save();
        this.clipPath();
        const grad = ctx.createRadialGradient(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1, this.x, this.y, this.radius);
        grad.addColorStop(0, `hsla(${this.hue}, 70%, 72%, ${0.55 * alpha})`);
        grad.addColorStop(0.6, `hsla(${this.hue}, 65%, 48%, ${0.42 * alpha})`);
        grad.addColorStop(1, `hsla(${this.hue}, 60%, 30%, ${0.38 * alpha})`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = `hsla(${this.hue}, 90%, 82%, ${0.8 * alpha})`;
        ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, ${0.6 * alpha})`;
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.restore();

        // lignes de facettes internes
        ctx.save();
        this.clipPath(); ctx.clip();
        ctx.strokeStyle = `hsla(${this.hue}, 90%, 90%, ${0.25 * alpha})`;
        ctx.lineWidth = 1;
        this.facets.forEach((p) => {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(p.a) * p.r, this.y + Math.sin(p.a) * p.r);
            ctx.stroke();
        });
        ctx.restore();
    }

    drawKaijuInside(revealT) {
        // dessine l'image du kaiju (ou silhouette de secours) à l'intérieur
        // du cristal, teintée de rouge (touché)
        ctx.save();
        this.clipPath(); ctx.clip();
        const img = ASSETS.kaiju[this.kaijuKey];
        const size = this.radius * 2.3;
        if (img) {
            ctx.globalAlpha = revealT;
            ctx.drawImage(img, this.x - size / 2, this.y - size / 2, size, size * (img.height / img.width));
        } else {
            drawKaijuSilhouette(this.x, this.y, size, revealT);
        }
        // teinte rouge "touché" (légère, pour ne pas cacher le kaiju)
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = `rgba(255,40,30,${0.22 * revealT})`;
        ctx.fillRect(this.x - size, this.y - size, size * 2, size * 2);
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    draw() {
        if (this.state === "idle") {
            this.drawRock(1);
            ctx.save();
            ctx.font = `bold ${Math.floor(this.radius * 0.62)}px 'Bebas Neue', sans-serif`;
            ctx.fillStyle = "#f4fbff";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 4;
            ctx.fillText(this.value, this.x, this.y + 1);
            ctx.restore();
        } else if (this.state === "cracking") {
            const t = Math.min(1, this.stateT / 0.22);
            this.drawRock(1 - t * 0.5);
            this.drawCracks(t);
        } else if (this.state === "revealing") {
            const t = Math.min(1, this.stateT / 0.5);
            this.drawKaijuInside(t);
            this.drawRock(0.1);
            this.drawCracks(1);
        }
    }

    drawCracks(t) {
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${0.7 * t})`;
        ctx.lineWidth = 1.5;
        const seed = this.value; // cracks stables
        for (let i = 0; i < 5; i++) {
            const a = (seed * 13 + i * 71) % 360 * Math.PI / 180;
            const len = this.radius * (0.5 + (i % 3) * 0.15) * t;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(a) * len, this.y + Math.sin(a) * len);
            ctx.stroke();
        }
        ctx.restore();
    }
}

function rand(a, b) { return a + Math.random() * (b - a); }

// silhouette de secours pour kaijus sans image (Biollante / Destoroyah en attendant)
function drawKaijuSilhouette(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#1a1420";
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.12, size * 0.34, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - size * 0.12, y - size * 0.28, size * 0.22, size * 0.2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // yeux lumineux
    ctx.fillStyle = "#ff4433";
    ctx.beginPath(); ctx.arc(x - size * 0.18, y - size * 0.3, size * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
}

// ======================= DÉCOR (cover-fit) =======================
function drawBackground() {
    const img = ASSETS.decors[currentLevelIndex] || ASSETS.decorStart;
    if (img) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale, h = img.height * scale;
        const dx = (canvas.width - w) / 2, dy = (canvas.height - h) / 2;
        ctx.drawImage(img, dx, dy, w, h);
        // léger voile pour la lisibilité du HUD
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "rgba(0,0,0,0.35)");
        grad.addColorStop(0.25, "rgba(0,0,0,0.05)");
        grad.addColorStop(0.8, "rgba(0,0,0,0.05)");
        grad.addColorStop(1, "rgba(0,0,0,0.4)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#0a0e18";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// ======================= APPARITION DE L'ENNEMI (3 calculs restants) =======================
// Le kaiju du niveau apparaît partiellement, comme caché derrière des rochers
// (dessinés directement en canvas), en fond à droite de l'écran, pour prévenir
// visuellement que la fin du niveau approche — en plus du passage automatique
// en mode burning (voir nextFact()).
function drawEnemyPeeking() {
    if (!enemyRevealed) return;
    const img = ASSETS.kaiju[LEVELS[currentLevelIndex].kaiju];
    const cx = canvas.width - 175, cy = SAFE_TOP + 150;
    const size = 260;
    ctx.save();
    ctx.globalAlpha = 0.92;
    if (img) {
        ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size * (img.height / img.width));
    } else {
        drawKaijuSilhouette(cx, cy, size, 1);
    }
    ctx.restore();

    // rochers du décor par-dessus le bas du kaiju, pour le cacher partiellement
    ctx.save();
    ctx.fillStyle = "#14100e";
    const rockY = cy + size * 0.12;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.62, cy + size * 0.55);
    ctx.lineTo(cx - size * 0.2, rockY);
    ctx.lineTo(cx + size * 0.05, cy + size * 0.42);
    ctx.lineTo(cx + size * 0.35, rockY + 10);
    ctx.lineTo(cx + size * 0.65, cy + size * 0.5);
    ctx.lineTo(cx + size * 0.68, cy + size * 0.62);
    ctx.lineTo(cx - size * 0.65, cy + size * 0.62);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
}

// ======================= GODZILLA + RAYON =======================
// Position de Godzilla à l'écran (bas-gauche) et point de sortie du
// rayon (bouche), en fraction de la largeur/hauteur de l'image.
// -> AJUSTER ICI si le cadrage ne correspond pas exactement à la bouche.
const GODZILLA_DRAW_WIDTH = 430;
const GODZILLA_ANCHOR = { x: 170, y: canvas.height - 60 }; // point "pieds" à l'écran
// Recalibré le 12/07/2026 sur les nouveaux fichiers godzilla.png / godzilla_ouvert.png
// (Godzilla tourné pour faire face à droite, vers l'arène). Mesuré automatiquement par
// détection des pixels rouges/roses de l'intérieur de la bouche sur godzilla_ouvert.png
// (centroïde ≈ 78.8% largeur / 15.3% hauteur). Le cadrage (bounding box hors fond bleu)
// est identique à 1-2px près entre godzilla.png, godzilla_ouvert.png, godzilla_burning.png
// et godzilla_burning_ouvert.png : une seule valeur suffit pour les 4 variantes.
const GODZILLA_MOUTH_REL = { x: 0.788, y: 0.153 }; // position bouche dans l'image (fraction w/h)

function godzillaDrawRect() {
    let img;
    if (burningMode && godzillaMouthOpen && ASSETS.godzillaBurningOuvert) img = ASSETS.godzillaBurningOuvert;
    else if (burningMode && !godzillaMouthOpen && ASSETS.godzillaBurning) img = ASSETS.godzillaBurning;
    else img = godzillaMouthOpen ? ASSETS.godzillaOuvert : ASSETS.godzilla;
    if (!img) return null;
    const w = GODZILLA_DRAW_WIDTH;
    const h = w * (img.height / img.width);
    const x = GODZILLA_ANCHOR.x - w / 2;
    const y = GODZILLA_ANCHOR.y - h;
    return { img, x, y, w, h };
}

function getMouthPosition() {
    const rect = godzillaDrawRect();
    if (!rect) return { x: GODZILLA_ANCHOR.x, y: GODZILLA_ANCHOR.y - 220 };
    return { x: rect.x + rect.w * GODZILLA_MOUTH_REL.x, y: rect.y + rect.h * GODZILLA_MOUTH_REL.y };
}

// true si on utilise le filtre de secours (pas encore de vraie image "burning")
function usingBurningFallback() {
    return burningMode && !((godzillaMouthOpen && ASSETS.godzillaBurningOuvert) || (!godzillaMouthOpen && ASSETS.godzillaBurning));
}

function drawGodzilla() {
    const rect = godzillaDrawRect();
    if (!rect) return;
    const safeIdx = Math.min(currentLevelIndex, LEVELS.length - 1);
    const palier = LEVELS[safeIdx].palier;
    const tint = burningMode ? { glow: "#ff6a2e" } : PALIER_TINT[palier];
    ctx.save();
    ctx.shadowColor = tint.glow;
    ctx.shadowBlur = godzillaMouthOpen ? 26 : 10;
    ctx.drawImage(rect.img, rect.x, rect.y, rect.w, rect.h);
    if (usingBurningFallback()) {
        // filtre orange "en attendant les vraies images burning"
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "rgba(255,90,20,0.4)";
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();
}

function drawMothraFlyby() {
    if (!mothraFlyby || !ASSETS.mothra) return;
    const elapsed = performance.now() - mothraFlyby.start;
    const t = elapsed / mothraFlyby.duration;
    if (t >= 1) { mothraFlyby = null; return; }
    const w = 260, h = w * (ASSETS.mothra.height / ASSETS.mothra.width);
    const x = -w + t * (canvas.width + w * 2);
    const y = SAFE_TOP + 40 + Math.sin(t * Math.PI * 3) * 30;
    ctx.save();
    ctx.globalAlpha = Math.sin(Math.min(t, 1) * Math.PI); // fondu entrée/sortie
    ctx.shadowColor = "#ffe08a";
    ctx.shadowBlur = 25;
    ctx.drawImage(ASSETS.mothra, x, y, w, h);
    ctx.restore();
}

function drawBeam() {
    if (!beam) return;
    const { x1, y1, x2, y2, progress, hue } = beam;
    const cx = x1 + (x2 - x1) * progress;
    const cy = y1 + (y2 - y1) * progress;
    const dist = Math.hypot(cx - x1, cy - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const img = (burningMode && ASSETS.rayonBurning) ? ASSETS.rayonBurning : ASSETS.rayon;
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    const thickness = 38;
    ctx.globalCompositeOperation = "lighter";
    if (img && dist > 4) {
        ctx.drawImage(img, 0, -thickness / 2, dist, thickness);
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, 0.35)`;
        ctx.fillRect(0, -thickness / 2, dist, thickness);
    } else if (dist > 4) {
        const g = ctx.createLinearGradient(0, 0, dist, 0);
        g.addColorStop(0, `hsla(${hue},100%,90%,0.95)`);
        g.addColorStop(1, `hsla(${hue},100%,70%,0.15)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, -thickness / 2, dist, thickness);
    }
    ctx.restore();
    ctx.globalCompositeOperation = "source-over";
}

// ======================= UI HELPERS =======================
function updateUI() {
    document.getElementById("lbl-level").innerText = currentLevelIndex + 1;
    document.getElementById("lbl-score").innerText = currentScore;
    document.getElementById("lbl-points").innerText = totalTimeBonus;
    document.getElementById("lbl-errors").innerText = errors;
    document.getElementById("lbl-table").innerText = LEVELS[currentLevelIndex].table;
    document.getElementById("lbl-kaiju").innerText =
        defeatedLevels.has(currentLevelIndex) ? LEVELS[currentLevelIndex].nom : "???";
    document.getElementById("burning-badge").classList.toggle("hidden", !burningMode);
}

function showCelebration(emojiSet) {
    const container = document.getElementById("game-container");
    for (let i = 0; i < 26; i++) {
        const div = document.createElement("div");
        div.innerHTML = emojiSet;
        div.style.position = "absolute";
        div.style.left = Math.random() * 100 + "%";
        div.style.top = "0px";
        div.style.fontSize = (14 + Math.random() * 22) + "px";
        div.style.animation = "confetti 1s ease-out forwards";
        div.style.pointerEvents = "none";
        div.style.zIndex = "200";
        container.appendChild(div);
        setTimeout(() => div.remove(), 1000);
    }
}

function flashPalier() {
    const el = document.getElementById("palier-flash");
    el.classList.remove("active");
    void el.offsetWidth; // relance l'animation
    el.classList.add("active");
}

// ======================= CARTE "LEÇON EXPRESS" =======================
function showHelpCard(fact, wrongVal) {
    if (activeCard) { if (cardTimeout) clearTimeout(cardTimeout); activeCard.remove(); activeCard = null; }
    const { table, factor, produit } = fact;
    const correction = `${table} × ${factor} = ${produit}`;
    const explanation = `Tu as répondu ${wrongVal}, ce n'est pas le bon résultat.`;
    const rule = getAstuce(table, factor, produit);

    const card = document.createElement("div");
    card.className = "help-card";
    card.style.right = "-420px";
    card.innerHTML = `
        <div class="card-header">
            <span>📖 Leçon express</span>
            <div class="close-card">✖</div>
        </div>
        <div class="card-body">
            <div class="correction">✅ ${correction}</div>
            <div class="explanation">${explanation}</div>
            <div class="rule">💡 ${rule}</div>
        </div>
        <div class="card-footer">Cliquez pour fermer · disparaît dans 7s</div>
    `;
    document.getElementById("game-container").appendChild(card);
    activeCard = card;
    setTimeout(() => { if (card) card.style.right = "25px"; }, 10);

    const closeCard = (e) => {
        e.stopPropagation();
        if (card && card.parentNode) card.remove();
        if (activeCard === card) activeCard = null;
        if (cardTimeout) clearTimeout(cardTimeout);
        document.removeEventListener("click", closeCard);
    };
    card.querySelector(".close-card").addEventListener("click", closeCard);
    card.addEventListener("click", closeCard);
    cardTimeout = setTimeout(() => { if (card && card.parentNode) card.remove(); if (activeCard === card) activeCard = null; }, 7000);
}

// ======================= COMBO MOTHRA =======================
// 3 bonnes réponses d'affilée en moins de 10s -> Mothra rend 1 vie
// (retire 1 au compteur d'erreurs du niveau en cours). Mécanisme
// actif à tous les niveaux (pas seulement celui de Mothra).
function registerCorrectForCombo() {
    const now = Date.now();
    comboTimestamps.push(now);
    if (comboTimestamps.length > 3) comboTimestamps.shift();
    if (comboTimestamps.length === 3 && (now - comboTimestamps[0]) <= 10000) {
        comboTimestamps = [];
        if (errors > 0) {
            errors--;
            updateUI();
            playComboChime();
            const el = document.getElementById("combo-indicator");
            el.textContent = "🦋 MOTHRA VEILLE SUR TOI ! −1 FAUTE";
            el.classList.add("show");
            setTimeout(() => el.classList.remove("show"), 1800);
            mothraFlyby = { start: performance.now(), duration: 2200 };
        }
    }
}
function registerWrongForCombo() { comboTimestamps = []; }

// ======================= BOUCLE DE JEU =======================
function nextFact() {
    if (!gameActive) return;
    if (factsPool.length === 0) {
        // pioche vide -> niveau terminé (10/10) : le kaiju apparaît en
        // entier et s'écroule avant de passer au niveau suivant.
        let bonus = stopLevelTimerAndComputeBonus();
        markLevelDefeated(currentLevelIndex);
        playBossDefeatSequence(() => {
            showCelebration("✨💥🦖");
            levelUp(bonus);
        });
        return;
    }
    currentFact = factsPool.pop();
    document.getElementById("phrase-card").innerText = `${currentFact.table} × ${currentFact.factor} = ?`;
    const opts = buildOptionsForFact(currentFact);
    cristaux = opts.map((o, i) => new Cristal(o.val, o.correct, LEVELS[currentLevelIndex].kaiju, Math.floor(Math.random() * 4)));

    // il ne reste plus que ENEMY_REVEAL_REMAINING calculs (celui-ci inclus) :
    // le kaiju apparaît derrière les pierres du décor et Godzilla passe
    // automatiquement (et reste) en mode burning jusqu'à la fin du niveau.
    if (!enemyRevealed && factsPool.length + 1 <= ENEMY_REVEAL_REMAINING) {
        enemyRevealed = true;
        forcedBurning = true;
        burningMode = true;
        updateUI();
    }
}

// Grand écran "boss vaincu" : le kaiju du niveau apparaît en entier,
// bascule et s'écroule, pour une vraie sensation de victoire.
let bossDefeat = null; // { kaijuKey, start, duration }
function playBossDefeatSequence(onDone) {
    shotLock = true;
    cristaux = [];
    initAudio();
    playImpactSound();
    const kaijuKey = LEVELS[currentLevelIndex].kaiju;
    const duration = 2800;
    bossDefeat = { kaijuKey, start: performance.now(), duration };
    setTimeout(() => {
        bossDefeat = null;
        shotLock = false;
        onDone();
    }, duration);
}

function drawBossDefeat() {
    if (!bossDefeat) return;
    const elapsed = performance.now() - bossDefeat.start;
    const t = Math.min(1, elapsed / bossDefeat.duration);
    const img = ASSETS.kaiju[bossDefeat.kaijuKey];
    const cx = canvas.width / 2, baseY = canvas.height / 2 - 20;
    // bascule tête en bas (0 -> 180°) et chute (léger déplacement vers le bas + fondu)
    const rot = t * Math.PI;
    const fall = t * 90;
    const alpha = 1 - Math.max(0, t - 0.65) / 0.35;

    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${0.45 * (1 - t * 0.5)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(cx, baseY + fall);
    ctx.rotate(rot);
    ctx.globalAlpha = Math.max(0, alpha);
    const size = 460;
    if (img) {
        ctx.drawImage(img, -size / 2, -size * (img.height / img.width) / 2, size, size * (img.height / img.width));
    } else {
        drawKaijuSilhouette(0, 0, size, 1);
    }
    ctx.restore();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.font = "bold 34px 'Bebas Neue', sans-serif";
    ctx.fillStyle = "#ffd966";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 8;
    ctx.globalAlpha = Math.min(1, t * 3);
    const nom = LEVELS[currentLevelIndex].nom;
    ctx.font = "bold 30px 'Bebas Neue', sans-serif";
    if (t < 0.55) {
        ctx.fillText(`${nom} EST VAINCU !`, cx, 60);
    } else {
        ctx.font = "bold 26px 'Bebas Neue', sans-serif";
        wrapCaptureText(`Grâce à Godzilla, MONARCH a capturé ${nom} et le ramène en prison.`, cx, 60, 780, 32);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
}

// petite fonction utilitaire pour retourner à la ligne un texte trop long
// dans le canvas (nécessaire pour la phrase de capture Monarch)
function wrapCaptureText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let ly = y;
    for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + " ";
        if (ctx.measureText(test).width > maxWidth && line !== "") {
            ctx.fillText(line, x, ly);
            line = words[i] + " ";
            ly += lineHeight;
        } else {
            line = test;
        }
    }
    ctx.fillText(line, x, ly);
}

function handleShot(x, y) {
    if (!gameActive || shotLock) return;
    for (let i = cristaux.length - 1; i >= 0; i--) {
        const c = cristaux[i];
        if (c.state !== "idle") continue;
        const dist = Math.hypot(x - c.x, y - c.y);
        if (dist < c.radius) {
            if (c.isCorrect) fireAtCristal(c); else missCristal(c);
            return;
        }
    }
}

function missCristal(c) {
    initAudio();
    playCrumbleSound();
    for (let p = 0; p < 18; p++) particles.push(new DustParticle(c.x, c.y));
    c.state = "dead";
    cristaux = cristaux.filter((cr) => cr !== c);

    errors++;
    registerWrongForCombo();
    updateUI();
    showHelpCard(currentFact, c.value);
    // le fait retourne dans la pioche pour être retenté plus tard
    factsPool.unshift(currentFact);
    factsPool = shuffle(factsPool);

    if (errors >= 5) {
        stopLevelTimerAndComputeBonus();
        gameActive = false;
        showGameOver();
    } else {
        nextFact();
    }
}

function fireAtCristal(c) {
    shotLock = true; // les clics sont verrouillés pendant l'animation du rayon
    initAudio();
    playBeamSound();
    godzillaMouthOpen = true;
    const mouth = getMouthPosition();
    const palier = LEVELS[currentLevelIndex].palier;
    const hue = burningMode ? 18 : PALIER_TINT[palier].particle[0];
    beam = { x1: mouth.x, y1: mouth.y, x2: c.x, y2: c.y, progress: 0, hue };

    const beamDuration = 260; // ms
    const start = performance.now();
    function animateBeam(t) {
        const p = Math.min(1, (t - start) / beamDuration);
        beam.progress = easeOutQuad(p);
        if (p < 1) {
            requestAnimationFrame(animateBeam);
        } else {
            impactCristal(c, hue);
        }
    }
    requestAnimationFrame(animateBeam);
}

function easeOutQuad(t) { return 1 - (1 - t) * (1 - t); }

function impactCristal(c, hue) {
    playImpactSound();
    c.state = "cracking"; c.stateT = 0;
    for (let p = 0; p < 14; p++) particles.push(new Particle(c.x, c.y, hue));
    setTimeout(() => {
        if (c.state === "dead") return;
        c.state = "revealing"; c.stateT = 0;
        setTimeout(() => {
            for (let p = 0; p < 30; p++) particles.push(new Particle(c.x, c.y, hue));
            c.state = "dead";
            cristaux = cristaux.filter((cr) => cr !== c);
            beam = null;
            godzillaMouthOpen = false;
            shotLock = false;

            currentScore++;
            if (burningMode) {
                totalTimeBonus += BURNING_KILL_BONUS;
                spawnBurningBonusPopup(c.x, c.y);
            }
            registerCorrectForCombo();
            updateUI();
            if (currentScore >= 10) {
                nextFact(); // déclenchera la fin de niveau (pioche vide)
            } else {
                nextFact();
            }
        }, 550);
    }, 220);
}

// ======================= CHRONO / BONUS =======================
function startLevelTimer() {
    if (chronoInterval) clearInterval(chronoInterval);
    levelStartTime = Date.now();
    chronoInterval = setInterval(() => {
        if (gameActive && currentScore < 10) {
            currentLevelTime = (Date.now() - levelStartTime) / 1000;
            document.getElementById("chrono-box").innerHTML = `⏱️ ${currentLevelTime.toFixed(1)}s`;
        }
    }, 100);
}
function stopLevelTimerAndComputeBonus() {
    if (chronoInterval) clearInterval(chronoInterval);
    const finalTime = currentLevelTime;
    const bonus = finalTime <= 8 ? 100 : finalTime <= 12 ? 70 : finalTime <= 18 ? 45 : finalTime <= 25 ? 25 : 10;
    const penalty = errors * 5;
    let levelBonus = Math.max(0, bonus - penalty);

    // pendant le burning, le bonus de fin de niveau est majoré (voir BURNING_LEVEL_BONUS_MULTIPLIER)
    if (burningMode) levelBonus = Math.round(levelBonus * BURNING_LEVEL_BONUS_MULTIPLIER);
    totalTimeBonus += levelBonus;
    updateUI();

    // mode burning : niveaux rapides enchaînés (voir BURNING_TIME_THRESHOLD).
    // La durée accordée dépend de l'écart ("gap") entre le temps réalisé et le seuil :
    // plus on est rapide, plus le mode dure longtemps une fois activé/relancé.
    if (finalTime <= BURNING_TIME_THRESHOLD && errors === 0) {
        burningStreak++;
        masteryPoints++; saveMasteryPoints(); // chaque niveau rapide/propre fait progresser la maîtrise
        if (burningStreak >= getBurningStreakNeeded()) {
            const gap = BURNING_TIME_THRESHOLD - finalTime;
            const duration = getBurningDuration(gap >= BURNING_GAP_BIG);
            burningMode = true;
            burningExpiresAt = performance.now() + duration; // relance le décompte à chaque niveau rapide/propre
        }
    } else {
        // un niveau raté/lent casse la série, mais on laisse le burning déjà acquis
        // s'éteindre naturellement (à son échéance) plutôt que de le couper net —
        // pour ne jamais punir brutalement une petite erreur.
        burningStreak = 0;
    }

    return levelBonus;
}

// à appeler chaque frame : éteint le mode burning une fois son délai écoulé
function updateBurningTimeout() {
    if (burningMode && !forcedBurning && performance.now() >= burningExpiresAt) {
        burningMode = false;
        const badge = document.getElementById("burning-badge");
        if (badge) badge.classList.add("hidden");
    }
}

// ======================= NIVEAUX =======================
function levelUp(bonus) {
    showCelebration(`+${bonus}pts !`);
    const completedIndex = currentLevelIndex;
    const prevPalier = LEVELS[currentLevelIndex].palier;
    currentLevelIndex++;
    if (currentLevelIndex >= LEVELS.length) {
        gameActive = false;
        showVictory();
        return;
    }
    currentScore = 0; errors = 0; comboTimestamps = [];
    playFanfare();
    if (LEVELS[currentLevelIndex].palier !== prevPalier) flashPalier();
    gameActive = false;
    showLevelCompleteScreen(completedIndex, bonus);
}

// Écran intermédiaire de fin de niveau : au lieu d'enchaîner automatiquement,
// on laisse le joueur choisir entre continuer, recommencer ou retourner au menu.
function showLevelCompleteScreen(completedIndex, bonus) {
    const nom = LEVELS[completedIndex].nom;
    const nextNom = LEVELS[currentLevelIndex].nom; // reste "???" si jamais vaincu, géré côté affichage
    const nextKnown = defeatedLevels.has(currentLevelIndex);
    document.getElementById("lvl-complete-title").innerHTML = `✅ ${nom} CAPTURÉ !`;
    document.getElementById("lvl-complete-desc").innerHTML =
        `Bonus de ce niveau : +${bonus} points ⚡<br>` +
        `Prochain défi : ${nextKnown ? nextNom : "un nouveau kaiju mystère"} (table de ${LEVELS[currentLevelIndex].table}).`;

    document.getElementById("btn-lvl-next").onclick = () => {
        document.getElementById("level-complete-screen").classList.add("hidden");
        gameActive = true;
        initLevel();
    };
    document.getElementById("btn-lvl-retry").onclick = () => {
        document.getElementById("level-complete-screen").classList.add("hidden");
        currentLevelIndex = completedIndex;
        currentScore = 0; errors = 0; comboTimestamps = [];
        gameActive = true;
        initLevel();
    };
    document.getElementById("btn-lvl-menu").onclick = () => {
        document.getElementById("level-complete-screen").classList.add("hidden");
        goToMenu();
    };

    document.getElementById("level-complete-screen").classList.remove("hidden");
}

function initLevel() {
    updateUI();
    factsPool = shuffle(buildFactsPool(LEVELS[currentLevelIndex].table));
    currentLevelTime = 0;
    cristaux = [];
    beam = null;
    godzillaMouthOpen = false;
    shotLock = false;
    enemyRevealed = false;
    forcedBurning = false;
    startLevelTimer();
    if (defeatedLevels.has(currentLevelIndex)) {
        // niveau déjà vaincu (on le rejoue) : petite phrase de rappel avant
        // la première question, plutôt que de révéler le nom directement.
        const nom = LEVELS[currentLevelIndex].nom;
        document.getElementById("phrase-card").innerText = `${nom} s'est échappé de sa prison, aide Monarch à le recapturer !`;
        setTimeout(nextFact, 2200);
    } else {
        nextFact();
    }
}

function retryCurrentLevel() {
    if (activeCard) { activeCard.remove(); activeCard = null; }
    if (cardTimeout) clearTimeout(cardTimeout);
    document.getElementById("end-screen").classList.add("hidden");
    currentScore = 0; errors = 0; comboTimestamps = [];
    gameActive = true;
    victoryFireworks = false; fireworks = []; particles = []; floatingTexts = [];
    initLevel();
}

function restartFromLevel1() {
    currentLevelIndex = 0;
    startGame();
}

// Lance directement un niveau déjà vaincu (rejouable depuis l'accueil pour
// augmenter son score), sans repasser par les niveaux précédents.
function playSpecificLevel(idx) {
    if (idx < 0 || idx >= LEVELS.length) return;
    if (activeCard) { activeCard.remove(); activeCard = null; }
    if (cardTimeout) clearTimeout(cardTimeout);
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.add("hidden");
    currentLevelIndex = idx;
    currentScore = 0; errors = 0; comboTimestamps = [];
    // le mode burning ne se transporte pas d'une session de rejeu à l'autre
    burningStreak = 0; burningMode = false; burningExpiresAt = 0;
    victoryFireworks = false; fireworks = []; particles = []; floatingTexts = [];
    gameActive = true;
    updateUI();
    initLevel();
    if (!animationId) animationId = requestAnimationFrame(gameLoop);
}

// Retour à l'écran d'accueil depuis l'écran de fin, pour choisir un niveau
// déjà vaincu à rejouer (sans forcer un redémarrage complet).
function goToMenu() {
    document.getElementById("end-screen").classList.add("hidden");
    renderLevelsTrack();
    updateStartButtonLabel();
    document.getElementById("start-screen").classList.remove("hidden");
}

function updateStartButtonLabel() {
    const btn = document.getElementById("btn-start");
    if (!btn) return;
    const frontier = getFrontierLevelIndex();
    btn.textContent = `🦖 Affronter le niveau ${frontier + 1}`;
    btn.dataset.frontier = frontier;
}

// Construit les pastilles de niveau de l'écran d'accueil : "?" pour les
// kaijus jamais vaincus (inconnus), nom + vignette révélée pour les kaijus
// déjà vaincus (cliquables pour rejouer et augmenter le score).
function renderLevelsTrack() {
    const track = document.getElementById("levels-track");
    if (!track) return;
    track.innerHTML = "";
    const frontier = getFrontierLevelIndex();
    LEVELS.forEach((lvl, i) => {
        const known = defeatedLevels.has(i);
        const isNext = i === frontier;
        const isLocked = !known && !isNext;
        const chip = document.createElement("div");
        chip.className = "level-chip" + (known ? " known" : isLocked ? " locked" : " next");

        const thumb = document.createElement("div");
        thumb.className = "chip-thumb";
        if (known && ASSETS.ready && ASSETS.kaiju[lvl.kaiju]) {
            const mini = document.createElement("canvas");
            mini.width = 56; mini.height = 56;
            const mctx = mini.getContext("2d");
            const img = ASSETS.kaiju[lvl.kaiju];
            const s = Math.max(56 / img.width, 56 / img.height);
            const w = img.width * s, h = img.height * s;
            mctx.drawImage(img, (56 - w) / 2, (56 - h) / 2, w, h);
            thumb.appendChild(mini);
        } else {
            thumb.textContent = isLocked ? "🔒" : "❓";
        }

        const label = document.createElement("div");
        label.className = "chip-label";
        label.textContent = known
            ? `${i + 1}. ×${lvl.table} — ${lvl.nom}`
            : isLocked
                ? `${i + 1}. ×${lvl.table} — verrouillée`
                : `${i + 1}. ×${lvl.table} — ???`;

        chip.appendChild(thumb);
        chip.appendChild(label);

        if (known) {
            chip.title = `Rejouer ${lvl.nom} (×${lvl.table}) pour améliorer ton score`;
            chip.addEventListener("click", () => playSpecificLevel(i));
        } else if (isNext) {
            chip.title = "Prochain défi — clique ici ou sur le bouton pour l'affronter";
            chip.addEventListener("click", () => playSpecificLevel(i));
        } else {
            chip.title = `Verrouillée — bats le niveau ${i} pour débloquer cette table`;
        }
        track.appendChild(chip);
    });
}

// ======================= ÉCRANS =======================
function showGameOver() {
    document.getElementById("end-title").innerHTML = "💥 ATTAQUE REPOUSSÉE";
    document.getElementById("end-desc").innerHTML =
        `${LEVELS[currentLevelIndex].nom} a résisté ! 5 erreurs sur la table de ${LEVELS[currentLevelIndex].table}.<br>` +
        `Bonus cumulé : ${totalTimeBonus} points ⚡<br>Retente ce niveau, Godzilla compte sur toi.`;
    document.getElementById("btn-retry-level").classList.remove("hidden");
    document.getElementById("btn-restart-all").classList.remove("hidden");
    document.getElementById("btn-play-again").classList.add("hidden");
    document.getElementById("btn-menu").classList.remove("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
}

function showVictory() {
    victoryFireworks = true;
    playVictory();
    for (let i = 0; i < 18; i++) {
        setTimeout(() => fireworks.push(new Firework(Math.random() * canvas.width, Math.random() * (canvas.height - 150) + 100)), i * 180);
    }
    showCelebration("🏆🦖✨");
    document.getElementById("end-title").innerHTML = "🏆 TOUS LES KAIJUS SONT VAINCUS";
    document.getElementById("end-desc").innerHTML =
        `Bravo, Maître des Tables ! Tu as dominé les tables de 2 à 9.<br>Bonus rapidité cumulé : ${totalTimeBonus} points ! 🏆`;
    document.getElementById("btn-retry-level").classList.add("hidden");
    document.getElementById("btn-restart-all").classList.add("hidden");
    document.getElementById("btn-play-again").classList.remove("hidden");
    document.getElementById("btn-menu").classList.remove("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
}

function startGame() {
    if (activeCard) { activeCard.remove(); activeCard = null; }
    if (cardTimeout) clearTimeout(cardTimeout);
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.add("hidden");
    currentScore = 0; errors = 0; totalTimeBonus = 0; comboTimestamps = [];
    burningStreak = 0; burningMode = false; burningExpiresAt = 0;
    victoryFireworks = false; fireworks = []; particles = []; floatingTexts = [];
    gameActive = true;
    updateUI();
    initLevel();
    if (!animationId) animationId = requestAnimationFrame(gameLoop);
}

// ======================= BOUCLE DE RENDU =======================
function gameLoop() {
    updateBurningTimeout();
    drawBackground();
    if (gameActive) drawEnemyPeeking();

    if (gameActive || cristaux.length) {
        for (const c of cristaux) { if (gameActive) c.update(); c.draw(); }
    }

    drawGodzilla();
    if (beam) drawBeam();
    if (mothraFlyby) drawMothraFlyby();
    if (bossDefeat) drawBossDefeat();

    if (victoryFireworks && fireworks.length) {
        for (let i = fireworks.length - 1; i >= 0; i--) if (!fireworks[i].update()) fireworks.splice(i, 1); else fireworks[i].draw();
    }
    for (let i = particles.length - 1; i >= 0; i--) if (!particles[i].update()) particles.splice(i, 1); else particles[i].draw();
    for (let i = floatingTexts.length - 1; i >= 0; i--) if (!floatingTexts[i].update()) floatingTexts.splice(i, 1); else floatingTexts[i].draw();

    // viseur (dessiné aussi en canvas pour rester visible au-dessus du décor)
    ctx.beginPath(); ctx.arc(mouseXPos, mouseYPos, 14, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,120,60,0.7)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(mouseXPos, mouseYPos, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,120,60,0.2)"; ctx.fill();

    animationId = requestAnimationFrame(gameLoop);
}

// ======================= ÉVÉNEMENTS =======================
const cursorDiv = document.getElementById("custom-cursor");
document.addEventListener("mousemove", (e) => {
    if (cursorDiv) { cursorDiv.style.left = e.clientX + "px"; cursorDiv.style.top = e.clientY + "px"; }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    mouseXPos = (e.clientX - rect.left) * scaleX;
    mouseYPos = (e.clientY - rect.top) * scaleY;
});
document.body.style.cursor = "none";

canvas.addEventListener("mousedown", (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    let mx = (e.clientX - rect.left) * scaleX;
    let my = (e.clientY - rect.top) * scaleY;
    mx = Math.min(Math.max(5, mx), canvas.width - 5);
    my = Math.min(Math.max(SAFE_TOP + 10, my), canvas.height - 5);
    handleShot(mx, my);
});

// ======================= RÉGLAGES (chrono affiché ou non) =======================
// Masqué par défaut pour ne pas ajouter de pression chronométrée visible ;
// l'enseignant ou l'élève peut le réactiver via le petit engrenage ⚙️.
const CHRONO_VISIBLE_KEY = "gmt_chrono_visible_v1";
function loadChronoVisible() {
    try { return localStorage.getItem(CHRONO_VISIBLE_KEY) === "1"; } catch (e) { return false; }
}
function saveChronoVisible(v) {
    try { localStorage.setItem(CHRONO_VISIBLE_KEY, v ? "1" : "0"); } catch (e) { /* tant pis */ }
}
function applyChronoVisible(v) {
    document.getElementById("chrono-box").classList.toggle("hidden-by-setting", !v);
}
let chronoVisible = loadChronoVisible();
applyChronoVisible(chronoVisible);
document.getElementById("chk-show-chrono").checked = chronoVisible;
document.getElementById("chk-show-chrono").addEventListener("change", (e) => {
    chronoVisible = e.target.checked;
    saveChronoVisible(chronoVisible);
    applyChronoVisible(chronoVisible);
});
document.getElementById("settings-btn").addEventListener("click", () => {
    document.getElementById("settings-panel").classList.toggle("hidden");
});

// ======================= PARC DES KAIJUS DE MONARCH =======================
// silhouette de secours pour une cellule dont le kaiju n'est pas encore vaincu
// (variante utilisable avec n'importe quel contexte canvas, pas seulement le
// canvas principal du jeu — voir drawKaijuSilhouette pour la version de jeu)
function drawMysterySilhouette(pctx, x, y, size) {
    pctx.save();
    pctx.globalAlpha = 0.8;
    pctx.fillStyle = "#0d0a12";
    pctx.beginPath();
    pctx.ellipse(x, y + size * 0.12, size * 0.3, size * 0.36, 0, 0, Math.PI * 2);
    pctx.fill();
    pctx.beginPath();
    pctx.ellipse(x - size * 0.1, y - size * 0.26, size * 0.2, size * 0.18, -0.3, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
    pctx.font = `bold ${Math.floor(size * 0.3)}px 'Bebas Neue', sans-serif`;
    pctx.fillStyle = "#ffb347";
    pctx.textAlign = "center"; pctx.textBaseline = "middle";
    pctx.fillText("?", x, y);
}

// Dessine la scène complète d'une cellule de prison sur un canvas donné :
// 1) décor de prison en arrière-plan (cover-fit)
// 2) le kaiju (image réelle si vaincu, silhouette "?" sinon) au centre
// 3) les barreaux détourés en premier plan (cover-fit), par-dessus tout
function drawPrisonCell(pctx, size, kaijuKey, known) {
    // 1) fond de cellule
    if (ASSETS.decorPrison) {
        const img = ASSETS.decorPrison;
        const s = Math.max(size / img.width, size / img.height);
        const w = img.width * s, h = img.height * s;
        pctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    } else {
        pctx.fillStyle = "#0c0a10";
        pctx.fillRect(0, 0, size, size);
    }
    // voile sombre pour la lisibilité
    pctx.fillStyle = "rgba(0,0,0,0.28)";
    pctx.fillRect(0, 0, size, size);

    // 2) le kaiju capturé
    const cx = size / 2, cy = size / 2 + size * 0.04;
    if (known && ASSETS.kaiju[kaijuKey]) {
        const img = ASSETS.kaiju[kaijuKey];
        const kw = size * 0.72, kh = kw * (img.height / img.width);
        pctx.drawImage(img, cx - kw / 2, cy - kh / 2, kw, kh);
    } else if (!known) {
        drawMysterySilhouette(pctx, cx, cy, size * 0.6);
    }

    // 3) barreaux en premier plan
    if (ASSETS.barreauxPrison) {
        const img = ASSETS.barreauxPrison;
        const s = Math.max(size / img.width, size / img.height);
        const w = img.width * s, h = img.height * s;
        pctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    } else {
        // secours : quelques barreaux dessinés en code si l'image manque encore
        pctx.save();
        pctx.strokeStyle = "rgba(210,210,220,0.9)";
        pctx.lineWidth = size * 0.045;
        for (let i = 1; i <= 5; i++) {
            const bx = (size / 6) * i;
            pctx.beginPath(); pctx.moveTo(bx, 0); pctx.lineTo(bx, size); pctx.stroke();
        }
        pctx.restore();
    }
}

function renderParkScreen() {
    const grid = document.getElementById("park-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const CELL_SIZE = 200;
    LEVELS.forEach((lvl, i) => {
        const known = defeatedLevels.has(i);
        const cell = document.createElement("div");
        cell.className = "park-cell" + (known ? "" : " locked");

        const thumb = document.createElement("div");
        thumb.className = "cell-thumb";
        const mini = document.createElement("canvas");
        mini.width = CELL_SIZE; mini.height = CELL_SIZE;
        drawPrisonCell(mini.getContext("2d"), CELL_SIZE, lvl.kaiju, known);
        thumb.appendChild(mini);

        const name = document.createElement("div");
        name.className = "cell-name";
        name.textContent = known ? lvl.nom : "???";

        cell.appendChild(thumb);
        cell.appendChild(name);
        grid.appendChild(cell);
    });
}

document.getElementById("btn-park").addEventListener("click", () => {
    renderParkScreen();
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("park-screen").classList.remove("hidden");
});
document.getElementById("btn-park-back").addEventListener("click", () => {
    document.getElementById("park-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
});

document.getElementById("btn-rules").addEventListener("click", () => {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("rules-screen").classList.remove("hidden");
});
document.getElementById("btn-rules-back").addEventListener("click", () => {
    document.getElementById("rules-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
});

document.getElementById("btn-medals").addEventListener("click", () => {
    renderMedalsGallery();
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("medals-screen").classList.remove("hidden");
});
document.getElementById("btn-medals-back").addEventListener("click", () => {
    document.getElementById("medals-screen").classList.add("hidden");
    document.getElementById("start-screen").classList.remove("hidden");
});

// ======================= MISE À L'ÉCHELLE (iPad / Surface / tablettes) =======================
// Calcule le facteur d'échelle pour que le jeu (dessiné à taille fixe 1100x700)
// tienne toujours dans la fenêtre, quel que soit l'écran, sans jamais être
// agrandi au-delà de sa taille native (pas de flou).
function fitGameToViewport() {
    const wrapper = document.getElementById("game-wrapper");
    const container = document.getElementById("game-container");
    if (!wrapper || !container) return;
    const margin = 24;
    const availW = window.innerWidth - margin;
    const availH = window.innerHeight - margin;
    const scale = Math.min(availW / 1100, availH / 700, 1);
    container.style.transform = `scale(${scale})`;
    wrapper.style.width = Math.round(1100 * scale + 16) + "px";
    wrapper.style.height = Math.round(700 * scale + 16) + "px";
}
window.addEventListener("resize", fitGameToViewport);
window.addEventListener("orientationchange", () => setTimeout(fitGameToViewport, 250));
fitGameToViewport();

document.getElementById("btn-start").addEventListener("click", () => {
    currentLevelIndex = getFrontierLevelIndex();
    startGame();
});
document.getElementById("btn-retry-level").addEventListener("click", retryCurrentLevel);
document.getElementById("btn-restart-all").addEventListener("click", restartFromLevel1);
document.getElementById("btn-play-again").addEventListener("click", restartFromLevel1);
document.getElementById("btn-menu").addEventListener("click", goToMenu);

// ======================= INIT =======================
window.onload = () => {
    const loadingLabel = document.getElementById("loading-label");
    currentLevelIndex = getFrontierLevelIndex();
    renderLevelsTrack();
    updateStartButtonLabel();
    preloadAllAssets(() => {
        if (loadingLabel) loadingLabel.classList.add("hidden");
        document.getElementById("btn-start").disabled = false;
        drawStartScreenBackdrop();
        renderLevelsTrack(); // relance avec les vraies vignettes désormais chargées
    });
};

function drawStartScreenBackdrop() {
    const img = ASSETS.decorStart;
    if (img) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    } else {
        ctx.fillStyle = "#0a0e18";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (ASSETS.mothra) {
        const w = 300, h = w * (ASSETS.mothra.height / ASSETS.mothra.width);
        ctx.drawImage(ASSETS.mothra, canvas.width - w - 60, 90, w, h);
    }
}
