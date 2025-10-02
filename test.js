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

        this.init();
    }

    init() {
        this.bindEvents();
        this.setDefaultUnits();
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

        if (question.type === 'multiple-choice') {
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
        } else if (question.type === 'fill-in-blank') {
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

    enableSubmitButton() {
        document.getElementById('submitAnswerBtn').disabled = false;
    }

    submitCurrentAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (!selectedOption) {
            return;
        }

        const answerIndex = parseInt(selectedOption.value);
        this.userAnswers[this.currentQuestionIndex] = answerIndex;

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

        this.userAnswers.forEach((answerIndex, questionIndex) => {
            if (answerIndex !== null) {
                const question = this.questions[questionIndex];
                const selectedOption = question.options[answerIndex];
                if (selectedOption && selectedOption.isCorrect) {
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

    displayAnswerDetails() {
        const answerList = document.getElementById('answerList');
        answerList.innerHTML = '';

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer !== null && question.options[userAnswer].isCorrect;

            const answerItem = document.createElement('div');
            answerItem.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;

            let userAnswerText = '未作答';
            if (userAnswer !== null) {
                userAnswerText = question.options[userAnswer].text;
            }

            answerItem.innerHTML = `
                <div class="answer-header">
                    <span class="question-number">题目 ${index + 1}</span>
                    <span class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? '✓ 正确' : '✗ 错误'}
                    </span>
                </div>
                <div class="question-content">${question.question}</div>
                <div class="answer-details">
                    <div class="user-answer">你的答案: ${userAnswerText}</div>
                    ${!isCorrect ? `<div class="correct-answer">正确答案: ${question.correctAnswer}</div>` : ''}
                </div>
            `;

            answerList.appendChild(answerItem);
        });
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
    new TestSystem();
});