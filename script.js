const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('surahTextDisplay');
const suggestionsList = document.getElementById('suggestions');

// عناصر نافذة المشاركة المحدثة
const shareModal = document.getElementById('shareModal');
const modalSurahInput = document.getElementById('modalSurahInput');
const fromAyahInput = document.getElementById('fromAyahInput');
const toAyahInput = document.getElementById('toAyahInput');
const creditText = document.getElementById('creditText');
const modalReciterSelect = document.getElementById('modalReciterSelect');
let selectedShareType = ''; 

const surahList = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

function initSurahs() {
    surahSelect.innerHTML = '';
    surahList.forEach((name, i) => {
        let val = (i + 1).toString().padStart(3, '0');
        let opt = document.createElement("option");
        opt.value = val; opt.text = name;
        surahSelect.add(opt);
    });
}
initSurahs();

function openShareModal() {
    shareModal.style.display = 'flex';
    // يضع اسم السورة الشغالة حالياً في الخانة تلقائياً لتسهيل الأمر
    modalSurahInput.value = surahSelect.options[surahSelect.selectedIndex].text;
    modalReciterSelect.value = reciterSelect.value;
}

function closeShareModal() { shareModal.style.display = 'none'; }

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
function resetCounter() { document.getElementById('count').innerText = 0; }

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

function cleanArabicText(text) {
    if (!text) return "";
    return text.replace(/[\u064B-\u065F\u0670]/g, "").replace(/[أإآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "y");
}

async function executeShare() {
    if (!selectedShareType) { alert('الرجاء اختيار نوع المشاركة'); return; }
    
    const inputName = modalSurahInput.value.trim();
    if(!inputName) { alert('الرجاء كتابة اسم السورة'); return; }

    // البحث عن رقم السورة بناء على الاسم المكتوب
    const cleanInput = cleanArabicText(inputName);
    const surahIndex = surahList.findIndex(name => cleanArabicText(name) === cleanInput);
    
    if(surahIndex === -1) {
        alert('تأكد من كتابة اسم السورة بشكل صحيح (مثال: البقرة)');
        return;
    }

    const surahNum = surahIndex + 1;
    const surahName = surahList[surahIndex];
    const reciterName = modalReciterSelect.options[modalReciterSelect.selectedIndex].text;
    
    if (selectedShareType === 'voice') {
        const audioUrl = modalReciterSelect.value + surahNum.toString().padStart(3, '0') + ".mp3";
        let voiceText = `🎙️ استمع إلى سورة ${surahName} كاملة بصوت الشيخ ${reciterName}:\n🔗 الرابط: ${audioUrl}`;
        sendToShareApi({ title: 'مشاركة صوتية', text: voiceText });
        return;
    }

    // جلب النصوص عند اختيار صورة أو كتابة
    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)
        .then(res => res.json())
        .then(data => {
            const fromAyah = parseInt(fromAyahInput.value) || 1;
            const toAyah = parseInt(toAyahInput.value) || data.data.ayahs.length;
            
            const start = fromAyah - 1;
            const end = toAyah;
            const selectedTextAyahs = data.data.ayahs.slice(start, end);

            if(selectedTextAyahs.length === 0) {
                alert('تأكد من كتابة أرقام الآيات بشكل صحيح لهذه السورة');
                return;
            }

            let textToShare = `📖 سورة ${surahName} (الآيات من ${fromAyah} إلى ${toAyah})\n\n`;
            selectedTextAyahs.forEach(a => { textToShare += `${a.text} ﴿${a.numberInSurah}﴾ `; });

            if (selectedShareType === 'text') {
                textToShare += `\n\n🎙️ بصوت الشيخ: ${reciterName}\nتم استخدام موقع https://n9.cl/g0h73t`;
                sendToShareApi({ title: 'مشاركة آيات قرآنية', text: textToShare });
            } else if (selectedShareType === 'image') {
                generateAndShareImage(surahName, selectedTextAyahs);
            }
        }).catch(() => alert('حدث خطأ أثناء جلب آيات السورة، تأكد من اتصال الإنترنت.'));
}

function generateAndShareImage(surahName, ayahs) {
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600; canvas.height = 800;
    
    ctx.fillStyle = '#1a5235'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 6; ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`سورة ${surahName}`, canvas.width / 2, 80);
    
    ctx.font = '20px sans-serif';
    let currentY = 150; let line = '';
    let combinedText = '';
    ayahs.forEach(a => { combinedText += `${a.text} ﴿${a.numberInSurah}﴾ `; });
    
    let words = combinedText.split(' ');
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > 500 && n > 0) {
            ctx.fillText(line, canvas.width / 2, currentY);
            line = words[n] + ' '; currentY += 40;
        } else { line = testLine; }
    }
    ctx.fillText(line, canvas.width / 2, currentY);

    canvas.toBlob((blob) => {
        const file = new File([blob], 'quran_ayah.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], title: 'صورة الآيات الكريم' }).then(() => closeShareModal()).catch(err => console.log(err));
        } else {
            alert('تم فتح الصورة، اضغط عليها مطولاً لحفظها ومشاركتها يدويًا.');
            window.open(canvas.toDataURL());
        }
    });
}

function sendToShareApi(data) {
    if (navigator.share) {
        navigator.share(data).then(() => closeShareModal()).catch(err => console.log(err));
    } else { alert(data.text); }
}

setTimeout(() => {
    const overlay = document.getElementById('intro-overlay');
    if(overlay) { overlay.style.opacity = '0'; setTimeout(() => { overlay.style.display = 'none'; }, 1000); }
}, 3000);
