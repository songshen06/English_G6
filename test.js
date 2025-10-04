// 测试系统主程序
// Test System Main Script

class TestSystem {
    constructor() {
        this.testType = 'vocabulary';
        this.selectedUnits = [];
        this.questionCount = 10;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.testStartTime = null;
        this.testTimer = null;
        this.audioManager = null;

        // 音频状态管理
        this.audioQueue = [];
        this.isSpeaking = false;

        this.init();
    }

    init() {
        // 初始化音频管理器
        this.initAudioManager();
        this.bindEvents();
        this.setDefaultUnits();
    }

    initAudioManager() {
        if (typeof AudioManager !== 'undefined') {
            this.audioManager = new AudioManager();
            console.log('测试系统音频管理器已初始化');
        } else {
            console.warn('AudioManager 未找到，将使用传统语音合成');
        }
    }

    setDefaultUnits() {
        // 默认选择前3个单元
        const unitSelect = document.getElementById('testUnitSelect');
        for (let i = 0; i < 3 && i < unitSelect.options.length; i++) {
            unitSelect.options[i].selected = true;
        }
        this.updateSelectedUnits();
    }

    bindEvents() {
        // 测试设置事件
        document.getElementById('startTestBtn').addEventListener('click', () => this.startTest());
        document.getElementById('testUnitSelect').addEventListener('change', () => this.updateSelectedUnits());
        document.getElementById('questionCount').addEventListener('change', (e) => {
            this.questionCount = Math.min(50, Math.max(5, parseInt(e.target.value) || 10));
        });

        // 测试导航事件
        document.getElementById('prevQuestionBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextQuestionBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitAnswerBtn').addEventListener('click', () => this.submitCurrentAnswer());

        // 结果页面事件
        document.getElementById('reviewMistakesBtn').addEventListener('click', () => this.reviewMistakes());
        document.getElementById('restartTestBtn').addEventListener('click', () => this.restartTest());
        document.getElementById('newTestBtn').addEventListener('click', () => this.newTest());
    }

    updateSelectedUnits() {
        const unitSelect = document.getElementById('testUnitSelect');
        this.selectedUnits = Array.from(unitSelect.selectedOptions).map(option => parseInt(option.value));
    }

    startTest() {
        // 清空音频队列
        this.clearAudioQueue();

        // 获取测试类型
        const testTypeRadios = document.querySelectorAll('input[name="testType"]');
        this.testType = Array.from(testTypeRadios).find(radio => radio.checked).value;

        // 生成题目
        this.generateQuestions();

        if (this.questions.length === 0) {
            alert('没有足够的题目来生成测试，请选择更多单元或减少题目数量。');
            return;
        }

        // 初始化测试状态
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.testStartTime = Date.now();

        // 切换到测试界面
        document.getElementById('testSetup').style.display = 'none';
        document.getElementById('testArea').style.display = 'block';
        document.getElementById('testResults').style.display = 'none';

        // 更新进度显示
        document.getElementById('totalQuestions').textContent = this.questions.length;

        // 开始计时
        this.startTimer();

        // 显示第一题
        this.displayQuestion();
    }

    generateQuestions() {
        this.questions = [];
        let sourceData = [];

        // 根据测试类型获取源数据
        switch (this.testType) {
            case 'vocabulary':
                sourceData = flashcardData.vocabulary.filter(item =>
                    this.selectedUnits.includes(item.unit)
                );
                break;
            case 'phrases':
                sourceData = flashcardData.phrases.filter(item =>
                    this.selectedUnits.includes(item.unit)
                );
                break;
            case 'sentences':
                sourceData = flashcardData.sentences.filter(item =>
                    this.selectedUnits.includes(item.unit)
                );
                break;
            case 'sentence-order':
                sourceData = flashcardData.sentences.filter(item =>
                    this.selectedUnits.includes(item.unit)
                );
                break;
        }

        // 随机打乱数据
        sourceData = this.shuffleArray(sourceData);

        // 生成题目
        const actualCount = Math.min(this.questionCount, sourceData.length);

        for (let i = 0; i < actualCount; i++) {
            const item = sourceData[i];
            let question;

            switch (this.testType) {
                case 'vocabulary':
                case 'phrases':
                    question = this.generateMultipleChoiceQuestion(item, sourceData);
                    break;
                case 'sentences':
                    question = this.generateFillInBlankQuestion(item, sourceData);
                    break;
                case 'sentence-order':
                    question = this.generateSentenceOrderQuestion(item, sourceData);
                    break;
            }

            if (question) {
                this.questions.push(question);
            }
        }
    }

    generateMultipleChoiceQuestion(correctItem, allItems) {
        const question = {
            type: 'multiple-choice',
            question: correctItem.english,
            correctAnswer: correctItem.chinese,
            unit: correctItem.unit,
            options: []
        };

        // 添加正确答案
        question.options.push({
            text: correctItem.chinese,
            isCorrect: true
        });

        // 添加干扰项
        const distractors = this.getRandomDistractors(correctItem, allItems, 3);
        distractors.forEach(distractor => {
            question.options.push({
                text: distractor.chinese,
                isCorrect: false
            });
        });

        // 随机打乱选项顺序
        question.options = this.shuffleArray(question.options);

        return question;
    }

    generateFillInBlankQuestion(correctItem, allItems) {
        const englishSentence = correctItem.english;
        const chineseSentence = correctItem.chinese;

        // 找出句子中的关键词用于填空
        const words = englishSentence.split(' ');
        const importantWords = words.filter(word =>
            word.length > 3 && !['the', 'and', 'for', 'are', 'you', 'your', 'have', 'been'].includes(word.toLowerCase())
        );

        if (importantWords.length === 0) {
            return null;
        }

        // 随机选择一个词作为答案
        const answerWord = importantWords[Math.floor(Math.random() * importantWords.length)];
        const blankedSentence = englishSentence.replace(answerWord, '______');

        const question = {
            type: 'fill-in-blank',
            question: blankedSentence,
            correctAnswer: answerWord,
            fullSentence: englishSentence,
            chineseTranslation: chineseSentence,
            unit: correctItem.unit,
            options: []
        };

        // 生成选项（包括正确答案和干扰项）
        question.options.push({
            text: answerWord,
            isCorrect: true
        });

        const distractors = this.getWordDistractors(answerWord, allItems, 3);
        distractors.forEach(distractor => {
            question.options.push({
                text: distractor,
                isCorrect: false
            });
        });

        // 随机打乱选项顺序
        question.options = this.shuffleArray(question.options);

        return question;
    }

    generateSentenceOrderQuestion(correctItem, allItems) {
        const englishSentence = correctItem.english;
        const chineseSentence = correctItem.chinese;

        // 分割句子为单词块
        const words = englishSentence.split(' ');
        const wordChunks = [];

        // 处理标点符号和缩写
        for (let i = 0; i < words.length; i++) {
            const word = words[i].trim();
            if (word) {
                // 检查是否包含标点符号
                if (word.includes(',')) {
                    const parts = word.split(',');
                    if (parts[0]) wordChunks.push(parts[0]);
                    if (parts[1]) wordChunks.push(',');
                } else if (word.includes('.')) {
                    const parts = word.split('.');
                    if (parts[0]) wordChunks.push(parts[0]);
                    if (parts[1]) wordChunks.push('.');
                } else if (word.includes('?')) {
                    const parts = word.split('?');
                    if (parts[0]) wordChunks.push(parts[0]);
                    if (parts[1]) wordChunks.push('?');
                } else if (word.includes('!')) {
                    const parts = word.split('!');
                    if (parts[0]) wordChunks.push(parts[0]);
                    if (parts[1]) wordChunks.push('!');
                } else {
                    wordChunks.push(word);
                }
            }
        }

        // 确保有足够的单词块进行排序
        if (wordChunks.length < 3) {
            return null;
        }

        // 打乱单词块顺序
        const shuffledChunks = this.shuffleArray([...wordChunks]);

        const question = {
            type: 'sentence-order',
            question: '请将下面的单词块拖拽排序，组成正确的句子',
            originalSentence: englishSentence,
            chineseTranslation: chineseSentence,
            unit: correctItem.unit,
            wordChunks: shuffledChunks,
            correctOrder: wordChunks,
            keyWords: correctItem.keyWords || []
        };

        return question;
    }

    getRandomDistractors(correctItem, allItems, count) {
        const distractors = [];
        const availableItems = allItems.filter(item =>
            item.english !== correctItem.english &&
            item.chinese !== correctItem.chinese &&
            item.unit === correctItem.unit // 优先选择同单元的干扰项
        );

        // 如果同单元的干扰项不够，从其他单元选择
        if (availableItems.length < count) {
            const otherItems = allItems.filter(item =>
                item.english !== correctItem.english &&
                item.chinese !== correctItem.chinese
            );
            availableItems.push(...otherItems);
        }

        // 随机选择干扰项
        const shuffled = this.shuffleArray(availableItems);
        for (let i = 0; i < count && i < shuffled.length; i++) {
            distractors.push(shuffled[i]);
        }

        return distractors;
    }

    getWordDistractors(correctWord, allItems, count) {
        const distractors = [];
        const allWords = new Set();

        // 从所有项目中收集词汇
        allItems.forEach(item => {
            const words = item.english.split(' ');
            words.forEach(word => {
                const cleanWord = word.toLowerCase().replace(/[.,!?]/g, '');
                if (cleanWord.length > 2 && cleanWord !== correctWord.toLowerCase()) {
                    allWords.add(cleanWord);
                }
            });
        });

        // 转换为数组并随机选择
        const wordArray = Array.from(allWords);
        const shuffled = this.shuffleArray(wordArray);

        for (let i = 0; i < count && i < shuffled.length; i++) {
            distractors.push(shuffled[i]);
        }

        return distractors;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startTimer() {
        this.testTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.testStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('testTimer').textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.testTimer) {
            clearInterval(this.testTimer);
            this.testTimer = null;
        }
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishTest();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];

        // 更新题目进度
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('testProgressFill').style.width =
            `${((this.currentQuestionIndex + 1) / this.questions.length) * 100}%`;

        // 显示题目
        document.getElementById('questionText').textContent = question.question;

        // 显示选项
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';

        if (question.type === 'multiple-choice' || question.type === 'fill-in-blank') {
            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'answer-option';
                optionElement.innerHTML = `
                    <label>
                        <input type="radio" name="answer" value="${index}">
                        <span class="option-text">${option.text}</span>
                    </label>
                `;
                optionElement.addEventListener('click', () => {
                    optionElement.querySelector('input').checked = true;
                    this.enableSubmitButton();
                });
                optionsContainer.appendChild(optionElement);
            });
        } else if (question.type === 'sentence-order') {
            this.displaySentenceOrderQuestion(question, optionsContainer);
        }

        // 如果已经有答案，恢复选择
        if (this.userAnswers[this.currentQuestionIndex] !== null) {
            const selectedOption = optionsContainer.querySelector(`input[value="${this.userAnswers[this.currentQuestionIndex]}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
                this.enableSubmitButton();
            }
        }

        // 更新导航按钮状态
        document.getElementById('prevQuestionBtn').disabled = this.currentQuestionIndex === 0;
        document.getElementById('nextQuestionBtn').disabled = this.currentQuestionIndex === this.questions.length - 1;

        // 如果是最后一题，更改提交按钮文字
        const submitBtn = document.getElementById('submitAnswerBtn');
        if (this.currentQuestionIndex === this.questions.length - 1) {
            submitBtn.textContent = '完成测试';
        } else {
            submitBtn.textContent = '提交答案';
        }
    }

    displaySentenceOrderQuestion(question, container) {
        // 创建句子排序界面
        const sentenceOrderContainer = document.createElement('div');
        sentenceOrderContainer.className = 'sentence-order-container';

        // 提示信息
        const hintElement = document.createElement('div');
        hintElement.className = 'sentence-hint';

        // 创建提示文本
        const hintText = document.createElement('p');
        hintText.textContent = '请将下面的单词拖拽到上方框中，组成正确的句子：';
        hintElement.appendChild(hintText);

        // 创建中文翻译
        const translationDiv = document.createElement('div');
        translationDiv.className = 'chinese-translation';
        translationDiv.textContent = `中文释义：${question.chineseTranslation}`;
        hintElement.appendChild(translationDiv);

        // 创建音频控制区域
        const audioControls = document.createElement('div');
        audioControls.className = 'audio-controls';

        // 创建音频按钮
        const audioBtn = document.createElement('button');
        audioBtn.className = 'audio-btn';
        audioBtn.id = 'playAudioBtn';
        audioBtn.textContent = '🔊 播放音频';

        // 直接在创建时添加事件监听器
        audioBtn.addEventListener('click', () => {
            console.log('音频按钮被点击，播放句子:', question.originalSentence);
            this.playSentenceAudio(question.originalSentence, 'playAudioBtn', question.keyWords || []);
        });
        console.log('音频按钮事件监听器已添加');

        audioControls.appendChild(audioBtn);
        hintElement.appendChild(audioControls);

        sentenceOrderContainer.appendChild(hintElement);

        // 句子组合框容器
        const sentenceBoxesContainer = document.createElement('div');
        sentenceBoxesContainer.className = 'sentence-boxes-container';
        sentenceBoxesContainer.id = 'sentenceBoxesContainer';

        // 创建多个组合框
        const boxCount = question.correctOrder.length + 2; // 稍微多留一些空间
        for (let i = 0; i < boxCount; i++) {
            const box = document.createElement('div');
            box.className = 'sentence-box';
            box.dataset.position = i;
            box.addEventListener('dragover', (e) => this.handleDragOver(e, box));
            box.addEventListener('drop', (e) => this.handleDrop(e, box));
            box.addEventListener('dragleave', (e) => this.handleDragLeave(e, box));
            sentenceBoxesContainer.appendChild(box);
        }

        sentenceOrderContainer.appendChild(sentenceBoxesContainer);

        // 打乱的单词池
        const wordsPoolContainer = document.createElement('div');
        wordsPoolContainer.className = 'words-pool-container';
        wordsPoolContainer.id = 'wordsPoolContainer';

        const poolLabel = document.createElement('div');
        poolLabel.className = 'pool-label';
        poolLabel.textContent = '单词池 (拖拽单词到上方框中)：';
        wordsPoolContainer.appendChild(poolLabel);

        const wordsPool = document.createElement('div');
        wordsPool.className = 'words-pool';
        wordsPool.id = 'wordsPool';

        // 创建可拖拽的单词块
        question.wordChunks.forEach((chunk, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-chunk';
            wordElement.textContent = chunk;
            wordElement.draggable = true;
            wordElement.dataset.wordId = `word-${index}`;
            wordElement.dataset.wordText = chunk;

            // 拖拽事件
            wordElement.addEventListener('dragstart', (e) => this.handleDragStart(e, wordElement));
            wordElement.addEventListener('dragend', (e) => this.handleDragEnd(e, wordElement));
            // 添加点击播放单词音频功能
            wordElement.addEventListener('click', () => {
                this.playWordAudio(chunk);
            });
            wordElement.style.cursor = 'pointer'; // 添加指针样式

            wordsPool.appendChild(wordElement);
        });

        wordsPoolContainer.appendChild(wordsPool);
        sentenceOrderContainer.appendChild(wordsPoolContainer);

        // 操作按钮
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        const resetButton = document.createElement('button');
        resetButton.className = 'reset-order-btn';
        resetButton.textContent = '重置';
        resetButton.addEventListener('click', () => {
            this.resetSentenceOrder(question);
        });

        const clearButton = document.createElement('button');
        clearButton.className = 'clear-order-btn';
        clearButton.textContent = '清空';
        clearButton.addEventListener('click', () => {
            this.clearSentenceBoxes();
        });

        actionButtons.appendChild(resetButton);
        actionButtons.appendChild(clearButton);
        sentenceOrderContainer.appendChild(actionButtons);

        // 答案显示区域
        const answerDisplay = document.createElement('div');
        answerDisplay.className = 'answer-display';
        answerDisplay.id = 'answerDisplay';
        answerDisplay.style.display = 'none';
        sentenceOrderContainer.appendChild(answerDisplay);

        container.appendChild(sentenceOrderContainer);

        // 恢复之前的答案
        if (this.userAnswers[this.currentQuestionIndex] !== null) {
            const savedOrder = this.userAnswers[this.currentQuestionIndex];
            this.restoreSentenceOrder(savedOrder);
        }

        this.enableSubmitButton();
    }

    // 新的拖拽处理方法
    handleDragStart(e, element) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.innerHTML);
        e.dataTransfer.setData('wordId', element.dataset.wordId);
        e.dataTransfer.setData('wordText', element.dataset.wordText);
        element.classList.add('dragging');
        this.draggedElement = element;
    }

    handleDragEnd(e, element) {
        element.classList.remove('dragging');
        this.checkSentenceOrder();
    }

    handleDragOver(e, box) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // 检查框是否为空或者可以接受拖拽
        if (!box.querySelector('.word-chunk')) {
            box.classList.add('drag-over');
        }
    }

    handleDragLeave(e, box) {
        box.classList.remove('drag-over');
    }

    handleDrop(e, box) {
        e.preventDefault();
        box.classList.remove('drag-over');

        // 获取拖拽的单词信息
        const wordId = e.dataTransfer.getData('wordId');
        const wordText = e.dataTransfer.getData('wordText');

        // 如果框为空，则放置单词
        if (!box.querySelector('.word-chunk')) {
            // 创建新的单词元素
            const wordElement = document.createElement('div');
            wordElement.className = 'word-chunk in-box';
            wordElement.textContent = wordText;
            wordElement.dataset.wordId = wordId;
            wordElement.dataset.wordText = wordText;
            wordElement.draggable = true;

            // 添加框内单词的事件
            wordElement.addEventListener('dragstart', (e) => this.handleBoxWordDragStart(e, wordElement, box));
            wordElement.addEventListener('dragend', (e) => this.handleBoxWordDragEnd(e, wordElement));
            // 添加点击播放单词音频功能
            wordElement.addEventListener('click', () => {
                this.playWordAudio(wordText);
            });
            wordElement.style.cursor = 'pointer'; // 添加指针样式

            box.appendChild(wordElement);

            // 从原位置移除单词
            if (this.draggedElement && this.draggedElement.parentElement) {
                this.draggedElement.remove();
            }

            // 播放单词音频（延迟播放，避免与拖拽冲突）
            setTimeout(() => {
                this.playWordAudio(wordText);
            }, 300);
        }
    }

    handleBoxWordDragStart(e, element, fromBox) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', element.innerHTML);
        e.dataTransfer.setData('wordId', element.dataset.wordId);
        e.dataTransfer.setData('wordText', element.dataset.wordText);
        e.dataTransfer.setData('fromBox', 'true');
        element.classList.add('dragging');
        this.draggedElement = element;
        this.originalBox = fromBox;
    }

    handleBoxWordDragEnd(e, element) {
        element.classList.remove('dragging');
        this.checkSentenceOrder();
    }

    // 音频播放功能 - 优化版
    async playSentenceAudio(sentence, buttonId = 'playAudioBtn', keyWords = []) {
        // 优先使用音频管理器播放本地文件
        if (this.audioManager) {
            try {
                this.updateAudioButtonState(buttonId, '🔊 播放中...', true, 'playing');
                const success = await this.audioManager.playAudio(
                    sentence,
                    'sentences',
                    { rate: 0.9, keyWords: keyWords }
                );

                if (success) {
                    console.log('使用本地音频文件播放成功');
                    this.updateAudioButtonState(buttonId, '🔊 播放音频', false, 'normal');
                    return;
                }
            } catch (error) {
                console.warn('音频管理器播放失败，使用备用方法:', error);
                this.updateAudioButtonState(buttonId, '🔊 播放音频', false, 'normal');
            }
        }

        // 回退到传统的Web Speech API
        this.playWebSpeechFallback(sentence, buttonId);
    }

    playWebSpeechFallback(sentence, buttonId = 'playAudioBtn') {
        if ('speechSynthesis' in window) {
            // 添加到音频队列
            this.addToAudioQueue({
                type: 'sentence',
                text: sentence,
                buttonId: buttonId,
                rate: 0.9
            });
            this.processAudioQueue();
        } else {
            console.warn('浏览器不支持语音合成功能');
            this.updateAudioButtonState(buttonId, '🔇 不支持音频', true, 'error');
        }
    }

    // 播放单词音频 - 优化版
    playWordAudio(word) {
        if ('speechSynthesis' in window && word) {
            // 添加到音频队列
            this.addToAudioQueue({
                type: 'word',
                text: word,
                rate: 0.8
            });
            this.processAudioQueue();
        }
    }

    // 添加到音频队列
    addToAudioQueue(audioItem) {
        this.audioQueue.push(audioItem);

        // 限制队列长度，避免积压太多
        if (this.audioQueue.length > 5) {
            this.audioQueue = this.audioQueue.slice(-5);
        }
    }

    // 处理音频队列
    processAudioQueue() {
        if (this.isSpeaking || this.audioQueue.length === 0) {
            return;
        }

        this.isSpeaking = true;
        const audioItem = this.audioQueue.shift();

        // 取消之前的播放
        window.speechSynthesis.cancel();

        // 创建语音合成
        const utterance = new SpeechSynthesisUtterance(audioItem.text);
        utterance.lang = 'en-US';
        utterance.rate = audioItem.rate;
        utterance.pitch = 1;
        utterance.volume = 1;

        // 更新按钮状态（如果是句子音频）
        if (audioItem.buttonId) {
            this.updateAudioButtonState(audioItem.buttonId, '🔊 播放中...', true);
        }

        // 播放完成后的处理
        utterance.onend = () => {
            this.isSpeaking = false;

            // 恢复按钮状态
            if (audioItem.buttonId) {
                this.updateAudioButtonState(audioItem.buttonId, '🔊 播放音频', false);
            }

            // 处理队列中的下一个音频
            setTimeout(() => {
                this.processAudioQueue();
            }, 200); // 短暂延迟，避免音频重叠
        };

        // 错误处理
        utterance.onerror = (event) => {
            console.warn('语音合成错误:', event);
            this.isSpeaking = false;

            // 恢复按钮状态
            if (audioItem.buttonId) {
                this.updateAudioButtonState(audioItem.buttonId, '🔊 播放音频', false);
            }

            // 继续处理队列
            setTimeout(() => {
                this.processAudioQueue();
            }, 200);
        };

        // 开始播放
        window.speechSynthesis.speak(utterance);
    }

    // 更新音频按钮状态
    updateAudioButtonState(buttonId, text, disabled, state = 'normal') {
        const audioBtn = document.getElementById(buttonId);
        if (audioBtn) {
            audioBtn.textContent = text;
            audioBtn.disabled = disabled;

            if (state === 'error') {
                audioBtn.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
            }
        }
    }

    // 清空音频队列
    clearAudioQueue() {
        this.audioQueue = [];
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
    }

    // 清空句子框
    clearSentenceBoxes() {
        const boxes = document.querySelectorAll('.sentence-box');
        const wordsPool = document.getElementById('wordsPool');

        boxes.forEach(box => {
            const wordChunk = box.querySelector('.word-chunk');
            if (wordChunk) {
                // 移回单词池
                const wordElement = document.createElement('div');
                wordElement.className = 'word-chunk';
                wordElement.textContent = wordChunk.dataset.wordText;
                wordElement.draggable = true;
                wordElement.dataset.wordId = wordChunk.dataset.wordId;
                wordElement.dataset.wordText = wordChunk.dataset.wordText;

                wordElement.addEventListener('dragstart', (e) => this.handleDragStart(e, wordElement));
                wordElement.addEventListener('dragend', (e) => this.handleDragEnd(e, wordElement));
                // 添加点击播放单词音频功能
                wordElement.addEventListener('click', () => {
                    this.playWordAudio(wordChunk.dataset.wordText);
                });
                wordElement.style.cursor = 'pointer';

                wordsPool.appendChild(wordElement);
                box.innerHTML = '';
            }
        });

        this.checkSentenceOrder();
    }

    // 重置句子顺序
    resetSentenceOrder(question) {
        this.clearSentenceBoxes();

        // 重新打乱单词池
        const wordsPool = document.getElementById('wordsPool');
        const words = Array.from(wordsPool.querySelectorAll('.word-chunk'));

        // 清空并重新添加
        wordsPool.innerHTML = '';
        const shuffledWords = this.shuffleArray(words);

        shuffledWords.forEach(word => {
            wordsPool.appendChild(word);
        });
    }

    // 恢复句子顺序
    restoreSentenceOrder(savedOrder) {
        // 先清空所有框
        this.clearSentenceBoxes();

        // 将保存的单词顺序放入框中
        const boxes = document.querySelectorAll('.sentence-box');
        savedOrder.forEach((wordText, index) => {
            if (index < boxes.length) {
                const box = boxes[index];

                // 从单词池中找到对应的单词
                const wordInPool = document.querySelector(`.words-pool .word-chunk[data-word-text="${wordText}"]`);
                if (wordInPool) {
                    wordInPool.remove();

                    // 创建框内单词元素
                    const wordElement = document.createElement('div');
                    wordElement.className = 'word-chunk in-box';
                    wordElement.textContent = wordText;
                    wordElement.dataset.wordText = wordText;
                    wordElement.draggable = true;

                    wordElement.addEventListener('dragstart', (e) => this.handleBoxWordDragStart(e, wordElement, box));
                    wordElement.addEventListener('dragend', (e) => this.handleBoxWordDragEnd(e, wordElement));
                    // 添加点击播放单词音频功能
                    wordElement.addEventListener('click', () => {
                        this.playWordAudio(wordText);
                    });
                    wordElement.style.cursor = 'pointer';

                    box.appendChild(wordElement);
                }
            }
        });

        this.checkSentenceOrder();
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.word-chunk:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    resetWordOrder(question) {
        const wordsContainer = document.getElementById('wordsContainer');
        wordsContainer.innerHTML = '';

        const shuffledChunks = this.shuffleArray([...question.wordChunks]);
        shuffledChunks.forEach((chunk, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-chunk';
            wordElement.textContent = chunk;
            wordElement.draggable = true;
            wordElement.dataset.index = index;

            // 重新添加拖拽事件
            this.addDragEvents(wordElement);
            wordsContainer.appendChild(wordElement);
        });
    }

    addDragEvents(wordElement) {
        const wordsContainer = document.getElementById('wordsContainer');

        wordElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
            e.target.classList.add('dragging');
            this.draggedElement = e.target;
        });

        wordElement.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        wordElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const afterElement = this.getDragAfterElement(wordsContainer, e.clientY);
            if (afterElement == null) {
                wordsContainer.appendChild(this.draggedElement);
            } else {
                wordsContainer.insertBefore(this.draggedElement, afterElement);
            }
        });

        wordElement.addEventListener('drop', (e) => {
            e.preventDefault();
            this.checkSentenceOrder();
        });
    }

    checkSentenceOrder() {
        // 从句子框中获取当前的单词顺序
        const boxes = document.querySelectorAll('.sentence-box');
        const currentOrder = [];

        boxes.forEach(box => {
            const wordChunk = box.querySelector('.word-chunk');
            if (wordChunk) {
                currentOrder.push(wordChunk.dataset.wordText);
            }
        });

        this.userAnswers[this.currentQuestionIndex] = currentOrder;
    }

    restoreWordOrder(savedOrder) {
        const wordsContainer = document.getElementById('wordsContainer');
        wordsContainer.innerHTML = '';

        savedOrder.forEach((chunk, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-chunk';
            wordElement.textContent = chunk;
            wordElement.draggable = true;
            wordElement.dataset.index = index;

            this.addDragEvents(wordElement);
            wordsContainer.appendChild(wordElement);
        });
    }

    enableSubmitButton() {
        document.getElementById('submitAnswerBtn').disabled = false;
    }

    submitCurrentAnswer() {
        const question = this.questions[this.currentQuestionIndex];

        if (question.type === 'sentence-order') {
            // 句子排序类型：获取当前单词顺序
            this.checkSentenceOrder(); // 确保答案是最新的
        } else {
            // 选择题类型：获取选中的选项
            const selectedOption = document.querySelector('input[name="answer"]:checked');
            if (!selectedOption) {
                return;
            }
            const answerIndex = parseInt(selectedOption.value);
            this.userAnswers[this.currentQuestionIndex] = answerIndex;
        }

        // 自动进入下一题
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.nextQuestion();
        } else {
            this.finishTest();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    finishTest() {
        this.stopTimer();

        // 计算结果
        const results = this.calculateResults();

        // 显示结果
        document.getElementById('testArea').style.display = 'none';
        document.getElementById('testResults').style.display = 'block';

        // 更新结果显示
        document.getElementById('scorePercentage').textContent = `${results.percentage}%`;
        document.getElementById('correctCount').textContent = results.correctCount;
        document.getElementById('totalQuestionsResult').textContent = this.questions.length;
        document.getElementById('totalTime').textContent = document.getElementById('testTimer').textContent;

        // 显示答题详情
        this.displayAnswerDetails();
    }

    calculateResults() {
        let correctCount = 0;

        this.userAnswers.forEach((answer, questionIndex) => {
            if (answer !== null) {
                const question = this.questions[questionIndex];
                let isCorrect = false;

                if (question.type === 'sentence-order') {
                    // 句子排序类型：检查顺序是否完全正确
                    const userOrder = answer;
                    const correctOrder = question.correctOrder;
                    isCorrect = this.compareArrays(userOrder, correctOrder);
                } else {
                    // 选择题类型：检查选项是否正确
                    const answerIndex = answer;
                    const selectedOption = question.options[answerIndex];
                    isCorrect = selectedOption && selectedOption.isCorrect;
                }

                if (isCorrect) {
                    correctCount++;
                }
            }
        });

        const percentage = Math.round((correctCount / this.questions.length) * 100);

        return {
            correctCount,
            totalCount: this.questions.length,
            percentage
        };
    }

    compareArrays(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    displayAnswerDetails() {
        const answerList = document.getElementById('answerList');
        answerList.innerHTML = '';

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            let isCorrect = false;
            let userAnswerText = '未作答';

            if (userAnswer !== null) {
                if (question.type === 'sentence-order') {
                    userAnswerText = userAnswer.join(' ');
                    isCorrect = this.compareArrays(userAnswer, question.correctOrder);
                } else {
                    userAnswerText = question.options[userAnswer].text;
                    isCorrect = question.options[userAnswer].isCorrect;
                }
            }

            const answerItem = document.createElement('div');
            answerItem.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;

            answerItem.innerHTML = `
                <div class="answer-header">
                    <span class="question-number">题目 ${index + 1}</span>
                    <span class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? '✓ 正确' : '✗ 错误'}
                    </span>
                </div>
                <div class="question-content">${question.question}</div>
                ${question.chineseTranslation ? `<div class="chinese-translation">中文释义：${question.chineseTranslation}</div>` : ''}
                <div class="answer-details">
                    <div class="user-answer">你的答案: ${userAnswerText}</div>
                    ${!isCorrect ? `<div class="correct-answer">正确答案: ${question.type === 'sentence-order' ? question.originalSentence : question.correctAnswer}</div>` : ''}
                </div>
                ${question.keyWords && question.keyWords.length > 0 ? this.generateKeyWordsExplanation(question.keyWords) : ''}
            `;

            answerList.appendChild(answerItem);
        });
    }

    generateKeyWordsExplanation(keyWords) {
        let explanation = '<div class="key-words-explanation"><h4>重点词汇解读：</h4><ul>';

        keyWords.forEach(word => {
            explanation += `<li><strong>${word}</strong> - ${this.getWordExplanation(word)}</li>`;
        });

        explanation += '</ul></div>';
        return explanation;
    }

    getWordExplanation(word) {
        // 简单的词汇解释映射
        const explanations = {
            'Great Wall': '长城',
            'long': '长的',
            'more than': '超过',
            'thousand': '千',
            'old': '古老的',
            'years': '年',
            'went': '去 (go的过去式)',
            'Chinatown': '唐人街',
            'New York': '纽约',
            'yesterday': '昨天',
            'saw': '看见 (see的过去式)',
            'lion dance': '舞狮',
            'street': '街道',
            'doing': '做 (do的现在分词)',
            'putting': '放 (put的现在分词)',
            'stamps': '邮票',
            'stamp book': '邮票册',
            'got': '有 (get的过去式)',
            'China': '中国',
            'Thanksgiving': '感恩节',
            'always': '总是',
            'special': '特别的',
            'dinner': '晚餐',
            'Thank you': '谢谢',
            'food': '食物',
            'family': '家庭',
            'friends': '朋友',
            'speak': '说',
            'English': '英语',
            'write': '写',
            'Of course': '当然',
            'Chinese': '中国的',
            'chopsticks': '筷子',
            'brother': '兄弟',
            'kite': '风筝',
            'book': '书',
            'about': '关于',
            'Pandas': '熊猫',
            'love': '喜欢',
            'bamboo': '竹子',
            'eat': '吃',
            'hours': '小时',
            'snakes': '蛇',
            'music': '音乐',
            'almost': '几乎',
            'deaf': '聋的',
            'often': '经常',
            'tidy': '整理',
            'bed': '床',
            'every day': '每天',
            'read': '读',
            'stories': '故事',
            'UN building': '联合国大楼',
            'important': '重要的',
            'building': '建筑',
            'New York': '纽约',
            'UN': '联合国',
            'wants': '想要',
            'make peace': '缔造和平',
            'world': '世界',
            'China': '中国',
            'one of': '其中之一',
            'member states': '成员国',
            'only': '只',
            'drink': '喝',
            'clean': '干净的',
            'water': '水',
            'fun': '有趣的'
        };

        return explanations[word] || word;
    }

    reviewMistakes() {
        // 找出所有错题
        const mistakes = [];
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer !== null && question.options[userAnswer].isCorrect;
            if (!isCorrect) {
                mistakes.push(index);
            }
        });

        if (mistakes.length === 0) {
            alert('恭喜！没有错题需要复习。');
            return;
        }

        // 重新开始测试，只包含错题
        this.questions = mistakes.map(index => this.questions[index]);
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.testStartTime = Date.now();

        // 切换界面
        document.getElementById('testResults').style.display = 'none';
        document.getElementById('testArea').style.display = 'block';

        // 更新显示
        document.getElementById('totalQuestions').textContent = this.questions.length;

        // 重新开始计时
        this.startTimer();

        // 显示第一题
        this.displayQuestion();
    }

    restartTest() {
        // 使用相同的题目重新开始
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.testStartTime = Date.now();

        // 切换界面
        document.getElementById('testResults').style.display = 'none';
        document.getElementById('testArea').style.display = 'block';

        // 重新开始计时
        this.startTimer();

        // 显示第一题
        this.displayQuestion();
    }

    newTest() {
        // 清空音频队列
        this.clearAudioQueue();

        // 返回测试设置页面
        document.getElementById('testResults').style.display = 'none';
        document.getElementById('testArea').style.display = 'none';
        document.getElementById('testSetup').style.display = 'block';

        // 清理计时器
        this.stopTimer();
    }
}

// 初始化测试系统
document.addEventListener('DOMContentLoaded', () => {
    window.testSystem = new TestSystem();
});