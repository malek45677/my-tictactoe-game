// --- Theme Manager ---
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '🌙 Dark' : '☀️ Light';
});

// --- DOM Elements Reference Mapping ---
const lobbyMenu = document.getElementById('lobbyMenu');
const gameZone = document.getElementById('gameZone');
const hostNameInput = document.getElementById('hostNameInput');
const btnCreate = document.getElementById('btnCreate');
const btnJoin = document.getElementById('btnJoin');
const btnLocal = document.getElementById('btnLocal');
const joinInput = document.getElementById('joinInput');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const roomIdText = document.getElementById('roomIdText');
const leaveBtn = document.getElementById('leaveBtn');

const lobbyDashboard = document.getElementById('lobbyDashboard');
const playerCount = document.getElementById('playerCount');
const playerNamesDisplay = document.getElementById('playerNamesDisplay');
const evictBtn = document.getElementById('evictBtn');

const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const fileInput = document.getElementById('fileInput');
const fileBtn = document.getElementById('fileBtn');
const voiceBtn = document.getElementById('voiceBtn');
const voiceIconSvg = document.getElementById('voiceIconSvg');

const emojiBtn = document.getElementById('emojiBtn');
const emojiPickerPanel = document.getElementById('emojiPickerPanel');
const emojiTabsContainer = document.getElementById('emojiTabsContainer');
const emojiGridBox = document.getElementById('emojiGridBox');

const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');

// --- Core Application States ---
let currentPlayer = 'X';
let myRole = 'X'; 
let isMultiplayer = false;
let gameState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = false;
let intentionallyEvicted = false;

let peer = null;
let conn = null;
let hostPlayerName = "Player 1";
let guestPlayerName = "Player 2";

let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// --- 10 Advanced Organized Emoji Database Array Packs ---
const emojiPacks = {
    faces: { label: '😃 Faces', data: ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😋','😛','😜','🤪','🤨','🧐','🤓','😎','🤩','🥳','😏','😒','😞','😔'] },
    animals: { label: '🦁 Animals', data: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣'] },
    food: { label: '🍔 Food', data: ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🇧🇪','🥑','🥦','🌽','🥕','🥔','🍞','🥐','🥨','🥞','🧀','🍖','🥩','🍔','🍟','🍕','🌭','🥪','🌮'] },
    sports: { label: '⚽ Sports', data: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🏓','🏸','🏒','🏑','🥍','👑','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼'] },
    travel: { label: '🚀 Travel', data: ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🚏','🛤️','⛽','🚨','✈️','🛫','🛬','🛸','🚀'] },
    objects: { label: '💡 Objects', data: ['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🎛️','🎚️','📺','📷','📸','📹','📼','🔍','🔎','🕯️','💡','🔦','🏮','🪔','📔','📕','📖','📗','📘','📙'] },
    symbols: { label: '❤️ Symbols', data: ['💘','💝','💖','💗','💓','💞','💕','💟','❣️','💔','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💯','🚫','❌','⭕','💢','♨️','🚷','🚯'] },
    flags: { label: '🏴 Flags', data: ['🏁','🚩','🎌','🏴','🏳️','🏳️‍🌈','🏳️‍⚧️','🏴‍☠️','🇦🇪','🇦🇹','🇦🇺','🇧🇧','🇧🇩','🇧🇪','🇧🇫','🇧🇬','🇧🇭','🇧🇮','🇧🇯','🇧🇲','🇧🇳','🇧🇴','🇧🇷','🇧🇸','🇧🇹','🇨🇦'] },
    fantasy: { label: '🧙‍♂️ Fantasy', data: ['🧝‍♀️','🧝‍♂️','🧙‍♀️','🧙‍♂️','🧚‍♀️','🧚‍♂️','🧛‍♀️','🧛‍♂️','🧜‍♀️','🧜‍♂️','🧌','👹','👺','👻','👽','🤖','🛸','🧜','🧚','🧙','🧝','🦄','🐉','🐲'] },
    gaming: { label: '🎮 Gaming', data: ['🎮','🕹️','🎰','🎲','🧩','♟️','🎯','🎳','🛹','🎨','🎬','🎧','🎤','🎸','🎹','🎺','🎻','🎲','🃏','🎴','📣','📢','🛡️','⚔️','🏹','💥'] }
};

// --- Bootstrapping Lifecycle Init Actions ---
btnLocal.addEventListener('click', startLocalGame);
btnCreate.addEventListener('click', createOnlineRoom);
btnJoin.addEventListener('click', joinOnlineRoom);
leaveBtn.addEventListener('click', disconnectAndLeave);
if(evictBtn) evictBtn.addEventListener('click', evictGuestPlayer);
chatSendBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

fileBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileShare);
voiceBtn.addEventListener('click', toggleVoiceRecording);

emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPickerPanel.classList.toggle('hidden');
});
document.addEventListener('click', (e) => {
    if (!emojiPickerPanel.contains(e.target) && e.target !== emojiBtn) {
        emojiPickerPanel.classList.add('hidden');
    }
});

// بناء محرك تبويب الإيموجي الدايناميكي
function buildTabbedEmojiPicker() {
    emojiTabsContainer.innerHTML = '';
    let firstPackKey = null;

    Object.keys(emojiPacks).forEach((key, index) => {
        if(index === 0) firstPackKey = key;
        const tab = document.createElement('button');
        tab.className = `emoji-tab-btn ${index === 0 ? 'active' : ''}`;
        tab.textContent = emojiPacks[key].label;
        tab.setAttribute('data-pack', key);
        
        tab.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.emoji-tab-btn').forEach(b => b.classList.remove('active'));
            tab.classList.add('active');
            renderGridPackItems(key);
        });
        emojiTabsContainer.appendChild(tab);
    });

    if(firstPackKey) renderGridPackItems(firstPackKey);
}

function renderGridPackItems(packKey) {
    emojiGridBox.innerHTML = '';
    emojiPacks[packKey].data.forEach(emoji => {
        const item = document.createElement('div');
        item.className = 'emoji-item';
        item.textContent = emoji;
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            chatInput.value += emoji;
            chatInput.focus();
        });
        emojiGridBox.appendChild(item);
    });
}

buildTabbedEmojiPicker();

function startLocalGame() {
    isMultiplayer = false;
    myRole = 'BOTH'; 
    lobbyMenu.classList.add('hidden');
    gameZone.classList.remove('hidden');
    // هنا يتم تكملة منطق اللعبة المحلي...
}

function createOnlineRoom() {
    // منطق إنشاء الغرفة عبر سيرفر الـ PeerJS أونلاين
}

function joinOnlineRoom() {
    // منطق الاتصال بغرفة الصديق عن طريق الـ ID
}

function disconnectAndLeave() {
    // مغادرة اللعبة والعودة للقائمة الرئيسية
}

function evictGuestPlayer() {
    // طرد اللاعب الضيف (خاص بمشرف الغرفة)
}

function sendChatMessage() {
    // إرسال الرسائل النصية
}

function handleFileShare() {
    // مشاركة الملفات والمرفقات
}

function toggleVoiceRecording() {
    // تشغيل وإيقاف تسجيل النوتة الصوتية
}