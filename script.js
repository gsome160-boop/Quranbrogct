const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const display = document.getElementById('surahTextDisplay');

const shareModal = document.getElementById('shareModal');
const modalSurahInput = document.getElementById('modalSurahInput');
const fromAyahInput = document.getElementById('fromAyahInput');
const toAyahInput = document.getElementById('toAyahInput');
const creditText = document.getElementById('creditText');
const reciterWrapper = document.getElementById('reciterWrapper');
const modalReciterSelect = document.getElementById('modalReciterSelect');

const customContextMenu = document.getElementById('customContextMenu');
const contextTafsirBtn = document.getElementById('contextTafsirBtn');
const tafsirModal = document.getElementById('tafsirModal');
const tafsirTitle = document.getElementById('tafsirTitle');
const tafsirAyahText = document.getElementById('tafsirAyahText');
const tafsirContentText = document.getElementById('tafsirContentText');

let selectedShareType = ''; 
let currentSelectedAyahData = null; 
let touchTimeout = null; 

const quranSurahsData = [
    { name: "الفاتحة", ayahs: 7 }, { name: "البقرة", ayahs: 286 }, { name: "آل عمران", ayahs: 200 }, { name: "النساء", ayahs: 176 }, { name: "المائدة", ayahs: 120 },
    { name: "الأنعام", ayahs: 165 }, { name: "الأعراف", ayahs: 206 }, { name: "الأنفال", ayahs: 75 }, { name: "التوبة", ayahs: 129 }, { name: "يونس", ayahs: 109 },
    { name: "هود", ayahs: 123 }, { name: "يوسف", ayahs: 111 }, { name: "الرعد", ayahs: 43 }, { name: "إبراهيم", ayahs: 52 }, { name: "الحجر", ayahs: 99 },
    { name: "النحل", ayahs: 128 }, { name: "الإسراء", ayahs: 111 }, { name: "الكهف", ayahs: 110 }, { name: "مريم", ayahs: 98 }, { name: "طه", ayahs: 135 },
    { name: "الأنبياء", ayahs: 112 }, { name: "الحج", ayahs: 78 }, { name: "المؤمنون", ayahs: 118 }, { name: "النور", ayahs: 64 }, { name: "الفرقان", ayahs: 77 },
    { name: "الشعراء", ayahs: 227 }, { name: "النمل", ayahs: 93 }, { name: "القصص", ayahs: 88 }, { name: "العنكبوت", ayahs: 69 }, { name: "الروم", ayahs: 60 },
    { name: "لقمان", ayahs: 34 }, { name: "السجدة", ayahs: 30 }, { name: "الأحزاب", ayahs: 73 }, { name: "سبأ", ayahs: 54 }, { name: "فاطر", ayahs: 45 },
    { name: "يس", ayahs: 83 }, { name: "الصافات", ayahs: 182 }, { name: "ص", ayahs: 88 }, { name: "الزمر", ayahs: 75 }, { name: "غافر", ayahs: 85 },
    { name: "فصلت", ayahs: 54 }, { name: "الشورى", ayahs: 53 }, { name: "الزخرف", ayahs: 89 }, { name: "الدخان", ayahs: 59 }, { name: "الجاثية", ayahs: 37 },
    { name: "الأحقاف", ayahs: 35 }, { name: "محمد", ayahs: 38 }, { name: "الفتح", ayahs: 29 }, { name: "الحجرات", ayahs: 18 }, { name: "ق", ayahs: 45 },
    { name: "الذاريات", ayahs: 60 }, { name: "الطور", ayahs: 49 }, { name: "النجم", ayahs: 62 }, { name: "القمر", ayahs: 55 }, { name: "الرحمن", ayahs: 78 },
    { name: "الواقعة", ayahs: 96 }, { name: "الحديد", ayahs: 29 }, { name: "المجادلة", ayahs: 22 }, { name: "الحشر", ayahs: 24 }, { name: "الممتحنة", ayahs: 13 },
    { name: "الصف", ayahs: 14 }, { name: "الجمعة", ayahs: 11 }, { name: "المنافقون", ayahs: 11 }, { name: "التغابن", ayahs: 18 }, { name: "الطلاق", ayahs: 12 },
    { name: "التحريم", ayahs: 12 }, { name: "الملك", ayahs: 30 }, { name: "القلم", ayahs: 52 }, { name: "الحاقة", ayahs: 52 }, { name: "المعارج", ayahs: 44 },
    { name: "نوح", ayahs: 28 }, { name: "الجن", ayahs: 28 }, { name: "المزمل", ayahs: 20 }, { name: "المدثر", ayahs: 56 }, { name: "القيامة", ayahs: 40 },
    { name: "الإنسان", ayahs: 31 }, { name: "المرسلات", ayahs: 50 }, { name: "النبأ", ayahs: 40 }, { name: "النازعات", ayahs: 46 }, { name: "عبس", ayahs: 42 },
    { name: "التكوير", ayahs: 29 }, { name: "الإنفطار", ayahs: 19 }, { name: "المطففين", ayahs: 36 }, { name: "الإنشقاق", ayahs: 25 }, { name: "البروج", ayahs: 22 },
    { name: "الطارق", ayahs: 17 }, { name: "الأعلى", ayahs: 19 }, { name: "الغاشية", ayahs: 26 }, { name: "الفجر", ayahs: 30 }, { name: "البلد", ayahs: 20 },
    { name: "الشمس", ayahs: 15 }, { name: "الليل", ayahs: 21 }, { name: "الضحى", ayahs: 11 }, { name: "الشرح", ayahs: 8 }, { name: "التين", ayahs: 8 },
    { name: "العلق", ayahs: 19 }, { name: "القدر", ayahs: 5 }, { name: "البينة", ayahs: 8 }, { name: "الزلزلة", ayahs: 8 }, { name: "العاديات", ayahs: 11 },
    { name: "القارعة", ayahs: 11 }, { name: "التكاثر", ayahs: 8 }, { name: "العصر", ayahs: 3 }, { name: "الهمزة", ayahs: 9 }, { name: "الفيل", ayahs: 5 },
    { name: "قريش", ayahs: 4 }, { name: "الماعون", ayahs: 7 }, { name: "الكوثر", ayahs: 3 }, { name: "الكافرون", ayahs: 6 }, { name: "النصر", ayahs: 3 },
    { name: "المسد", ayahs: 5 }, { name: "الإخلاص", ayahs: 4 }, { name: "الفلق", ayahs: 5 }, { name: "الناس", ayahs: 6 }
];

function initSurahs() {
    surahSelect.innerHTML = '';
    quranSurahsData.forEach((s, i) => {
        let val = (i + 1).toString().padStart(3, '0');
        let opt = document.createElement("option");
        opt.value = val; opt.text = s.name;
        surahSelect.add(opt);
    });
}
initSurahs();

function cleanArabicText(text) {
    if (!text) return "";
    return text.replace(/[\u064B-\u065F\u0670]/g, "").replace(/[أإآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "y");
}

function validateAyahRange() {
    const inputName = modalSurahInput.value.trim();
    const cleanInput = cleanArabicText(inputName);
    const surah = quranSurahsData.find(s => cleanArabicText(s.name) === cleanInput);
    
    let maxAyahs = surah ? surah.ayahs : 286; 

    let fromVal = parseInt(fromAyahInput.value) || 1;
    let toVal = parseInt(toAyahInput.value) || maxAyahs;

    if (fromVal < 1) fromVal = 1;
    if (fromVal > maxAyahs) fromVal = maxAyahs;
    if (toVal < 1) toVal = 1;
    if (toVal > maxAyahs) toVal = maxAyahs;
    if (fromVal > toVal) fromVal = toVal;

    if (toVal - fromVal >= 15) {
        toVal = fromVal + 14;
    }

    fromAyahInput.value = fromVal;
    toAyahInput.value = toVal;
}

fromAyahInput.addEventListener('input', validateAyahRange);
toAyahInput.addEventListener('input', validateAyahRange);
modalSurahInput.addEventListener('input', validateAyahRange);

function openShareModal() {
    shareModal.style.display = 'flex';
    modalSurahInput.value = surahSelect.options[surahSelect.selectedIndex].text;
    modalReciterSelect.value = reciterSelect.value;
    validateAyahRange();
    setShareType('voice'); 
}

function closeShareModal() { shareModal.style.display = 'none'; }
function openTafsirModal() { tafsirModal.style.display = 'flex'; }
function closeTafsirModal() { tafsirModal.style.display = 'none'; }

function fetchAndShowTafsir(surahNum, ayahNum, originalText, surahName) {
    tafsirTitle.innerText = `تفسير سورة ${surahName} - الآية ${ayahNum}`;
    tafsirAyahText.innerText = `﴿ ${originalText} ﴾`;
    tafsirContentText.innerText = "جاري تحميل التفسير الميسر...";
    openTafsirModal();

    fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/ar.muyassar`)
        .then(res => res.json())
        .then(data => {
            if(data && data.data) {
                tafsirContentText.innerText = data.data.text;
            } else {
                tafsirContentText.innerText = "تعذر تحميل التفسير، تأكد من صحة البيانات.";
            }
        }).catch(() => {
            tafsirContentText.innerText = "حدث خطأ أثناء الاتصال بالخادم لجلب التفسير.";
        });
}

function fetchAndDisplaySurahText(surahIndex) {
    const surahNumber = parseInt(surahIndex);
    if (!surahNumber) return;
    display.innerText = "جاري تحميل نص السورة والآيات...";
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`)
        .then(response => response.json())
        .then(data => {
            display.innerHTML = '';
            const currentSurahName = data.data.name;

            if (surahNumber !== 1 && surahNumber !== 9) {
                const bismillahDiv = document.createElement('div');
                bismillahDiv.style.textAlign = 'center'; bismillahDiv.style.fontWeight = 'bold'; bismillahDiv.style.marginBottom = '10px';
                bismillahDiv.textContent = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
                display.appendChild(bismillahDiv);
            }

            data.data.ayahs.forEach(ayah => {
                let text = ayah.text;
                if (surahNumber !== 1 && surahNumber !== 9 && ayah.numberInSurah === 1) {
                    text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '');
                }
                
                const ayahSpan = document.createElement('span');
                ayahSpan.className = 'ayah-span';
                ayahSpan.textContent = text + ` ﴿${ayah.numberInSurah}﴾ `;
                
                const ayahData = {
                    surahNum: surahNumber,
                    ayahNum: ayah.numberInSurah,
                    text: text,
                    surahName: currentSurahName
                };

                ayahSpan.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    showMenu(e.pageX, e.pageY, ayahData);
                });

                ayahSpan.addEventListener('touchstart', function(e) {
                    touchTimeout = setTimeout(() => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        showMenu(touch.pageX, touch.pageY, ayahData);
                    }, 600); 
                }, { passive: true });

                ayahSpan.addEventListener('touchend', function() {
                    clearTimeout(touchTimeout);
                });

                ayahSpan.addEventListener('touchmove', function() {
                    clearTimeout(touchTimeout); 
                });

                display.appendChild(ayahSpan);
            });
        }).catch(() => { display.innerText = 'حدث خطأ أثناء تحميل نص السورة.'; });
}

function showMenu(x, y, data) {
    currentSelectedAyahData = data;
    customContextMenu.style.left = `${x}px`;
    customContextMenu.style.top = `${y}px`;
    customContextMenu.style.display = 'block';
}

document.addEventListener('click', function() {
    customContextMenu.style.display = 'none';
});

contextTafsirBtn.addEventListener('click', function() {
    if(currentSelectedAyahData) {
        fetchAndShowTafsir(
            currentSelectedAyahData.surahNum,
            currentSelectedAyahData.ayahNum,
            currentSelectedAyahData.text,
            currentSelectedAyahData.surahName
        );
    }
});

function setAudioSource() {
    audioPlayer.pause();
    audioPlayer.src = reciterSelect.value + surahSelect.value + ".mp3";
    fetchAndDisplaySurahText(surahSelect.value);
}

surahSelect.addEventListener('change', () => { setAudioSource(); playPauseBtn.innerText = "بدء"; });
reciterSelect.addEventListener('change', () => { setAudioSource(); playPauseBtn.innerText = "بدء"; });

function togglePlay() {
    if (!audioPlayer.src || audioPlayer.src === window.location.href) { setAudioSource(); }
    if (audioPlayer.paused) {
        audioPlayer.play().then(() => { playPauseBtn.innerText = "توقف"; }).catch(err => { console.error(err); });
    } else { audioPlayer.pause(); playPauseBtn.innerText = "بدء"; }
}

function increment() { let c = document.getElementById('count'); c.innerText = parseInt(c.innerText) + 1; }
function resetCounter() { document.getElementById('count').innerText = 0; }

function setShareType(type) {
    selectedShareType = type;
    document.getElementById('typeVoice').classList.remove('active');
    document.getElementById('typeImage').classList.remove('active');
    document.getElementById('typeText').classList.remove('active');
    
    if (type === 'voice') document.getElementById('typeVoice').classList.add('active');
    if (type === 'image') document.getElementById('typeImage').classList.add('active');
    if (type === 'text') document.getElementById('typeText').classList.add('active');

    if (type === 'image' || type === 'text') {
        reciterWrapper.style.display = 'none'; 
        creditText.style.display = 'none';
    } else {
        reciterWrapper.style.display = 'block';
        creditText.style.display = 'block'; // تفعيل ظهور الجملة عند مشاركة ملف الصوت
    }
}

async function executeShare() {
    if (!selectedShareType) { alert('الرجاء اختيار نوع المشاركة'); return; }
    
    const inputName = modalSurahInput.value.trim();
    if(!inputName) { alert('الرجاء كتابة اسم السورة'); return; }

    const cleanInput = cleanArabicText(inputName);
    const surahIndex = quranSurahsData.findIndex(s => cleanArabicText(s.name) === cleanInput);
    
    if(surahIndex === -1) {
        alert('تأكد من كتابة اسم السورة بشكل صحيح (مثال: البقرة)');
        return;
    }

    validateAyahRange(); 

    const surahNum = surahIndex + 1;
    const surahName = quranSurahsData[surahIndex].name;
    const reciterName = modalReciterSelect.options[modalReciterSelect.selectedIndex].text;
    
    if (selectedShareType === 'voice') {
        const audioUrl = modalReciterSelect.value + surahNum.toString().padStart(3, '0') + ".mp3";
        
        try {
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            const file = new File([blob], `${surahName}_${reciterName}.mp3`, { type: 'audio/mp3' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `سورة ${surahName}`,
                    text: `🎙️ بصوت الشيخ ${reciterName}\nخيركم من تعلم القران و علمه برمجة ابوالقاسم`
                });
                closeShareModal();
            } else {
                let voiceText = `🎙️ بصوت الشيخ ${reciterName}\nخيركم من تعلم القران و علمه برمجة ابوالقاسم\n🔗 الرابط: ${audioUrl}`;
                sendToShareApi({ title: 'مشاركة صوتية', text: voiceText });
            }
        } catch (error) {
            let voiceText = `🎙️ بصوت الشيخ ${reciterName}\nخيركم من تعلم القران و علمه برمجة ابوالقاسم\n🔗 الرابط: ${audioUrl}`;
            sendToShareApi({ title: 'مشاركة صوتية', text: voiceText });
        }
        return;
    }

    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)
        .then(res => res.json())
        .then(data => {
            const fromAyah = parseInt(fromAyahInput.value);
            const toAyah = parseInt(toAyahInput.value);
            const selectedTextAyahs = data.data.ayahs.slice(fromAyah - 1, toAyah);

            if (selectedShareType === 'text') {
                let
