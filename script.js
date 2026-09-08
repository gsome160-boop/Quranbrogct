function generateAndShareImage(surahName, ayahs) {
        const canvas = document.getElementById('shareCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        canvas.width = 600; 
        canvas.height = 800; 
        
        let combinedText = '';
        ayahs.forEach(a => { combinedText += `${a.text} ﴿${a.numberInSurah}﴾ `; });

        let fontSize = 26; 
        let lines = [];
        const maxWidth = 500; 
        const maxHeight = 540; 

        while (fontSize > 10) {
            ctx.font = `${fontSize}px sans-serif`;
            lines = [];
            let words = combinedText.split(' ');
            let currentLine = '';

            for (let n = 0; n < words.length; n++) {
                let testLine = currentLine + words[n] + ' ';
                let metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    lines.push(currentLine);
                    currentLine = words[n] + ' ';
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            let totalTextHeight = lines.length * (fontSize + 12);
            if (totalTextHeight <= maxHeight) {
                break; 
            }
            fontSize -= 1; 
        }

        // إيجاد رقم السورة
        const cleanInput = cleanArabicText(surahName);
        const surahIndex = quranSurahsData.findIndex(s => cleanArabicText(s.name) === cleanInput);
        const surahNumber = surahIndex !== -1 ? (surahIndex + 1) : '';

        // خلفية وإطار
        ctx.fillStyle = '#1a5235'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ffb300'; ctx.lineWidth = 6; ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        // اسم السورة
        ctx.fillStyle = '#ffffff'; 
        ctx.font = 'bold 30px sans-serif'; 
        ctx.textAlign = 'center';
        ctx.fillText(`سورة ${surahName}`, canvas.width / 2, 65);

        // رقم السورة تحت الاسم مباشرة
        ctx.fillStyle = '#ffb300'; 
        ctx.font = 'bold 22px sans-serif'; 
        ctx.fillText(`رقم السورة: ${surahNumber}`, canvas.width / 2, 95);
        
        // كتابة الآيات
        ctx.fillStyle = '#ffffff';
        ctx.font = `${fontSize}px sans-serif`;
        let currentY = 150;
        lines.forEach(line => {
            ctx.fillText(line, canvas.width / 2, currentY);
            currentY += (fontSize + 12);
        });

        // رابط الموقع بأسفل الصورة
        ctx.fillStyle = '#ffb300';
        ctx.font = '20px sans-serif';
        ctx.fillText('تم استخدام موقع https://n9.cl/g0h73t', canvas.width / 2, 750);

        canvas.toBlob((blob) => {
            const file = new File([blob], 'quran_ayah.png', { type: 'image/png' });
            
            let captionText = `📖 تفقد آيات سورة ${surahName} (رقمها: ${surahNumber}) المكتوبة والمنسقة عبر تطبيقنا.\nتم استخدام موقع https://n9.cl/g0h73t`;
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({ 
                    files: [file], 
                    title: 'صورة الآيات الكريمة',
                    text: captionText 
                }).then(() => closeShareModal()).catch(err => console.log(err));
            } else {
                alert('اضغط على الصورة مطولاً لحفظها ومشاركتها يدويًا.');
                window.open(canvas.toDataURL());
            }
        });
    }
