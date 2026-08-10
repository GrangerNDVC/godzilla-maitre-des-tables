/* ============================================================
   GODZILLA : PROTOCOLE TITAN — moteur de jeu
   Homophones grammaticaux (leçons 1 et 3 du fascicule "Groupe de
   besoins 6ème") racontés comme un affrontement du Monsterverse :
   d'anciens agents d'Apex Cybernetics libèrent des Titans, Monarch
   envoie Godzilla les neutraliser.
   ============================================================ */

// ======================= CONFIG NIVEAUX =======================
// Chaque niveau = un duo d'homophones + un chapitre de l'histoire.
// pairWords : les mots proposés sur les cristaux.
// sentences : phrases du combat, DANS L'ORDRE DU RÉCIT (jamais
// mélangées, sinon l'histoire perd son sens d'une phrase à l'autre).
const LEVELS = [
    {
        kaiju: "mothra",
        nom: "Mothra",
        decor: "decors_1.jpg",
        palier: 1,
        pairWords: ["a", "à"],
        pairLabel: "à / a",
        astuce: "Remplace le mot par « avait » : si la phrase garde son sens, c'est a (le verbe avoir). Sinon, c'est à (la préposition, qui ne change jamais).",
        chapterTitle: "Une alerte sur l'île Infant",
        chapterIntro: "Aux abords de l'île Infant, un capteur sismique de Monarch s'affole en pleine nuit. Depuis des années, Mothra veille sur ce sanctuaire sans jamais en sortir — mais cette fois, quelque chose l'a réveillée, et ce n'est pas naturel. Monarch n'a qu'une solution : envoyer Godzilla avant que la panique n'atteigne les côtes habitées.",
        victoryBeat: "Le boîtier détruit, Mothra retrouve son calme et s'envole vers les nuages, comme pour remercier Godzilla d'un battement d'aile. À terre, les techniciens de Monarch récupèrent les restes de l'appareil : un numéro de série, à moitié fondu, mais lisible. L'enquête ne fait que commencer.",
        retryVariants: [
            "Un nuage de spores phosphorescentes aveugle Godzilla une seconde de trop : Mothra s'échappe dans la brume et retourne se cacher près de la grotte. Il va falloir la retrouver.",
            "Le boîtier crépite encore et brouille les capteurs de Godzilla : Mothra, toujours sous influence, plonge dans les vagues et disparaît. Le combat doit reprendre depuis le début.",
        ],
        sentences: [
            { before: "Un capteur sismique ", correct: "a", after: " enregistré une secousse inhabituelle près de l'île Infant." },
            { before: "L'anomalie provient d'une grotte ", correct: "à", after: " flanc de la falaise, là où dort Mothra." },
            { before: "Or, la déesse-insecte n'", correct: "a", after: " plus quitté son sanctuaire depuis des mois." },
            { before: "Cette nuit, un éclair électrique bleuté ", correct: "a", after: " jailli du fond de la grotte." },
            { before: "Prise de panique, Mothra fonce ", correct: "à", after: " tire-d'aile vers le village voisin." },
            { before: "Monarch envoie aussitôt un message codé ", correct: "à", after: " Godzilla, seul assez puissant pour la calmer." },
            { before: "Il plonge sans hésiter et nage ", correct: "à", after: " pleine puissance vers l'île." },
            { before: "Sous un rocher fendu, il découvre un boîtier qui n'", correct: "a", after: " rien de naturel." },
        ],
    },
    {
        kaiju: "rodan",
        nom: "Rodan",
        decor: "decors_2.jpg",
        palier: 2,
        pairWords: ["ou", "où"],
        pairLabel: "ou / où",
        astuce: "Remplace le mot par « ou bien » : si la phrase garde son sens, c'est ou (qui relie deux choix). Sinon, c'est où (un lieu ou une question).",
        chapterTitle: "La piste de l'archipel volcanique",
        chapterIntro: "Le numéro de série gravé sur le boîtier de Mothra renvoie à un fournisseur discret basé près d'un archipel volcanique — là où, justement, Rodan sommeille depuis des décennies. Avant même que Monarch n'ait localisé l'entrepôt exact, une colonne de fumée noire s'élève au-dessus du cratère : le fournisseur d'armes a déjà un nouveau client, et Rodan vient de se réveiller en hurlant.",
        victoryBeat: "Libéré de l'appareil qui le rendait fou de rage, Rodan incline la tête devant Godzilla — un geste de soumission que Monarch connaît bien depuis leur premier affrontement. Mais dans l'entrepôt encore fumant, les agents découvrent des plans qui ne parlent plus de simples émetteurs : il est question d'« augmentation biomécanique ».",
        retryVariants: [
            "Une explosion de cendres volcaniques masque sa fuite : Rodan replonge dans le cratère fumant avant que Godzilla ne puisse l'atteindre.",
            "Rodan profite d'un courant ascendant brûlant pour s'élever hors de portée. Il faudra l'attirer à nouveau au sol.",
        ],
        sentences: [
            { before: "Personne ne sait encore ", correct: "où", after: " Rodan a établi son nouveau nid depuis son réveil." },
            { before: "Est-ce sur un pic isolé ", correct: "ou", after: " dans une caldeira profonde qu'il s'est réfugié ?" },
            { before: "Les vibrations proviennent-elles d'un appareil ", correct: "ou", after: " d'un phénomène naturel ?" },
            { before: "Un analyste de Monarch cherche ", correct: "où", after: " le boîtier de Mothra a été fabriqué." },
            { before: "Le numéro de série mène à un entrepôt, mais ", correct: "où", after: " se trouve-t-il exactement ?" },
            { before: "Doit-il attaquer par les airs ", correct: "ou", after: " foncer directement dans le cratère ?" },
            { before: "Impossible de savoir ", correct: "où", after: " Rodan va frapper ensuite." },
            { before: "Va-t-il falloir raisonner Rodan ", correct: "ou", after: " le combattre de force ?" },
        ],
    },
    {
        kaiju: "gigan",
        nom: "Gigan",
        decor: "decors_5.jpg",
        palier: 3,
        pairWords: ["son", "sont"],
        pairLabel: "son / sont",
        astuce: "Remplace le mot par « étaient » : si la phrase garde son sens, c'est sont (le verbe être). Sinon, c'est son (comme sa ou ses), toujours suivi d'un nom.",
        chapterTitle: "Le prototype d'Apex",
        chapterIntro: "Le mot « augmentation » glace le sang des analystes de Monarch : ces plans ressemblent à ceux, classés secret-défense, du programme Mechagodzilla — officiellement enterré depuis le désastre de Hong Kong. Deux anciens ingénieurs d'Apex Cybernetics, disparus des radars depuis des années, semblent en être les auteurs. Leur premier « prototype » vient de surgir dans une métropole côtière : un titan bardé de lames et de plaques de métal que la presse surnomme déjà Gigan.",
        victoryBeat: "Gigan s'effondre parmi les décombres, ses systèmes hors service. En fouillant l'épave, un agent de Monarch découvre un détail troublant : les autorisations d'accès au site de test remontent... à l'intérieur même de Monarch. Quelqu'un, en interne, couvre les deux ingénieurs depuis le début.",
        retryVariants: [
            "Ses lames rétractables tranchent un pan d'immeuble : Gigan s'enfuit dans le nuage de poussière avant que Godzilla ne referme la prise.",
            "Ses réacteurs dorsaux crachent un jet brûlant : Gigan s'échappe par les airs, laissant Godzilla les mains vides.",
        ],
        sentences: [
            { before: "Les analystes ", correct: "sont", after: " formels : les composants du boîtier viennent d'un ancien laboratoire Apex." },
            { before: "Gigan aiguise ", correct: "son", after: " dard rétractable contre la carcasse d'un cargo échoué." },
            { before: "Deux ex-employés d'Apex ", correct: "sont", after: " à l'origine du programme d'augmentation." },
            { before: "Le blindage de Gigan reflète ", correct: "son", after: " éclat métallique sous les projecteurs de la ville." },
            { before: "Les preuves ", correct: "sont", after: " accablantes : quelqu'un, au sein de Monarch, a couvert ces essais." },
            { before: "Godzilla évite de justesse ", correct: "son", after: " premier coup de faux et riposte aussitôt." },
            { before: "Les stabilisateurs de Gigan ", correct: "sont", after: " à bout de charge après ce combat prolongé." },
            { before: "Vaincu, Gigan replie ", correct: "son", after: " bras articulé et s'effondre sur les décombres." },
        ],
    },
    {
        kaiju: "mechagodzilla",
        nom: "Mechagodzilla",
        decor: "decors_4.jpg",
        palier: 4,
        pairWords: ["on", "ont", "on n'"],
        pairLabel: "on / ont",
        astuce: "Remplace le mot par « avaient » : si la phrase garde son sens, c'est ont (le verbe avoir). Sinon, c'est on (qu'on peut remplacer par il). Devant une négation qui commence par une voyelle, cela donne on n' — comme dans « on n'a pas vu ».",
        chapterTitle: "Le fantôme d'Apex",
        chapterIntro: "La taupe est démasquée à temps — mais trop tard pour empêcher l'inévitable. Sous une ancienne base futuriste d'Apex Cybernetics, un fragment du crâne de Ghidorah, cru détruit depuis des années, a servi de cœur à une nouvelle machine. Mechagodzilla se relève, plus silencieux et plus rapide que jamais. Depuis leurs derniers combats, Godzilla accumule de l'énergie dans ses écailles : cette fois, il ne pourra pas se contenter de briser un boîtier. Il va devoir puiser dans toutes ses forces.",
        victoryBeat: "Dans un dernier assaut incandescent, Godzilla perce le blindage de Mechagodzilla et met fin à des années de mensonges. La division fantôme d'Apex Cybernetics est démantelée, la taupe arrêtée. Sur l'île Infant, loin des caméras, Mothra observe le ciel s'éclaircir — et quelque chose dans son regard semble dire que cette histoire n'est pas tout à fait terminée.",
        retryVariants: [
            "Un bouclier d'urgence encaisse le coup final : Mechagodzilla recule dans l'ombre de la base, ses systèmes déjà en train de se réparer.",
            "Une décharge électromagnétique aveugle un instant les capteurs de Godzilla : Mechagodzilla profite de la confusion pour se replier plus profondément sous la base.",
        ],
        sentences: [
            { before: "Un rapport confidentiel confirme qu'", correct: "on", after: " détecte une signature thermique anormale sous l'ancien complexe Apex." },
            { before: "Les archives d'Apex ", correct: "ont", after: " été scellées après le scandale de Hong Kong." },
            { before: "D'après le dossier, ", correct: "on n'", after: "a jamais retrouvé les plans complets du prototype." },
            { before: "Deux ingénieurs ", correct: "ont", after: " repris en secret les recherches abandonnées." },
            { before: "Au sein de Monarch, ", correct: "on", after: " pensait le programme Mechagodzilla définitivement arrêté." },
            { before: "Les capteurs de Monarch ", correct: "ont", after: " localisé une activité électrique sous la base." },
            { before: "Jusqu'ici, ", correct: "on n'", after: "imaginait pas qu'un fragment du crâne de Ghidorah avait survécu." },
            { before: "Dans les couloirs de Monarch, ", correct: "on", after: " raconte que la machine s'est réveillée seule, sans commande humaine." },
        ],
    },
];

// Couleur du rayon / halo par palier (une couleur par chapitre)
const PALIER_TINT = {
    1: { glow: "#8fdcff", particle: [190, 60] },  // blanc-bleu
    2: { glow: "#4aa8ff", particle: [205, 70] },  // bleu intense
    3: { glow: "#a066ff", particle: [265, 70] },  // bleu-violet
    4: { glow: "#ff6a2e", particle: [15, 85] },   // rouge-orangé incandescent
};

// Mode "Burning" (Godzilla Évolué) : rose/magenta, comme dans
// Godzilla x Kong: The New Empire (2024) après absorption de
// radiations. Déclenché par la VITESSE de réponse, pas par le palier.
const BURNING_TINT = { glow: "#ff2fb0", particle: [322, 90] };
const BURNING_WINDOW = 3;        // nb de bonnes réponses consécutives prises en compte
const BURNING_THRESHOLD_SEC = 6; // temps moyen (s) sous lequel le mode s'active
const BURNING_BONUS_POINTS = 5;  // bonus par bonne réponse pendant le mode Burning

const KAIJU_FILES = {
    mothra: "assets/kaiju_mothra.png",
    rodan: "assets/kaiju_rodan.png",
    anguirus: "assets/kaiju_anguirus.png",
    mechagodzilla: "assets/kaiju_mechagodzilla.png",
    gigan: "assets/kaiju_gigan.png",
    biollante: null,
    destroyah: null,
    ghidorah: "assets/kaiju_ghidorah.png",
};

const DECOR_FALLBACK = "assets/decors_1_bis.jpg";

// ======================= CHARGEMENT + CHROMA KEY =======================
// Toutes les images "personnages" sont sur fond bleu pur #0000FF,
// détourées automatiquement au chargement (inchangé par rapport à
// la version tables de multiplication).
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
                const blueness = b - Math.max(r, g);
                if (b > 140 && blueness > 60) {
                    const alpha = Math.max(0, 1 - blueness / 170);
                    px[i + 3] = Math.min(px[i + 3], Math.round(alpha * 255));
                    if (px[i + 3] > 0) {
                        px[i + 2] = Math.min(b, Math.max(r, g) + 25);
                    }
                }
            }
            octx.putImageData(data, 0, 0);
        } catch (e) {
            console.warn("Chroma-key impossible pour", src, e);
        }
        const keyed = new Image();
        keyed.onload = () => onReady(keyed);
        keyed.src = off.toDataURL();
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

const ASSETS = {
    godzilla: null,
    godzillaOuvert: null,
    rayon: null,
    kaiju: {},
    decors: {},
    ready: false,
};

function preloadAllAssets(onAllReady) {
    let pending = 0;
    let done = 0;
    function tick() { done++; if (done >= pending) { ASSETS.ready = true; onAllReady(); } }

    pending++; loadAndKeyImage("assets/godzilla.png", (img) => { ASSETS.godzilla = img; tick(); });
    pending++; loadAndKeyImage("assets/godzilla_ouvert.png", (img) => { ASSETS.godzillaOuvert = img; tick(); });
    pending++; loadAndKeyImage("assets/rayon.png", (img) => { ASSETS.rayon = img; tick(); });

    // Ne précharge que les kaijus réellement utilisés par LEVELS. Les
    // autres clés de KAIJU_FILES restent définies pour une future
    // extension (leçons 2, 4, 5... du fascicule = d'autres chapitres).
    const neededKaiju = new Set(LEVELS.map((l) => l.kaiju));
    neededKaiju.forEach((key) => {
        const file = KAIJU_FILES[key];
        pending++;
        if (!file) { ASSETS.kaiju[key] = null; tick(); return; }
        loadAndKeyImage(file, (img) => { ASSETS.kaiju[key] = img; tick(); });
    });

    LEVELS.forEach((lvl, idx) => {
        pending++;
        loadPlainImage("assets/" + lvl.decor.replace(/^assets\//, ""), (img) => {
            ASSETS.decors[idx] = img; tick();
        }, DECOR_FALLBACK);
    });
    pending++; loadPlainImage(DECOR_FALLBACK, (img) => { ASSETS.decors.bis = img; tick(); });
}

// ======================= OUTILS =======================
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function hashString(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
}

function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

function playBurningSwell() {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.4);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    osc.start(now); osc.stop(now + 0.5);
}

// ======================= CANVAS / ÉTAT GLOBAL =======================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const SAFE_TOP = 170;   // agrandi : les phrases prennent plus de place que "6 × 7 = ?"
const SAFE_BOTTOM = 100;

let currentLevelIndex = 0;
let currentScore = 0;
let errors = 0;
let gameActive = false;
let animationId = null;
let cristaux = [];
let particles = [];
let fireworks = [];
let currentSentenceIndex = 0;
let currentFact = null;
let mouseXPos = 550, mouseYPos = 400;
let levelStartTime = 0, currentLevelTime = 0, totalTimeBonus = 0;
let chronoInterval = null;
let victoryFireworks = false;
let activeCard = null;
let cardTimeout = null;
let shotLock = false;
let pendingVictoryBonus = 0;
let chapterScreenMode = "intro"; // "intro" | "victory"
let retryAttempts = {};          // index de niveau -> nb de tentatives ratées

// combo Mothra
let comboTimestamps = [];

// mode Burning (vitesse d'exécution)
let responseTimeHistory = [];
let questionStartTime = 0;
let burningMode = false;

// beam animation state
let beam = null;
let godzillaMouthOpen = false;

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
// Affiche désormais un MOT (homophone) plutôt qu'un nombre. Le nombre
// de cristaux suit le nombre de candidats du duo (2, ou 3 pour on/ont
// + la nuance "on n'").
class Cristal {
    constructor(value, isCorrect, kaijuKey, variant = null) {
        this.value = value;
        this.isCorrect = isCorrect;
        this.kaijuKey = kaijuKey;
        this.radius = 58;
        this.state = "idle";
        this.stateT = 0;
        this.hue = 185 + Math.random() * 110;
        this.facets = this.generateFacets();
        this.fontSize = this.computeFontSize();

        let side = variant !== null ? variant : Math.floor(Math.random() * 4);
        if (side === 0) { this.x = this.radius + 5; this.y = rand(SAFE_TOP + this.radius, canvas.height - this.radius - SAFE_BOTTOM); this.vx = rand(1.0, 2.2); this.vy = rand(-0.8, 0.8); }
        else if (side === 1) { this.x = canvas.width - this.radius - 5; this.y = rand(SAFE_TOP + this.radius, canvas.height - this.radius - SAFE_BOTTOM); this.vx = -rand(1.0, 2.2); this.vy = rand(-0.8, 0.8); }
        else if (side === 2) { this.x = rand(this.radius, canvas.width - this.radius); this.y = SAFE_TOP + this.radius + 5; this.vx = rand(-0.9, 0.9); this.vy = rand(0.8, 1.4); }
        else { this.x = rand(this.radius, canvas.width - this.radius); this.y = canvas.height - this.radius - SAFE_BOTTOM - 5; this.vx = rand(-0.9, 0.9); this.vy = -rand(0.8, 1.4); }

        this.floatAngle = Math.random() * Math.PI * 2;
        this.floatSpeed = 0.02 + Math.random() * 0.015;
    }

    computeFontSize() {
        const text = String(this.value);
        const maxWidth = this.radius * 1.5;
        let size = 30;
        ctx.save();
        while (size > 14) {
            ctx.font = `bold ${size}px 'Bebas Neue', sans-serif`;
            if (ctx.measureText(text).width <= maxWidth) break;
            size -= 2;
        }
        ctx.restore();
        return size;
    }

    generateFacets() {
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
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = `rgba(255,40,30,${0.45 * revealT})`;
        ctx.fillRect(this.x - size, this.y - size, size * 2, size * 2);
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    draw() {
        if (this.state === "idle") {
            this.drawRock(1);
            ctx.save();
            ctx.font = `bold ${this.fontSize}px 'Bebas Neue', sans-serif`;
            ctx.fillStyle = "#f4fbff";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 4;
            ctx.fillText(String(this.value), this.x, this.y + 1);
            ctx.restore();
        } else if (this.state === "cracking") {
            const t = Math.min(1, this.stateT / 0.22);
            this.drawRock(1 - t * 0.5);
            this.drawCracks(t);
        } else if (this.state === "revealing") {
            const t = Math.min(1, this.stateT / 0.5);
            this.drawKaijuInside(t);
            this.drawRock(0.22);
            this.drawCracks(1);
        }
    }

    drawCracks(t) {
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${0.7 * t})`;
        ctx.lineWidth = 1.5;
        const seed = hashString(String(this.value));
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
    ctx.fillStyle = "#ff4433";
    ctx.beginPath(); ctx.arc(x - size * 0.18, y - size * 0.3, size * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
}

// ======================= DÉCOR (cover-fit) =======================
function drawBackground() {
    const img = ASSETS.decors[currentLevelIndex] || ASSETS.decors.bis;
    if (img) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale, h = img.height * scale;
        const dx = (canvas.width - w) / 2, dy = (canvas.height - h) / 2;
        ctx.drawImage(img, dx, dy, w, h);
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

// ======================= GODZILLA + RAYON =======================
const GODZILLA_DRAW_WIDTH = 430;
const GODZILLA_ANCHOR = { x: 170, y: canvas.height - 60 };
const GODZILLA_MOUTH_REL = { x: 0.175, y: 0.155 };

function godzillaDrawRect() {
    const img = godzillaMouthOpen ? ASSETS.godzillaOuvert : ASSETS.godzilla;
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

function drawGodzilla() {
    const rect = godzillaDrawRect();
    if (!rect) return;
    const safeIdx = Math.min(currentLevelIndex, LEVELS.length - 1);
    const palier = LEVELS[safeIdx].palier;
    const tint = burningMode ? BURNING_TINT : PALIER_TINT[palier];
    const pulse = burningMode ? 8 * Math.sin(Date.now() / 80) : 0;
    ctx.save();
    ctx.shadowColor = tint.glow;
    ctx.shadowBlur = (godzillaMouthOpen ? 26 : 10) + (burningMode ? 14 + pulse : 0);
    ctx.drawImage(rect.img, rect.x, rect.y, rect.w, rect.h);
    ctx.restore();
}

function drawBeam() {
    if (!beam) return;
    const { x1, y1, x2, y2, progress, hue } = beam;
    const cx = x1 + (x2 - x1) * progress;
    const cy = y1 + (y2 - y1) * progress;
    const dist = Math.hypot(cx - x1, cy - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const img = ASSETS.rayon;
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
    const lvl = LEVELS[currentLevelIndex];
    document.getElementById("lbl-level").innerText = currentLevelIndex + 1;
    document.getElementById("lbl-score").innerText = currentScore;
    document.getElementById("lbl-score-max").innerText = "/" + lvl.sentences.length;
    document.getElementById("lbl-errors").innerText = errors;
    document.getElementById("lbl-table").innerText = lvl.pairLabel;
    document.getElementById("lbl-kaiju").innerText = lvl.nom;
}

function renderSentence(fact) {
    document.getElementById("phrase-card").innerHTML =
        escapeHtml(fact.before) + '<span class="blank-gap">?</span>' + escapeHtml(fact.after);
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
    void el.offsetWidth;
    el.classList.add("active");
}

function updateBurningIndicator(justActivated) {
    const el = document.getElementById("burning-indicator");
    if (!el) return;
    if (burningMode) {
        el.classList.add("show");
        if (justActivated) playBurningSwell();
    } else {
        el.classList.remove("show");
    }
}

// ======================= CARTE "LEÇON EXPRESS" =======================
function showHelpCard(fact, wrongVal) {
    if (activeCard) { if (cardTimeout) clearTimeout(cardTimeout); activeCard.remove(); activeCard = null; }
    const correction = escapeHtml(fact.before) + "<u>" + escapeHtml(fact.correct) + "</u>" + escapeHtml(fact.after);
    const explanation = `Tu as choisi « ${escapeHtml(wrongVal)} », ce n'est pas le bon mot ici.`;
    const rule = LEVELS[currentLevelIndex].astuce;

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
// 3 bonnes réponses d'affilée en moins de 10s -> Mothra rend 1 vie.
// Reste actif à tous les chapitres : même vaincue au chapitre 1, sa
// présence protectrice continue de veiller sur Godzilla.
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
        }
    }
}
function registerWrongForCombo() { comboTimestamps = []; }

// ======================= BOUCLE DE JEU =======================
function loadCurrentSentence() {
    if (!gameActive) return;
    const lvl = LEVELS[currentLevelIndex];
    if (currentSentenceIndex >= lvl.sentences.length) {
        finishLevel();
        return;
    }
    currentFact = lvl.sentences[currentSentenceIndex];
    questionStartTime = Date.now();
    renderSentence(currentFact);
    const opts = shuffle(lvl.pairWords.map((w) => ({ val: w, correct: w === currentFact.correct })));
    cristaux = opts.map((o) => new Cristal(o.val, o.correct, lvl.kaiju, Math.floor(Math.random() * 4)));
}

function finishLevel() {
    pendingVictoryBonus = stopLevelTimerAndComputeBonus();
    showCelebration("✨💥🦖");
    showChapterVictory();
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
    responseTimeHistory = [];
    burningMode = false;
    updateBurningIndicator(false);
    updateUI();
    showHelpCard(currentFact, String(c.value));

    if (errors >= 5) {
        stopLevelTimerAndComputeBonus();
        gameActive = false;
        showGameOver();
    } else {
        // La même phrase revient : l'histoire n'avance pas tant
        // qu'elle n'est pas résolue correctement.
        loadCurrentSentence();
    }
}

function fireAtCristal(c) {
    shotLock = true;
    initAudio();
    playBeamSound();
    godzillaMouthOpen = true;

    const elapsed = (Date.now() - questionStartTime) / 1000;
    responseTimeHistory.push(elapsed);
    if (responseTimeHistory.length > BURNING_WINDOW) responseTimeHistory.shift();
    const wasBurning = burningMode;
    if (responseTimeHistory.length === BURNING_WINDOW) {
        const avg = responseTimeHistory.reduce((a, b) => a + b, 0) / responseTimeHistory.length;
        burningMode = avg <= BURNING_THRESHOLD_SEC;
    }
    updateBurningIndicator(burningMode && !wasBurning);
    if (burningMode) totalTimeBonus += BURNING_BONUS_POINTS;

    const mouth = getMouthPosition();
    const palier = LEVELS[currentLevelIndex].palier;
    const hue = burningMode ? BURNING_TINT.particle[0] : PALIER_TINT[palier].particle[0];
    beam = { x1: mouth.x, y1: mouth.y, x2: c.x, y2: c.y, progress: 0, hue };

    const beamDuration = 260;
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
            currentSentenceIndex++;
            registerCorrectForCombo();
            updateUI();
            loadCurrentSentence();
        }, 550);
    }, 220);
}

// ======================= CHRONO / BONUS =======================
// Seuils recalibrés pour la lecture de phrases (plus longue qu'un
// calcul mental) et pour 8 phrases par chapitre (au lieu de 10 faits).
function startLevelTimer() {
    if (chronoInterval) clearInterval(chronoInterval);
    levelStartTime = Date.now();
    chronoInterval = setInterval(() => {
        if (gameActive && currentSentenceIndex < LEVELS[currentLevelIndex].sentences.length) {
            currentLevelTime = (Date.now() - levelStartTime) / 1000;
            document.getElementById("chrono-box").innerHTML = `⏱️ ${currentLevelTime.toFixed(1)}s`;
        }
    }, 100);
}
function stopLevelTimerAndComputeBonus() {
    if (chronoInterval) clearInterval(chronoInterval);
    const finalTime = currentLevelTime;
    const bonus = finalTime <= 25 ? 100 : finalTime <= 35 ? 70 : finalTime <= 50 ? 45 : finalTime <= 70 ? 25 : 10;
    const penalty = errors * 5;
    const levelBonus = Math.max(0, bonus - penalty);
    totalTimeBonus += levelBonus;
    return levelBonus;
}

// ======================= CHAPITRES / NIVEAUX =======================
function showChapterIntro() {
    const lvl = LEVELS[currentLevelIndex];
    chapterScreenMode = "intro";
    document.getElementById("chapter-eyebrow").innerText = `Chapitre ${currentLevelIndex + 1} · ${lvl.nom}`;
    document.getElementById("chapter-title").innerText = lvl.chapterTitle;
    document.getElementById("chapter-text").innerText = lvl.chapterIntro;
    document.getElementById("btn-chapter-continue").innerText = "⚔️ Affronter " + lvl.nom;
    document.getElementById("chapter-screen").classList.remove("hidden");
}

function showChapterVictory() {
    const lvl = LEVELS[currentLevelIndex];
    if (currentLevelIndex >= LEVELS.length - 1) {
        // Dernier chapitre : l'épilogue s'affiche directement sur
        // l'écran de victoire finale, pas besoin d'écran intermédiaire.
        levelUp();
        return;
    }
    chapterScreenMode = "victory";
    document.getElementById("chapter-eyebrow").innerText = `${lvl.nom} neutralisé !`;
    document.getElementById("chapter-title").innerText = "L'enquête continue...";
    document.getElementById("chapter-text").innerText = lvl.victoryBeat;
    document.getElementById("btn-chapter-continue").innerText = "Continuer l'histoire";
    document.getElementById("chapter-screen").classList.remove("hidden");
}

function onChapterContinue() {
    document.getElementById("chapter-screen").classList.add("hidden");
    if (chapterScreenMode === "intro") {
        startLevelTimer();
        loadCurrentSentence();
    } else {
        levelUp();
    }
}

function levelUp() {
    const bonus = pendingVictoryBonus;
    showCelebration(`+${bonus}pts !`);
    currentLevelIndex++;
    if (currentLevelIndex >= LEVELS.length) {
        gameActive = false;
        showVictory();
        return;
    }
    currentScore = 0; errors = 0; comboTimestamps = [];
    responseTimeHistory = []; burningMode = false; updateBurningIndicator(false);
    playFanfare();
    flashPalier();
    initLevel();
}

function initLevel() {
    currentSentenceIndex = 0;
    currentLevelTime = 0;
    cristaux = [];
    beam = null;
    godzillaMouthOpen = false;
    shotLock = false;
    updateUI();
    showChapterIntro();
}

function retryCurrentLevel() {
    if (activeCard) { activeCard.remove(); activeCard = null; }
    if (cardTimeout) clearTimeout(cardTimeout);
    document.getElementById("end-screen").classList.add("hidden");
    currentScore = 0; errors = 0; comboTimestamps = [];
    responseTimeHistory = []; burningMode = false; updateBurningIndicator(false);
    gameActive = true;
    victoryFireworks = false; fireworks = []; particles = [];
    currentSentenceIndex = 0;
    currentLevelTime = 0;
    cristaux = [];
    beam = null;
    godzillaMouthOpen = false;
    shotLock = false;
    updateUI();
    startLevelTimer();
    loadCurrentSentence();
}

function restartFromLevel1() {
    currentLevelIndex = 0;
    startGame();
}

// ======================= ÉCRANS =======================
function showGameOver() {
    const lvl = LEVELS[currentLevelIndex];
    const idx = currentLevelIndex;
    retryAttempts[idx] = retryAttempts[idx] || 0;
    const variant = lvl.retryVariants[retryAttempts[idx] % lvl.retryVariants.length];
    retryAttempts[idx]++;

    document.getElementById("end-title").innerHTML = "💥 " + lvl.nom.toUpperCase() + " S'ÉCHAPPE";
    document.getElementById("end-desc").innerHTML =
        `${variant}<br><br>Bonus cumulé : ${totalTimeBonus} points ⚡<br>Retente ce chapitre, Godzilla compte sur toi.`;
    document.getElementById("btn-retry-level").classList.remove("hidden");
    document.getElementById("btn-restart-all").classList.remove("hidden");
    document.getElementById("btn-play-again").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
}

function showVictory() {
    victoryFireworks = true;
    playVictory();
    for (let i = 0; i < 18; i++) {
        setTimeout(() => fireworks.push(new Firework(Math.random() * canvas.width, Math.random() * (canvas.height - 150) + 100)), i * 180);
    }
    showCelebration("🏆🦖✨");
    const lastLevel = LEVELS[LEVELS.length - 1];
    document.getElementById("end-title").innerHTML = "🏆 PROTOCOLE TITAN ACCOMPLI";
    document.getElementById("end-desc").innerHTML =
        `${lastLevel.victoryBeat}<br><br>Bonus rapidité cumulé : ${totalTimeBonus} points ! 🏆`;
    document.getElementById("btn-retry-level").classList.add("hidden");
    document.getElementById("btn-restart-all").classList.add("hidden");
    document.getElementById("btn-play-again").classList.remove("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
}

function startGame() {
    if (activeCard) { activeCard.remove(); activeCard = null; }
    if (cardTimeout) clearTimeout(cardTimeout);
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("chapter-screen").classList.add("hidden");
    currentScore = 0; errors = 0; totalTimeBonus = 0; comboTimestamps = [];
    responseTimeHistory = []; burningMode = false; updateBurningIndicator(false);
    retryAttempts = {};
    victoryFireworks = false; fireworks = []; particles = [];
    gameActive = true;
    updateUI();
    initLevel();
    if (!animationId) animationId = requestAnimationFrame(gameLoop);
}

// ======================= BOUCLE DE RENDU =======================
function gameLoop() {
    drawBackground();

    if (gameActive || cristaux.length) {
        for (const c of cristaux) { if (gameActive) c.update(); c.draw(); }
    }

    drawGodzilla();
    if (beam) drawBeam();

    if (victoryFireworks && fireworks.length) {
        for (let i = fireworks.length - 1; i >= 0; i--) if (!fireworks[i].update()) fireworks.splice(i, 1); else fireworks[i].draw();
    }
    for (let i = particles.length - 1; i >= 0; i--) if (!particles[i].update()) particles.splice(i, 1); else particles[i].draw();

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

document.getElementById("btn-start").addEventListener("click", startGame);
document.getElementById("btn-retry-level").addEventListener("click", retryCurrentLevel);
document.getElementById("btn-restart-all").addEventListener("click", restartFromLevel1);
document.getElementById("btn-play-again").addEventListener("click", restartFromLevel1);
document.getElementById("btn-chapter-continue").addEventListener("click", onChapterContinue);

// ======================= INIT =======================
window.onload = () => {
    const loadingLabel = document.getElementById("loading-label");
    preloadAllAssets(() => {
        if (loadingLabel) loadingLabel.classList.add("hidden");
        document.getElementById("btn-start").disabled = false;
        drawBackground();
        drawGodzilla();
    });
};
