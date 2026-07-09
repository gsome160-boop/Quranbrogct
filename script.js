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
    
    // 1. حالة المشاركة الصوتية
    if (selectedShareType === 'voice') {
        const audioUrl = modalReciterSelect.value + surahNum.toString().padStart(3, '0') + ".mp3";
        let voiceText = `🎙️ استمع إلى سورة ${surahName} كاملة بصوت الشيخ ${reciterName}:\n🔗 الرابط: ${audioUrl}`;
        sendToShareApi({ title: 'مشاركة صوتية', text: voiceText });
        return;
    }

    // جلب نص الآيات للحالات الأخرى (نص أو صورة)
    fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)
        .then(res => res.json())
        .then(data => {
            const fromAyah = parseInt(fromAyahInput.value);
            const toAyah = parseInt(toAyahInput.value);
            const selectedTextAyahs = data.data.ayahs.slice(fromAyah - 1, toAyah);

            // 2. حالة المشاركة النصية (📝 كتابة) - هنا نترك القارئ والموقع طبيعي
            if (selectedShareType === 'text') {
                let textToShare = `📖 سورة ${surahName} (الآيات من ${fromAyah} إلى ${toAyah})\n\n`;
                selectedTextAyahs.forEach(a => { textToShare += `${a.text} ﴿${a.numberInSurah}﴾ `; });
                textToShare += `\n\n🎙️ بصوت الشيخ: ${reciterName}\nتم استخدام موقع https://n9.cl/g0h73t`;
                sendToShareApi({ title: 'مشاركة آيات قرآنية', text: textToShare });
            } 
            // 3. حالة المشاركة كصورة (🖼️ صورة) - تم إزالة اسم القارئ تماماً من النص المرفق
            else if (selectedShareType === 'image') {
                generateAndShareImage(surahName, selectedTextAyahs);
            }
        }).catch(() => alert('حدث خطأ، تأكد من اتصال الإنترنت.'));
}
