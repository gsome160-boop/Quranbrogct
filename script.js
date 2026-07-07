const surahList = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const select = document.getElementById('surahSelect');
const reciteSurahSelect = document.getElementById('reciteSurahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const speedSelect = document.getElementById('speedSelect');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('surahTextDisplay');

let currentAyahIndex = 0;
let recognition;
let isReciting = false;
let loadedAyahs = [];

function updateSelect(list) {
    select.innerHTML = '';
    reciteSurahSelect.innerHTML = '';
    list.forEach((name) => {
        let opt = document.createElement("option");
        let realIndex = surahList.indexOf(name) + 1;
        opt.value = realIndex.toString().padStart(3, '0');
        opt.text = name;
        select.add(opt);
        
        let opt2 = opt.cloneNode(true);
        reciteSurahSelect.add(opt2);
    });
}
updateSelect(surahList);

searchInput.addEventListener('input', () => {
    const filtered = surahList.filter(s => s.includes(searchInput.value));
    updateSelect(filtered);
});

function setAudioSource() {
    audioPlayer.src = reciterSelect.value + select.value + ".mp3";
    audioPlayer.playbackRate = parseFloat(speedSelect.value);
}

speedSelect.addEventListener('change', () => {
    audioPlayer.playbackRate = parseFloat(speedSelect.value);
});

function togglePlay() {
    if (!audioPlayer.src || audioPlayer.src === window.location.href) {
        setAudioSource();
    }
    if (audioPlayer.paused) {
        audioPlayer.play()
            .then(() => {
                playPauseBtn.innerText = "توقف";
                display.innerText = "أنت تستمع إلى سورة: " + select.options[select.selectedIndex].text;
            }).catch(err => console.log(err));
    } else {
        audioPlayer.pause();
        playPauseBtn.innerText = "ابدأ";
    }
}

function downloadAudio() {
    const url = reciterSelect.value + select.value + ".mp3";
    const a = document.createElement('a');
    a.href = url;
    a.download = `${select.options[select.selectedIndex].text}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

const listenTitle = document.getElementById('listenTitle');
let pressTimer;

if (listenTitle) {
    listenTitle.addEventListener('mousedown', startPress);
    listenTitle.addEventListener('touchstart', startPress, {passive: true});
    listenTitle.addEventListener('mouseup', cancelPress);
    listenTitle.addEventListener('mouseleave', cancelPress);
    listenTitle.addEventListener('touchend', cancelPress);
}

function startPress() {
    pressTimer = setTimeout(() => {
        document.getElementById('listeningSection').classList.add('hidden');
        document.getElementById('recitationSection').classList.remove('hidden');
    }, 1000);
}

function cancelPress() {
    clearTimeout(pressTimer);
}

function backToMain() {
    if (recognition) {
        recognition.stop();
    }
    isReciting = false;
    document.getElementById('recitationSection').classList.add('hidden');
    document.getElementById('listeningSection').classList.remove('hidden');
}

async function startRecitationMode() {
    const surahNum = parseInt(reciteSurahSelect.value);
    const displayDiv = document.getElementById('recitationDisplay');
    displayDiv.innerHTML = "جاري تحميل السورة...";

    try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}`);
        const data = await res.json();
        loadedAyahs = data.data.ayahs;
        
        displayDiv.innerHTML = "";
        loadedAyahs.forEach((ayah, index) => {
            let span = document.createElement('span');
            span.className = 'ayah-block';
            span.id = `ayah-${index}`;
            span.innerText = ayah.text + ` ﴿${ayah.numberInSurah}﴾ `;
            displayDiv.appendChild(span);
        });

        currentAyahIndex = 0;
        document.getElementById(`ayah-${currentAyahIndex}`).classList.add('ayah-active');
        
        if (recognition) {
            recognition.stop();
        }
        startSpeechRecognition();
    } catch (err) {
        displayDiv.innerHTML = "فشل في جلب السورة، يرجى التحقق من اتصال الانترنت.";
    }
}

function startSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
        alert("ميزة التسميع الصوتي غير مدعومة بالكامل في متصفحك الحالي.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'ar-AE'; 
    recognition.continuous = true;
    recognition.interimResults = true; 

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            interimTranscript += event.results[i][0].transcript;
        }

        if (!loadedAyahs[currentAyahIndex]) return;

        const targetAyah = loadedAyahs[currentAyahIndex].text.replace(/[^\u0621-\u064A\s]/g, '');
        const cleanSpeech = interimTranscript.replace(/[^\u0621-\u064A\s]/g, '');

        const targetWords = targetAyah.split(/\s+/).filter(w => w.length > 1);
        let matchCount = 0;
        
        targetWords.forEach(word => {
            if (cleanSpeech.includes(word)) {
                matchCount++;
            }
        });

        if (matchCount >= Math.ceil(targetWords.length * 0.45)) {
            const currentAyahElement = document.getElementById(`ayah-${currentAyahIndex}`);
            if (currentAyahElement) {
                currentAyahElement.classList.remove('ayah-active');
            }
            
            currentAyahIndex++;
            
            if (currentAyahIndex < loadedAyahs.length) {
                const nextAyah = document.getElementById(`ayah-${currentAyahIndex}`);
                if (nextAyah) {
                    nextAyah.classList.add('ayah-active');
                    nextAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                recognition.stop();
            } else {
                alert("أحسنت بارك الله فيك! لقد أكملت السورة بنجاح.");
                recognition.stop();
            }
        }
    };

    recognition.onend = () => {
        if (currentAyahIndex < loadedAyahs.length && !document.getElementById('recitationSection').classList.contains('hidden')) {
            recognition.start();
        }
    };

    recognition.onerror = (e) => console.log('تعذر تشغيل المايك أو التعرف: ', e);
    recognition.start();
}

function increment() { 
    let c = document.getElementById('count'); 
    c.innerText = parseInt(c.innerText) + 1; 
}
function resetCounter() { 
    document.getElementById('count').innerText = 0; 
}

setTimeout(() => {
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 1000);
    }
}, 3000);
