/* ==========================================================================
   DEDICATORIA ROMÁNTICA - ENGINE WITH SCRATCH CARD + MIC BLOW
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let toastTimer = null;

    // ------------------------------------------------------------------
    // 1. STATE
    // ------------------------------------------------------------------
    const state = {
        isCandleLit: true,
        isEnvelopeOpen: false,
        canOpenEnvelope: false,
        isBouquetRevealed: false,
        soundEnabled: false,
        micEnabled: false,
        scratchPercent: 0,
        scratchRevealed: false,
        activeTheme: 'theme-rose'
    };

    // ------------------------------------------------------------------
    // 2. DOM ELEMENTS
    // ------------------------------------------------------------------
    const $ = (id) => document.getElementById(id);

    const el = {
        // Scratch
        scratchCanvas: $('scratch-canvas'),
        scratchFill: $('scratch-fill'),
        scratchMessage: $('scratch-message'),

        // Sections for progressive unlock
        bouquetSection: $('bouquet-section'),
        scratchSection: $('scratch-section'),
        cakeSection: $('cake-section'),
        letterSection: $('letter-section'),

        // Cake
        cakeInteractive: $('cake-interactive'),
        candleFlame: $('candle-flame'),
        heartSmoke: $('heart-smoke'),
        micStatusBox: $('mic-status-box'),
        micIcon: $('mic-icon'),
        micStatusTxt: $('mic-status-txt'),

        // Bouquet
        bouquetInteractive: $('bouquet-interactive'),
        bouquetHint: $('bouquet-hint'),
        bouquetNote: $('bouquet-note'),

        // Envelope
        envelopeInteractive: $('envelope-interactive'),
        envelopeElement: $('envelope-element'),
        letterSection: $('letter-section'),
        displayRecipient: $('display-recipient'),
        displayLetterText: $('display-letter-text'),
        displaySender: $('display-sender'),

        // Controls
        micBtn: $('mic-btn'),
        soundBtn: $('sound-btn'),
        settingsBtn: $('settings-btn'),
        settingsModal: $('settings-modal'),
        closeModal: $('close-modal'),
        saveSettingsBtn: $('save-settings-btn'),

        // Inputs
        inputScratchMsg: $('input-scratch-msg'),
        inputRecipient: $('input-recipient'),
        inputLetter: $('input-letter'),
        inputSender: $('input-sender'),
        themePickBtns: document.querySelectorAll('.theme-pick-btn'),

        // Trail & Toast
        touchTrailContainer: $('touch-trail-container'),
        toast: $('toast'),
        toastTxt: $('toast-txt')
    };

    // ------------------------------------------------------------------
    // PROGRESSIVE STEP UNLOCK MANAGER
    // ------------------------------------------------------------------
    const stepSections = {
        bouquet: el.bouquetSection,
        scratch: el.scratchSection,
        cake: el.cakeSection,
        letter: el.letterSection
    };

    function initProgressiveSteps() {
        if (el.scratchSection) el.scratchSection.classList.add('step-locked');
        if (el.cakeSection) el.cakeSection.classList.add('step-locked');
        if (el.letterSection) el.letterSection.classList.add('step-locked');
    }

    function unlockStep(stepName) {
        const sec = stepSections[stepName];
        if (!sec) return;

        if (sec.classList.contains('step-locked')) {
            sec.classList.remove('step-locked');
            sec.classList.add('step-unlocked');

            if (stepName === 'scratch') {
                setTimeout(() => {
                    initScratchCard();
                }, 100);
            }

            if (stepName === 'letter') {
                // Guarantee envelope stays closed and resists accidental tap until scroll finishes
                state.canOpenEnvelope = false;
                setTimeout(() => {
                    state.canOpenEnvelope = true;
                }, 1000);
            }

            setTimeout(() => {
                sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 350);
        }
    }

    initProgressiveSteps();

    // ------------------------------------------------------------------
    // 3. GERBERA PETAL GENERATION
    // ------------------------------------------------------------------
    function initGerberas() {
        const heads = document.querySelectorAll('.gerbera-head');
        const OUTER_PETALS = 16;
        const INNER_PETALS = 16;

        heads.forEach(head => {
            // Clear any existing content
            head.innerHTML = '';

            // Create outer petals
            for (let i = 0; i < OUTER_PETALS; i++) {
                const petal = document.createElement('div');
                petal.className = 'gerbera-petal outer';
                const angle = (360 / OUTER_PETALS) * i;
                petal.style.transform = `rotate(${angle}deg)`;
                head.appendChild(petal);
            }

            // Create inner petals (offset by half a petal)
            for (let i = 0; i < INNER_PETALS; i++) {
                const petal = document.createElement('div');
                petal.className = 'gerbera-petal inner';
                const angle = (360 / INNER_PETALS) * i + (360 / INNER_PETALS / 2);
                petal.style.transform = `rotate(${angle}deg)`;
                head.appendChild(petal);
            }

            // Create center disc
            const center = document.createElement('div');
            center.className = 'gerbera-center';
            head.appendChild(center);
        });
    }

    initGerberas();

    // ------------------------------------------------------------------
    // 4. SCRATCH CARD ENGINE (Canvas Touch/Mouse Scratch)
    // ------------------------------------------------------------------
    const scratchCanvas = el.scratchCanvas;
    const scratchCtx = scratchCanvas.getContext('2d');
    let isScratching = false;

    function initScratchCard() {
        // Size canvas to wrapper
        const wrapper = scratchCanvas.parentElement;
        const rect = wrapper.getBoundingClientRect();
        const w = rect.width || wrapper.offsetWidth || 360;
        const h = rect.height || wrapper.offsetHeight || 220;
        scratchCanvas.width = w;
        scratchCanvas.height = h;

        // Draw the golden scratchable cover
        const grad = scratchCtx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#d4af37');
        grad.addColorStop(0.3, '#f5d060');
        grad.addColorStop(0.5, '#ffd700');
        grad.addColorStop(0.7, '#daa520');
        grad.addColorStop(1, '#b8860b');
        scratchCtx.fillStyle = grad;
        scratchCtx.fillRect(0, 0, w, h);

        // Add sparkle pattern text
        scratchCtx.font = '700 16px Outfit, sans-serif';
        scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        scratchCtx.textAlign = 'center';
        scratchCtx.fillText('✨  RASPA AQUÍ CON TU DEDO  ✨', w / 2, h / 2 - 10);
        scratchCtx.font = '500 12px Outfit, sans-serif';
        scratchCtx.fillText('Desliza para descubrir tu mensaje secreto', w / 2, h / 2 + 15);

        // Sparkle dots
        for (let i = 0; i < 60; i++) {
            scratchCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
            scratchCtx.beginPath();
            scratchCtx.arc(
                Math.random() * w,
                Math.random() * h,
                Math.random() * 2 + 0.5,
                0, Math.PI * 2
            );
            scratchCtx.fill();
        }
    }

    function scratch(x, y) {
        scratchCtx.globalCompositeOperation = 'destination-out';
        scratchCtx.beginPath();
        scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
        scratchCtx.fill();

        checkScratchProgress();
    }

    function checkScratchProgress() {
        const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        const total = pixels.length / 4;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) transparent++;
        }

        state.scratchPercent = (transparent / total) * 100;
        el.scratchFill.style.width = `${Math.min(state.scratchPercent, 100)}%`;

        if (state.scratchPercent > 50 && !state.scratchRevealed) {
            state.scratchRevealed = true;
            // Clear entire canvas to fully reveal
            scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
            scratchCanvas.style.pointerEvents = 'none';
            el.scratchFill.style.width = '100%';
            playChime();
            showToast('💖 ¡Mensaje secreto descubierto! 🎂');
            unlockStep('cake');
        }
    }

    function getScratchPos(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        const scaleX = scratchCanvas.width / (rect.width || 1);
        const scaleY = scratchCanvas.height / (rect.height || 1);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // Mouse events
    scratchCanvas.addEventListener('mousedown', (e) => { isScratching = true; const p = getScratchPos(e); scratch(p.x, p.y); });
    scratchCanvas.addEventListener('mousemove', (e) => { if (isScratching) { const p = getScratchPos(e); scratch(p.x, p.y); } });
    scratchCanvas.addEventListener('mouseup', () => { isScratching = false; });
    scratchCanvas.addEventListener('mouseleave', () => { isScratching = false; });

    // Touch events (Android optimized)
    scratchCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); isScratching = true; const p = getScratchPos(e); scratch(p.x, p.y); }, { passive: false });
    scratchCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (isScratching) { const p = getScratchPos(e); scratch(p.x, p.y); } }, { passive: false });
    scratchCanvas.addEventListener('touchend', () => { isScratching = false; });

    initScratchCard();

    // ------------------------------------------------------------------
    // 4. TOUCH TRAIL (Hearts follow finger on Android)
    // ------------------------------------------------------------------
    function spawnTrailHeart(x, y) {
        const heart = document.createElement('span');
        heart.className = 'trail-heart';
        heart.textContent = ['💖', '💕', '✨', '❤️'][Math.floor(Math.random() * 4)];
        heart.style.left = `${x - 12}px`;
        heart.style.top = `${y - 12}px`;
        el.touchTrailContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 700);
    }

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) spawnTrailHeart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.7) spawnTrailHeart(e.clientX, e.clientY);
    });

    // ------------------------------------------------------------------
    // 5. CANDLE BLOW (MIC + TOUCH)
    // ------------------------------------------------------------------
    function blowOutCandle() {
        if (!state.isCandleLit) return;
        state.isCandleLit = false;
        el.candleFlame.classList.add('extinguished');
        el.heartSmoke.classList.add('active');
        playChime();
        showToast('¡Tu deseo ha volado al cielo! ✉️ Toca el sobre para abrir tu carta');

        unlockStep('letter');
    }

    function relightCandle() {
        state.isCandleLit = true;
        el.candleFlame.classList.remove('extinguished');
        el.heartSmoke.classList.remove('active');
        showToast('¡Vela reencendida! 🕯️');
    }

    el.cakeInteractive.addEventListener('click', (e) => {
        if (e) e.stopPropagation();
        if (state.isCandleLit) blowOutCandle();
        else relightCandle();
    });

    // Microphone Blow Detection
    let audioCtx = null;
    let analyserNode = null;
    let micStream = null;

    async function toggleMic() {
        if (!state.micEnabled) {
            try {
                micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                analyserNode = audioCtx.createAnalyser();
                audioCtx.createMediaStreamSource(micStream).connect(analyserNode);
                analyserNode.fftSize = 256;

                state.micEnabled = true;
                el.micBtn.classList.add('active');
                el.micStatusBox.classList.add('active');
                el.micIcon.className = 'fa-solid fa-microphone';
                el.micStatusTxt.textContent = '🎙️ ¡Sopla cerca de tu pantalla!';
                showToast('🎙️ ¡Sopla para apagar la vela!');
                listenForBlow();
            } catch (err) {
                showToast('Concede permiso de micrófono o toca la vela directamente');
            }
        } else {
            if (micStream) micStream.getTracks().forEach(t => t.stop());
            state.micEnabled = false;
            el.micBtn.classList.remove('active');
            el.micStatusBox.classList.remove('active');
            el.micIcon.className = 'fa-solid fa-microphone-slash';
            el.micStatusTxt.textContent = 'Toca 🎙️ arriba para soplar con tu micrófono';
            showToast('Micrófono desactivado 🔇');
        }
    }

    function listenForBlow() {
        if (!state.micEnabled || !state.isCandleLit || !analyserNode) return;

        const data = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(data);

        let sum = 0;
        for (let i = 0; i < 15; i++) sum += data[i];
        if (sum / 15 > 40) { blowOutCandle(); return; }

        requestAnimationFrame(listenForBlow);
    }

    if (el.micBtn) el.micBtn.addEventListener('click', toggleMic);
    if (el.micStatusBox) el.micStatusBox.addEventListener('click', toggleMic);

    // ------------------------------------------------------------------
    // 6. GERBERA BOUQUET INTERACTION
    // ------------------------------------------------------------------
    function revealBouquetNote() {
        if (state.isBouquetRevealed) return;
        state.isBouquetRevealed = true;

        // Bloom animation on flowers
        el.bouquetInteractive.classList.add('tapped');

        // Hide the tap hint
        el.bouquetHint.classList.add('hidden');

        // Reveal the note card after a short delay
        setTimeout(() => {
            el.bouquetNote.classList.add('revealed');
            playChime();
            showToast('🌸 ¡Un mensaje especial entre los pétalos! ✨');
            unlockStep('scratch');
        }, 500);
    }

    el.bouquetInteractive.addEventListener('click', revealBouquetNote);

    // ------------------------------------------------------------------
    // 7. ENVELOPE & LETTER
    // ------------------------------------------------------------------
    function openEnvelope(e) {
        if (e) e.stopPropagation();
        if (!state.canOpenEnvelope) return;
        if (!state.isEnvelopeOpen) {
            state.isEnvelopeOpen = true;
            el.envelopeElement.classList.add('open');
            playChime();
            showToast('💌 ¡Carta desplegada con todo mi amor!');
        }
    }

    el.envelopeInteractive.addEventListener('click', openEnvelope);

    // ------------------------------------------------------------------
    // 7. AUDIO CHIME
    // ------------------------------------------------------------------
    function playChime() {
        if (!state.soundEnabled) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                setTimeout(() => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start();
                    osc.stop(audioCtx.currentTime + 0.3);
                }, i * 150);
            });
        } catch (e) {}
    }

    if (el.soundBtn) {
        el.soundBtn.addEventListener('click', () => {
            state.soundEnabled = !state.soundEnabled;
            el.soundBtn.classList.toggle('active', state.soundEnabled);
            playChime();
            showToast(state.soundEnabled ? 'Sonido activado 🎵' : 'Sonido silenciado 🔇');
        });
    }

    // ------------------------------------------------------------------
    // 8. SETTINGS MODAL
    // ------------------------------------------------------------------
    if (el.settingsBtn) el.settingsBtn.addEventListener('click', () => el.settingsModal.classList.add('open'));
    if (el.closeModal) el.closeModal.addEventListener('click', () => el.settingsModal.classList.remove('open'));

    if (el.themePickBtns) {
        el.themePickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                el.themePickBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeTheme = btn.getAttribute('data-theme');
            });
        });
    }

    if (el.saveSettingsBtn) {
        el.saveSettingsBtn.addEventListener('click', () => {
            const revealedText = document.querySelector('.revealed-text');
            if (revealedText && el.inputScratchMsg) {
                revealedText.textContent = el.inputScratchMsg.value;
            }

            if (el.displayRecipient) el.displayRecipient.textContent = el.inputRecipient.value || '¡Feliz Cumpleaños!';
            if (el.displayLetterText) {
                el.displayLetterText.innerHTML = el.inputLetter.value
                    .split('\n\n')
                    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
                    .join('');
            }
            if (el.displaySender) el.displaySender.textContent = el.inputSender.value || '❤️';
            document.body.className = state.activeTheme;

            if (el.settingsModal) el.settingsModal.classList.remove('open');
            showToast('¡Guardado! 💕');
        });
    }

    // ------------------------------------------------------------------
    // 9. TOAST (Disabled per user request)
    // ------------------------------------------------------------------
    function showToast(msg) {
        return;
    }
});
