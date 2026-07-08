const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('surahTextDisplay');
const suggestionsList = document.getElementById('suggestions');

// ميزات المشاركة الحقيقية
const shareModal = document.getElementById('shareModal');
const modalSurahSelect = document.getElementById('modalSurahSelect');
const fromAyah = document.getElementById('fromAyah');
const toAyah = document.getElementById('toAyah');
const creditText = document.getElementById('creditText');
const modalReciterSelect = document.getElementById('modalReciterSelect');
let selectedShareType = ''; 
let currentSurahAyahs = [];

const surahList = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

let allSurahs = []; 

fetch('https://api.alquran.cloud/v1/surah')
    .then(response => response.json())
    .then(data => { 
        allSurahs = data.data; 
        initModalSurahs();
    })
    .catch(error => console.error('خطأ في جلب السور:', error));

function initModalSurahs() {
    modalSurahSelect.innerHTML = '';
    surahList.forEach((name, i) => {
        let opt = document.createElement("option");
        opt.value = (i + 1).toString();
        opt.text = name;
        modalSurahSelect.add(opt);
    });
}

function updateSelect(list) {
    surahSelect.innerHTML = '';
    list.forEach((name) => {
        let opt = document.createElement("option");
        let realIndex = surahList.indexOf(name) + 1;
        opt.value = realIndex.toString().padStart(3, '0');
        opt.text = name;
        surahSelect.add(opt);
    });
}
updateSelect(surahList);

function fetchAndDisplaySurahText(surahIndex) {
    const surahNumber = parseInt(surahIndex);
    if (!surahNumber) return;
    display.innerText = "جاري تحميل نص السورة والآيات...";
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`)
        .then(response => response.json())
        .then(data => {
            display.innerHTML = '';
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
                ayahSpan.textContent = text + ` ﴿${ayah.numberInSurah}﴾ `;
                display.appendChild(ayahSpan);
            });
        }).catch(() => { display.innerText = 'حدث خطأ أثناء تحميل نص السورة.'; });
}

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
/g, "").replace(/[أإآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "y").replace(/سوره\s+/g, "").replace(/سوره/g, ""); }

// فتح وإعداد نافذة المشاركة
function openShareModal() {
    shareModal.style.display = 'flex';
    modalSurahSelect.value = parseInt(surahSelect.value).toString();
    modalReciterSelect.value = reciterSelect.value;
    loadAyahRange();
}

function closeShareModal() { shareModal.style.display = 'none'; }

function loadAyahRange() {
    const surahNum = modalSurahSelect.value;
    fromAyah.innerHTML = ''; toAyah.innerHTML = '';
    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)
        .then(res => res.json())
        .then(data => {
            currentSurahAyahs = data.data.ayahs;
            currentSurahAyahs.forEach((ayah) => {
                let opt1 = document.createElement('option'); opt1.value = ayah.numberInSurah; opt1.text = ayah.numberInSurah;
                let opt2 = document.createElement('option'); opt2.value = ayah.numberInSurah; opt2.text = ayah.numberInSurah;
                fromAyah.add(opt1); toAyah.add(opt2);
            });
            toAyah.value = currentSurahAyahs.length;
        });
}

function setShareType(type) {
    selectedShareType = type;
    document.getElementById('typeVoice').classList.remove('active');
    document.getElementById('typeImage').classList.remove('active');
    document.getElementById('typeText').classList.remove('active');
    if (type === 'voice') document.getElementById('typeVoice').classList.add('active');
    if (type === 'image') document.getElementById('typeImage').classList.add('active');
    if (type === 'text') {
        document.getElementById('typeText').classList.add('active');
        creditText.style.display = 'block';
    } else { creditText.style.display = 'none'; }
}

// دالة المشاركة الحقيقية الشاملة للملفات والنصوص
async function executeShare() {
    if (!selectedShareType) { alert('الرجاء اختيار نوع المشاركة'); return; }
    
    const start = parseInt(fromAyah.value) - 1;
    const end = parseInt(toAyah.value);
    const selectedTextAyahs = currentSurahAyahs.slice(start, end);
    const surahName = modalSurahSelect.options[modalSurahSelect.selectedIndex].text;
    const reciterName = modalReciterSelect.options[modalReciterSelect.selectedIndex].text;

    // 1. الكتابة الحقيقية بنص الآيات الفعلي
    let textToShare = `📖 سورة ${surahName} (الآيات من ${fromAyah.value} إلى ${toAyah.value})\n\n`;
    selectedTextAyahs.forEach(a => { textToShare += `${a.text} ﴿${a.numberInSurah}﴾ `; });

    if (selectedShareType === 'text') {
        textToShare += `\n\n🎙️ بصوت الشيخ: ${reciterName}\nتم استخدام موقع https://n9.cl/g0h73t`;
        sendToShareApi({ title: 'مشاركة آيات قرآنية', text: textToShare });
    } 
    // 2. الصوت الحقيقي (رابط تشغيل الملف المباشر الكامل)
    else if (selectedShareType === 'voice') {
        const audioUrl = modalReciterSelect.value + modalSurahSelect.value.padStart(3, '0') + ".mp3";
        textToShare = `🎙️ استمع إلى سورة ${surahName} كاملة بصوت الشيخ ${reciterName}:\n🔗 الرابط: ${audioUrl}`;
        sendToShareApi({ title: 'مشاركة صوتية', text: textToShare });
    } 
    // 3. الصورة الحقيقية (توليد صورة خضراء بداخلها نص الآيات الفعلي)
    else if (selectedShareType === 'image') {
        generateAndShareImage(surahName, selectedTextAyahs);
    }
}

// دالة توليد صورة حقيقية ومشاركتها كملف فوري
function generateAndShareImage(surahName, ayahs) {
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600;
    canvas.height = 800;
    
    // خلفية إسلامية خضراء جميلة
    ctx.fillStyle = '#1a5235';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // إطار ذهبي داخلي
    ctx.strokeStyle = '#ffb300';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // عنوان السورة
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`سورة ${surahName}`, canvas.width / 2, 80);
    
    // كتابة الآيات الحقيقية داخل الصورة
    ctx.font = '20px sans-serif';
    let currentY = 150;
    let line = '';
    
    let combinedText = '';
    ayahs.forEach(a => { combinedText += `${a.text} ﴿${a.numberInSurah}﴾ `; });
    
    let words = combinedText.split(' ');
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > 500 && n > 0) {
            ctx.fillText(line, canvas.width / 2, currentY);
            line = words[n] + ' ';
            currentY += 40;
        } else { line = testLine; }
    }
    ctx.fillText(line, canvas.width / 2, currentY);

    // تحويل الـ Canvas إلى ملف حقيقي وإرساله
    canvas.toBlob((blob) => {
        const file = new File([blob], 'quran_ayah.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                files: [file],
                title: 'صورة الآيات الكريم',
                text: `تفقد آيات من سورة ${surahName}`
            }).then(() => closeShareModal()).catch(err => console.log(err));
        } else {
            alert('متصفحك لا يدعم مشاركة الملفات المباشرة، تم فتح الصورة للحفظ يدوياً.');
            window.open(canvas.toDataURL());
        }
    });
}

function sendToShareApi(data) {
    if (navigator.share) {
        navigator.share(data).then(() => closeShareModal()).catch(err => console.log(err));
    } else { alert(data.text); }
}

function resetCounter() { document.getElementById('count').innerText = 0; }
setTimeout(() => {
    const overlay = document.getElementById('intro-overlay');
    if(overlay) { overlay.style.opacity = '0'; setTimeout(() => { overlay.style.display = 'none'; }, 1000); }
}, 3000);
