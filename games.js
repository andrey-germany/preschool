// Shared game utilities and localization

const localizedStrings = {
    'de': {
        instruction: 'Tippe den angezeigten Buchstaben in das Feld.',
        pageTitle: 'Lerne das Alphabet',
        wordInstruction: 'Vervollständige das Wort mit den fehlenden Buchstaben.',
        gameHub: 'ABC Lernspiele',
        wordGuess: 'Wortratespiel',
        alphabetGame: 'Alphabet Übung',
        backToHub: 'Zurück zum Menü'
    },
    'en': {
        instruction: 'Type the displayed letter in the field.',
        pageTitle: 'Learn the Alphabet',
        wordInstruction: 'Complete the word with the missing letters.',
        gameHub: 'ABC Learning Games',
        wordGuess: 'Word Guess Game',
        alphabetGame: 'Alphabet Practice',
        backToHub: 'Back to Menu'
    }
};

// Get localized strings based on browser language
function getLocalizedStrings() {
    const lang = navigator.language || navigator.languages[0];
    const primaryLang = lang.split('-')[0];
    return localizedStrings[primaryLang] || localizedStrings['en'];
}

// Set page language
function setPageLanguage() {
    const lang = navigator.language || navigator.languages[0];
    const primaryLang = lang.split('-')[0];
    document.documentElement.lang = primaryLang;
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate random bright color
function getRandomColor() {
    const hue = Math.random() * 360;
    const saturation = 70 + Math.random() * 30;
    const lightness = 60 + Math.random() * 20;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Set random gradient background
function setRandomGradientBackground() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    const color3 = getRandomColor();
    const angle = Math.floor(Math.random() * 360);
    document.body.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`;
}

// Trigger confetti emoji animation
function triggerReward(sourceElement) {
    const rewardEmojis = ['🎉', '✨', '🎈', '🌟', '🎊'];
    const rewardContainer = document.getElementById('reward-container') || createRewardContainer();

    const elementRect = sourceElement.getBoundingClientRect();
    const startX = elementRect.left + elementRect.width / 2;
    const startY = elementRect.top + elementRect.height / 2;

    const numberOfEmojis = 15;
    const travelDistance = 150;
    const animationDuration = 1500;

    for (let i = 0; i < numberOfEmojis; i++) {
        const emojiSpan = document.createElement('span');
        emojiSpan.classList.add('confetti-emoji');
        emojiSpan.textContent = rewardEmojis[Math.floor(Math.random() * rewardEmojis.length)];

        emojiSpan.style.left = `${startX}px`;
        emojiSpan.style.top = `${startY}px`;

        rewardContainer.appendChild(emojiSpan);

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * travelDistance;
        const targetX = distance * Math.cos(angle);
        const targetY = distance * Math.sin(angle);

        setTimeout(() => {
            emojiSpan.style.transform = `translate(${targetX}px, ${targetY}px)`;
            emojiSpan.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            emojiSpan.remove();
        }, animationDuration + 50);
    }
}

// Create reward container if it doesn't exist
function createRewardContainer() {
    let container = document.getElementById('reward-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'reward-container';
        container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100;';
        document.body.appendChild(container);
    }
    return container;
}

// Add global confetti styles
function addConfettiStyles() {
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            .confetti-emoji {
                position: absolute;
                font-size: 3.5em;
                opacity: 1;
                transition: transform 1.5s ease-out, opacity 1.5s ease-out;
                will-change: transform, opacity;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize confetti on page load
addConfettiStyles();

// ========== SESSION TIMER (Improvement 1.2) ==========

// Session timer manager for attention-span optimization
class SessionTimer {
    constructor(sessionLengthMinutes = 10) {
        this.totalSeconds = sessionLengthMinutes * 60;
        this.remainingSeconds = this.totalSeconds;
        this.isRunning = false;
        this.timerInterval = null;
        this.timerElement = null;
        this.progressBar = null;
        this.onTimeEnd = null;
    }

    // Create timer UI in top-right corner
    createTimerUI() {
        // Timer container
        const timerContainer = document.createElement('div');
        timerContainer.id = 'session-timer-container';
        timerContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 15px 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            min-width: 140px;
            text-align: center;
            font-weight: 600;
        `;

        // Timer display
        this.timerElement = document.createElement('div');
        this.timerElement.id = 'session-timer-display';
        this.timerElement.style.cssText = `
            font-size: 1.8em;
            color: #333;
            font-variant-numeric: tabular-nums;
            margin-bottom: 8px;
        `;
        this.timerElement.textContent = this.formatTime(this.remainingSeconds);

        // Progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.id = 'session-timer-progress';
        this.progressBar.style.cssText = `
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
        `;

        const progressFill = document.createElement('div');
        progressFill.id = 'session-timer-fill';
        progressFill.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #8BC34A);
            width: 100%;
            transition: width 0.5s ease;
        `;
        this.progressBar.appendChild(progressFill);

        // Label
        const label = document.createElement('div');
        label.style.cssText = `
            font-size: 0.75em;
            color: #999;
            margin-top: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        `;
        label.textContent = 'Spielsitzung';

        timerContainer.appendChild(this.timerElement);
        timerContainer.appendChild(this.progressBar);
        timerContainer.appendChild(label);

        document.body.appendChild(timerContainer);
    }

    // Format seconds to MM:SS
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    // Start timer countdown
    start() {
        if (this.isRunning) return;

        this.createTimerUI();
        this.isRunning = true;

        this.timerInterval = setInterval(() => {
            this.remainingSeconds--;
            this.updateDisplay();

            if (this.remainingSeconds <= 0) {
                this.end();
            }
        }, 1000);
    }

    // Update timer display and progress bar
    updateDisplay() {
        if (!this.timerElement) return;

        this.timerElement.textContent = this.formatTime(this.remainingSeconds);

        // Update progress bar
        const progressFill = document.getElementById('session-timer-fill');
        if (progressFill) {
            const percentage = (this.remainingSeconds / this.totalSeconds) * 100;
            progressFill.style.width = `${percentage}%`;

            // Change color as time runs out
            if (this.remainingSeconds <= this.totalSeconds * 0.25) {
                progressFill.style.background = 'linear-gradient(90deg, #f44336, #FF6F00)';  // Red
            } else if (this.remainingSeconds <= this.totalSeconds * 0.5) {
                progressFill.style.background = 'linear-gradient(90deg, #FFC107, #FF9800)';  // Yellow
            }
        }

        // Play warning sound when 1 minute remains
        if (this.remainingSeconds === 60) {
            this.playWarningSound();
        }
    }

    // End session and show completion message
    end() {
        clearInterval(this.timerInterval);
        this.isRunning = false;

        const timerContainer = document.getElementById('session-timer-container');
        if (timerContainer) {
            timerContainer.style.background = 'linear-gradient(135deg, #4CAF50, #8BC34A)';
            this.timerElement.textContent = '✓ Abgeschlossen!';
            this.timerElement.style.color = 'white';
            const label = timerContainer.querySelector('div:last-child');
            if (label) label.style.color = 'rgba(255, 255, 255, 0.8)';
        }

        // Show completion modal
        this.showCompletionModal();

        if (this.onTimeEnd) {
            this.onTimeEnd();
        }
    }

    // Show completion celebration modal
    showCompletionModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        `;

        content.innerHTML = `
            <div style="font-size: 4em; margin-bottom: 20px;">🎉</div>
            <h2 style="font-size: 1.8em; color: #4CAF50; margin-bottom: 15px;">Großartig!</h2>
            <p style="font-size: 1.1em; color: #666; margin-bottom: 25px;">
                Du hast eine tolle Spielsitzung abgeschlossen! Zeit für eine Pause.
            </p>
            <button onclick="this.closest('div').parentElement.remove()" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 8px;
                font-size: 1em;
                font-weight: 600;
                cursor: pointer;
                min-width: 50px;
                min-height: 50px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            ">Okay!</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Add animation styles
        if (!document.getElementById('session-timer-styles')) {
            const style = document.createElement('style');
            style.id = 'session-timer-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Play warning beep sound (for 1 minute remaining)
    playWarningSound() {
        try {
            // Use Web Audio API for simple beep
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Fallback if Web Audio API not available
            console.log('Warning: 1 minute remaining');
        }
    }

    // Stop timer
    stop() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
    }

    // Destroy timer and remove UI
    destroy() {
        this.stop();
        const timerContainer = document.getElementById('session-timer-container');
        if (timerContainer) {
            timerContainer.remove();
        }
    }
}
