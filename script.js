const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('surahTextDisplay');
const suggestionsList = document.getElementById('suggestions');

// متغيرات ميزة المشاركة الجديدة
const shareModal = document.getElementById('shareModal');
const modalSurahInput = document.getElementById('modalSurahInput');
const creditText = document.getElementById('creditText');
const modalReciterSelect = document.getElementById('modalReciterSelect');
let selectedShareType = ''; 

const surahList = ["الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس", "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الإنفطار", "المطففين", "الإنشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

if (suggestionsList) {
    suggestionsList.style.position = 'absolute';
    suggestionsList.style.backgroundColor = '#ffffff';
    suggestionsList.style.border = '2px solid #1a5235';
    suggestionsList.style.borderRadius = '4px';
    suggestionsList.style.maxHeight = '200px';
    suggestionsList.style.overflowY = 'auto';
    suggestionsList.style.zIndex = '99999';
    suggestionsList.style.width = '100%';
    suggestionsList.style.padding = '0';
    suggestionsList.style.margin = '5px 0 0 0';
    suggestionsList.style.listStyle = 'none';
    suggestionsList.style.boxShadow = '0px 4px 10px rgba(0,0,0,0.2)';
    suggestionsList.style.display = 'none';
}

let allSurahs = []; 

fetch('https://api.alquran.cloud/v1/surah')
    .then(response => response.json())
    .then(data => { allSurahs = data.data; })
    .catch(error => console.error('خطأ في جلب السور:', error));

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
                bismillahDiv.style.textAlign = 'center';
                bismillahDiv.style.fontWeight = 'bold';
                bismillahDiv.style.marginBottom = '10px';
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
        })
        .catch(() => { display.innerText = 'حدث خطأ أثناء تحميل نص السورة.'; });
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
    } else {
        audioPlayer.pause(); playPauseBtn.innerText = "بدء";
    }
}

function increment() { 
    let c = document.getElementById('count'); c.innerText = parseInt(c.innerText) + 1; 
}
function resetCounter() { document.getElementById('count').innerText = 0; }

function cleanArabicText(text) {
    if (!text) return "";
    return text.replace(/[\u064B-\u065F\u0670]/g, "").replace(/[أإآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "y").replace(/سوره\s+/g, "").replace(/سوره/g, "");
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    suggestionsList.innerHTML = '';
    if (!query) { suggestionsList.style.display = 'none'; updateSelect(surahList); return; }

    if (!isNaN(query)) {
        const pageNumber = parseInt(query);
        if (pageNumber >= 1 && pageNumber <= 604) {
            suggestionsList.style.display = 'block';
            const li = document.createElement('li');
            li.textContent = `📖 الانتقال إلى الصفحة رقم ${pageNumber}`;
            styleListItem(li);
            li.addEventListener('click', () => {
                fetch(`https://api.alquran.cloud/v1/page/${pageNumber}/ar.alafasy`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.data && data.data.ayahs.length > 0) {
                            const targetNum = data.data.ayahs[0].surah.number;
                            surahSelect.value = targetNum.toString().padStart(3, '0');
                            setAudioSource();
                            searchInput.value = `صفحة ${pageNumber}`;
                            suggestionsList.style.display = 'none';
                        }
                    });
            });
            suggestionsList.appendChild(li);
        }
        return;
    }

    const filtered = surahList.filter(s => cleanArabicText(s).includes(cleanArabicText(query)));
    updateSelect(filtered);

    const cleanQuery = cleanArabicText(query);
    const matches = allSurahs.filter(surah => cleanArabicText(surah.name).includes(cleanQuery));

    if (matches.length > 0) {
        suggestionsList.style.display = 'block';
        matches.forEach(surah => {
            const li = document.createElement('li');
            li.textContent = ` 🕌 سورة ${surah.name} (رقم ${surah.number})`;
            styleListItem(li);
            li.addEventListener('click', () => {
                surahSelect.value = surah.number.toString().padStart(3, '0');
                setAudioSource();
                searchInput.value = `سورة ${surah.name}`;
                suggestionsList.style.display = 'none';
            });
            suggestionsList.appendChild(li);
        });
    } else { suggestionsList.style.display = 'none'; }
});

function styleListItem(li) {
    li.style.padding = '10px'; li.style.cursor = 'pointer'; li.style.borderBottom = '1px solid #eeeeee';
    li.style.backgroundColor = '#ffffff'; li.style.color = '#222222'; li.style.textAlign = 'right';
    li.addEventListener('mouseenter', () => { li.style.backgroundColor = '#e0f7fa'; });
    li.addEventListener('mouseleave', () => { li.style.backgroundColor = '#ffffff'; });
}

document.addEventListener('click', (e) => { if (e.target !== searchInput) suggestionsList.style.display = 'none'; });

// وظائف التحكم بنوافذ المشاركة الجديدة
function openShareModal() {
    shareModal.style.display = 'flex';
    // ملء اسم السورة الحالية تلقائياً في خانة البحث لتسهيل الأمر على المستخدم
    modalSurahInput.value = surahSelect.options[surahSelect.selectedIndex].text;
}

function closeShareModal() {
    shareModal.style.display = 'none';
}

function setShareType(type) {
    selectedShareType = type;
    document.getElementById('typeVoice').classList.remove('active');
    document.getElementById('typeImage').classList.remove('active');
    document.getElementById('typeText').classList.remove('active');

    if (type === 'voice') document.getElementById('typeVoice').classList.add('active');
    if (type === 'image') document.getElementById('typeImage').classList.add('active');
    
    // إذا اختار العميل "كتابة"، يظهر سطر الحقوق فوراً تحتها
    if (type === 'text') {
        document.getElementById('typeText').classList.add('active');
        creditText.style.display = 'block';
    } else {
        creditText.style.display = 'none';
    }
}

// دالة تنفيذ عملية المشاركة إلى التطبيقات الأخرى (تعتمد على ميزة المتصفح الأصلية للتنقل)
function executeShare() {
    const surahName = modalSurahInput.value.trim();
    const reciterName = modalReciterSelect.value;
    
    if (!surahName) {
        alert('الرجاء كتابة اسم السورة أولاً');
        return;
    }
    if (!selectedShareType) {
        alert('الرجاء اختيار نوع المشاركة (صوت، صورة، أو كتابة)');
        return;
    }

    let shareData = {
        title: 'مشاركة من تطبيق القرآن الكريم',
        text: ''
    };

    // تجهيز النص بناء على نوع الاختيار
    if (selectedShareType === 'text') {
        shareData.text = `📖 تلاوة من سورة ${surahName}\n🎙️ بصوت الشيخ: ${reciterName}\n\nتم استخدام موقع https://n9.cl/g0h73t`;
    } else if (selectedShareType === 'voice') {
        shareData.text = `🔊 استمع إلى سورة ${surahName} بصوت الشيخ ${reciterName} عبر تطبيقنا المتميز.`;
    } else if (selectedShareType === 'image') {
        shareData.text = `🖼️ تفقد آيات سورة ${surahName} المكتوبة والمنسقة بصوت القارئ ${reciterName}.`;
    }

    // فتح واجهة مشاركة النظام للهاتف أو الكمبيوتر لمشاركتها لأي تطبيق خارجي (واتساب، تيليجرام إلخ)
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => closeShareModal())
            .catch((error) => console.log('خطأ أثناء المشاركة:', error));
    } else {
        // حل بديل في حال كان المتصفح لا يدعم خاصية المشاركة المباشرة
        alert(`نص المشاركة جاهز:\n\n${shareData.text}`);
    }
}

setTimeout(() => {
    const overlay = document.getElementById('intro-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 1000);
    }
}, 3000);
    
