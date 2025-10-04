// 闪卡学习系统主程序
// Flashcard Learning System Main Script

class FlashcardApp {
    constructor() {
        this.currentData = 'vocabulary';
        this.currentUnit = 'all';
        this.currentIndex = 0;
        this.isFlipped = false;
        this.isShuffled = false;
        this.isAutoPlay = false;
        this.isRepeatMode = false;
        this.originalData = [];
        this.filteredData = [];
        this.studyStats = {
            totalStudied: 0,
            correctCount: 0,
            hardCount: 0,
            startTime: Date.now()
        };
        this.autoPlayInterval = null;
        this.audioManager = null;

        this.init();
    }

    init() {
        // 初始化音频管理器
        this.initAudioManager();

        this.loadData();
        this.bindEvents();
        this.updateDisplay();
        this.updateStats();
    }

    initAudioManager() {
        if (typeof AudioManager !== 'undefined') {
            this.audioManager = new AudioManager();
            console.log('音频管理器已初始化');
        } else {
            console.warn('AudioManager 未找到，将使用传统语音合成');
        }
    }

    loadData() {
        this.originalData = [...flashcardData[this.currentData]];
        this.filterData();
    }

    filterData() {
        if (this.currentUnit === 'all') {
            this.filteredData = this.isShuffled ?
                [...this.originalData].sort(() => Math.random() - 0.5) :
                [...this.originalData];
        } else {
            const unitNumber = parseInt(this.currentUnit);
            const unitData = this.originalData.filter(item => item.unit === unitNumber);
            this.filteredData = this.isShuffled ?
                unitData.sort(() => Math.random() - 0.5) :
                unitData;
        }

        this.currentIndex = 0;
        this.isFlipped = false;
        this.updateDisplay();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('vocabBtn').addEventListener('click', () => this.switchDataType('vocabulary'));
        document.getElementById('phraseBtn').addEventListener('click', () => this.switchDataType('phrases'));
        document.getElementById('sentenceBtn').addEventListener('click', () => this.switchDataType('sentences'));

        // Unit selector
        document.getElementById('unitSelect').addEventListener('change', (e) => {
            this.currentUnit = e.target.value;
            this.filterData();
        });

        // Control buttons
        document.getElementById('shuffleBtn').addEventListener('click', () => this.toggleShuffle());
        document.getElementById('autoPlayBtn').addEventListener('click', () => this.toggleAutoPlay());
        document.getElementById('repeatBtn').addEventListener('click', () => this.toggleRepeatMode());

        // Flashcard interaction
        document.getElementById('flashcard').addEventListener('click', () => this.flipCard());
        document.getElementById('pronunciationBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.playPronunciation();
        });

        // Navigation arrows
        document.getElementById('prevBtn').addEventListener('click', () => this.previousCard());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextCard());

        // Difficulty buttons
        document.getElementById('hardBtn').addEventListener('click', () => this.markDifficulty('hard'));
        document.getElementById('goodBtn').addEventListener('click', () => this.markDifficulty('good'));
        document.getElementById('easyBtn').addEventListener('click', () => this.markDifficulty('easy'));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousCard();
                    break;
                case 'ArrowRight':
                    this.nextCard();
                    break;
                case ' ':
                    e.preventDefault();
                    this.flipCard();
                    break;
                case '1':
                    this.markDifficulty('hard');
                    break;
                case '2':
                    this.markDifficulty('good');
                    break;
                case '3':
                    this.markDifficulty('easy');
                    break;
                case 'p':
                    this.playPronunciation();
                    break;
            }
        });
    }

    switchDataType(type) {
        this.currentData = type;

        // Update button states
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        if (type === 'vocabulary') {
            document.getElementById('vocabBtn').classList.add('active');
        } else if (type === 'phrases') {
            document.getElementById('phraseBtn').classList.add('active');
        } else if (type === 'sentences') {
            document.getElementById('sentenceBtn').classList.add('active');
        }

        this.loadData();
        this.updateDisplay();
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const btn = document.getElementById('shuffleBtn');
        btn.classList.toggle('active');

        if (this.isShuffled) {
            this.filteredData.sort(() => Math.random() - 0.5);
            this.currentIndex = 0;
        } else {
            this.filterData();
        }

        this.updateDisplay();
    }

    toggleAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
        const btn = document.getElementById('autoPlayBtn');
        btn.classList.toggle('active');

        if (this.isAutoPlay) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        this.autoPlayInterval = setInterval(() => {
            if (this.isFlipped) {
                this.nextCard();
            } else {
                this.flipCard();
            }
        }, 3000);

        this.showAutoPlayIndicator();
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.hideAutoPlayIndicator();
    }

    showAutoPlayIndicator() {
        let indicator = document.querySelector('.auto-play-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'auto-play-indicator';
            indicator.textContent = '自动播放中...';
            document.body.appendChild(indicator);
        }
        indicator.classList.add('active');
    }

    hideAutoPlayIndicator() {
        const indicator = document.querySelector('.auto-play-indicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    toggleRepeatMode() {
        this.isRepeatMode = !this.isRepeatMode;
        const btn = document.getElementById('repeatBtn');
        btn.classList.toggle('active');
    }

    flipCard() {
        this.isFlipped = !this.isFlipped;
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.toggle('flipped');

        if (this.isFlipped) {
            this.studyStats.totalStudied++;
            this.updateStats();
            this.playPronunciation();
        }
    }

    async playPronunciation() {
        const currentCard = this.filteredData[this.currentIndex];
        if (!currentCard) return;

        // 优先使用音频管理器播放本地文件
        if (this.audioManager) {
            try {
                const options = {};
                // 如果是句子且有keyWords，传递keyWords
                if (this.currentData === 'sentences' && currentCard.keyWords) {
                    options.keyWords = currentCard.keyWords;
                }

                const success = await this.audioManager.playAudio(
                    currentCard.english,
                    this.currentData,
                    options
                );

                if (success) {
                    console.log('使用本地音频文件播放成功');
                    return;
                }
            } catch (error) {
                console.warn('音频管理器播放失败，使用备用方法:', error);
            }
        }

        // 回退到传统的Web Speech API
        this.playWebSpeechFallback(currentCard.english);
    }

    playWebSpeechFallback(text) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            utterance.volume = 1;

            window.speechSynthesis.speak(utterance);
        }
    }

    previousCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.isFlipped = false;
            this.updateDisplay();
        } else if (this.isRepeatMode) {
            this.currentIndex = this.filteredData.length - 1;
            this.isFlipped = false;
            this.updateDisplay();
        }
    }

    nextCard() {
        if (this.currentIndex < this.filteredData.length - 1) {
            this.currentIndex++;
            this.isFlipped = false;
            this.updateDisplay();
        } else if (this.isRepeatMode) {
            this.currentIndex = 0;
            this.isFlipped = false;
            this.updateDisplay();
        }
    }

    markDifficulty(level) {
        if (!this.isFlipped) {
            this.flipCard();
        }

        if (level === 'easy') {
            this.studyStats.correctCount++;
        } else if (level === 'hard') {
            this.studyStats.hardCount++;
        }

        this.updateStats();

        // Auto advance to next card after marking difficulty
        setTimeout(() => {
            this.nextCard();
        }, 500);
    }

    updateDisplay() {
        if (this.filteredData.length === 0) {
            document.getElementById('englishText').textContent = '没有内容';
            document.getElementById('chineseText').textContent = 'No content available';
            document.getElementById('unitInfo').textContent = '';
            document.getElementById('currentCard').textContent = '0';
            document.getElementById('totalCards').textContent = '0';
            return;
        }

        const currentCard = this.filteredData[this.currentIndex];

        document.getElementById('englishText').textContent = currentCard.english;
        document.getElementById('chineseText').textContent = currentCard.chinese;
        document.getElementById('unitInfo').textContent = `Module ${currentCard.unit}`;
        document.getElementById('currentCard').textContent = this.currentIndex + 1;
        document.getElementById('totalCards').textContent = this.filteredData.length;

        // Update progress bar
        const progress = ((this.currentIndex + 1) / this.filteredData.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;

        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentIndex === 0 && !this.isRepeatMode;
        document.getElementById('nextBtn').disabled = this.currentIndex === this.filteredData.length - 1 && !this.isRepeatMode;

        // Reset flip state
        const flashcard = document.getElementById('flashcard');
        if (this.isFlipped) {
            flashcard.classList.add('flipped');
        } else {
            flashcard.classList.remove('flipped');
        }
    }

    updateStats() {
        document.getElementById('totalStudied').textContent = this.studyStats.totalStudied;
        document.getElementById('correctCount').textContent = this.studyStats.correctCount;
        document.getElementById('hardCount').textContent = this.studyStats.hardCount;

        // Update study time
        const currentTime = Date.now();
        const studyMinutes = Math.floor((currentTime - this.studyStats.startTime) / 60000);
        document.getElementById('studyTime').textContent = studyMinutes;
    }

    // Save progress to localStorage
    saveProgress() {
        const progress = {
            studyStats: this.studyStats,
            currentData: this.currentData,
            currentUnit: this.currentUnit
        };
        localStorage.setItem('flashcardProgress', JSON.stringify(progress));
    }

    // Load progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem('flashcardProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.studyStats = progress.studyStats || this.studyStats;
            this.currentData = progress.currentData || 'vocabulary';
            this.currentUnit = progress.currentUnit || 'all';

            // Update UI to match loaded state
            this.switchDataType(this.currentData);
            document.getElementById('unitSelect').value = this.currentUnit;
            this.filterData();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new FlashcardApp();

    // Load saved progress
    app.loadProgress();

    // Auto-save progress every 30 seconds
    setInterval(() => {
        app.saveProgress();
    }, 30000);

    // Save progress when leaving the page
    window.addEventListener('beforeunload', () => {
        app.saveProgress();
    });

    // Make app globally accessible for debugging
    window.flashcardApp = app;
});