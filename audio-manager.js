/**
 * 音频管理器 - 优先使用本地MP3文件，失败时回退到Web Speech API
 * Audio Manager - Prioritizes local MP3 files, falls back to Web Speech API on failure
 */
class AudioManager {
    constructor() {
        this.audioBasePath = './audio/';
        this.currentAudio = null;
        this.audioQueue = [];
        this.isPlaying = false;
        this.fallbackToWebSpeech = true;

        // 音频文件缓存
        this.audioCache = new Map();

        // 初始化
        this.init();
    }

    init() {
        // 检查浏览器音频支持
        this.checkAudioSupport();
    }

    checkAudioSupport() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.hasAudioSupport = AudioContext !== undefined;
        this.hasWebSpeechSupport = 'speechSynthesis' in window;

        console.log(`音频支持检测: HTML5 Audio=${this.hasAudioSupport}, Web Speech=${this.hasWebSpeechSupport}`);
    }

    /**
     * 生成音频文件路径
     * @param {string} text - 要播放的文本
     * @param {string} type - 类型: 'vocabulary', 'phrases', 'sentences'
     * @param {Object} options - 选项，包含keyWords等信息
     * @returns {string} 音频文件路径
     */
    getAudioFilePath(text, type, options = {}) {
        // 生成可能的文件名候选列表
        const candidates = this.generateFilenameCandidates(text, options);

        // 返回第一个候选文件路径
        if (candidates.length > 0) {
            return `${this.audioBasePath}${type}/${candidates[0]}`;
        }

        // 如果没有候选，使用传统的完整文件名
        const filename = this.sanitizeFilename(text) + '.mp3';
        return `${this.audioBasePath}${type}/${filename}`;
    }

    /**
     * 生成文件名候选列表
     * @param {string} text - 原始文本
     * @param {Object} options - 选项，包含keyWords等信息
     * @returns {Array} 文件名候选列表
     */
    generateFilenameCandidates(text, options = {}) {
        const candidates = [];

        // 策略1: 如果有keyWords，使用关键词生成短文件名
        if (options.keyWords && Array.isArray(options.keyWords) && options.keyWords.length > 0) {
            const keywordFilename = this.generateKeywordFilename(text, options.keyWords);
            if (keywordFilename) {
                candidates.push(keywordFilename + '.mp3');
            }
        }

        // 策略2: 使用句子的前几个重要词汇（取前30个字符）
        const shortFilename = this.sanitizeFilename(text, 30);
        if (shortFilename.length < text.length) {
            candidates.push(shortFilename + '.mp3');
        }

        // 策略3: 使用传统截断的完整文件名（50个字符）
        const traditionalFilename = this.sanitizeFilename(text, 50);
        candidates.push(traditionalFilename + '.mp3');

        // 策略4: 使用移除标点符号后的完整句子（40个字符）
        const noPunctuationFilename = this.sanitizeFilenameWithoutPunctuation(text, 40);
        if (noPunctuationFilename !== traditionalFilename) {
            candidates.push(noPunctuationFilename + '.mp3');
        }

        return candidates;
    }

    /**
     * 基于关键词生成文件名
     * @param {string} text - 原始文本
     * @param {Array} keyWords - 关键词数组
     * @returns {string} 基于关键词的文件名
     */
    generateKeywordFilename(text, keyWords) {
        if (!keyWords || keyWords.length === 0) return '';

        // 清理和转换关键词
        const cleanKeywords = keyWords.map(keyword =>
            keyword.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '_')
                .trim()
        ).filter(keyword => keyword.length > 0);

        // 如果有关键词，使用前3-4个关键词组成文件名
        if (cleanKeywords.length > 0) {
            const selectedKeywords = cleanKeywords.slice(0, Math.min(4, cleanKeywords.length));
            return selectedKeywords.join('_');
        }

        return '';
    }

    /**
     * 将文本转换为安全的文件名
     * @param {string} text - 原始文本
     * @param {number} maxLength - 最大长度限制
     * @returns {string} 安全的文件名
     */
    sanitizeFilename(text, maxLength = 50) {
        return text
            .toLowerCase()
            .replace(/[<>:"/\\|?*]/g, '') // 移除不安全字符，但保留撇号
            .replace(/[^\w\s'-]/g, '_') // 替换其他特殊字符为下划线
            .replace(/\s+/g, '_') // 替换空格为下划线
            .replace(/_+/g, '_') // 合并连续下划线
            .replace(/^_|_$/g, '') // 移除开头和结尾的下划线
            .substring(0, maxLength); // 限制长度
    }

    /**
     * 生成移除标点符号的文件名
     * @param {string} text - 原始文本
     * @param {number} maxLength - 最大长度限制
     * @returns {string} 安全的文件名
     */
    sanitizeFilenameWithoutPunctuation(text, maxLength = 40) {
        return text
            .toLowerCase()
            .replace(/[<>:"/\\|?*.,!?;"]/g, '') // 移除大部分标点符号，但保留撇号
            .replace(/[^\w\s'-]/g, '_') // 替换其他特殊字符为下划线
            .replace(/\s+/g, '_') // 替换空格为下划线
            .replace(/_+/g, '_') // 合并多个下划线
            .replace(/^_|_$/g, '') // 移除开头和结尾的下划线
            .substring(0, maxLength); // 限制长度
    }

    /**
     * 播放音频
     * @param {string} text - 要播放的文本
     * @param {string} type - 类型: 'vocabulary', 'phrases', 'sentences'
     * @param {Object} options - 选项
     */
    async playAudio(text, type = 'vocabulary', options = {}) {
        try {
            // 如果正在播放，先停止
            if (this.currentAudio || this.isPlaying) {
                this.stopCurrentAudio();
            }

            // 优先尝试播放本地MP3文件
            const success = await this.playLocalAudio(text, type, options);

            if (!success && this.fallbackToWebSpeech && this.hasWebSpeechSupport) {
                console.log('本地音频文件不可用，使用Web Speech API作为后备');
                return this.playWebSpeech(text, options);
            }

            return success;

        } catch (error) {
            console.error('播放音频时出错:', error);

            // 如果出错且允许回退，使用Web Speech API
            if (this.fallbackToWebSpeech && this.hasWebSpeechSupport) {
                return this.playWebSpeech(text, options);
            }

            return false;
        }
    }

    /**
     * 播放本地音频文件
     * @param {string} text - 文本内容
     * @param {string} type - 音频类型
     * @param {Object} options - 选项
     * @returns {Promise<boolean>} 播放是否成功
     */
    async playLocalAudio(text, type, options = {}) {
        // 生成候选文件路径列表
        const candidates = this.generateFilenameCandidates(text, options);

        // 尝试每个候选文件
        for (const filename of candidates) {
            const audioPath = `${this.audioBasePath}${type}/${filename}`;

            try {
                const success = await this.tryPlayAudioFile(audioPath, options);
                if (success) {
                    console.log(`成功播放音频文件: ${filename}`);
                    return true;
                }
            } catch (error) {
                console.warn(`尝试播放音频文件失败: ${filename}`, error);
            }
        }

        console.warn(`所有候选音频文件都无法播放: ${text}`);
        return false;
    }

    /**
     * 尝试播放单个音频文件
     * @param {string} audioPath - 音频文件路径
     * @param {Object} options - 选项
     * @returns {Promise<boolean>} 播放是否成功
     */
    async tryPlayAudioFile(audioPath, options = {}) {
        return new Promise((resolve) => {
            // 检查缓存
            if (this.audioCache.has(audioPath)) {
                const cachedAudio = this.audioCache.get(audioPath);
                this.playAudioElement(cachedAudio, resolve);
                return;
            }

            // 创建新的音频对象
            const audio = new Audio(audioPath);

            // 音频事件监听
            audio.addEventListener('canplaythrough', () => {
                // 缓存音频对象
                this.audioCache.set(audioPath, audio);
                this.playAudioElement(audio, resolve);
            });

            audio.addEventListener('error', (e) => {
                resolve(false);
            });

            audio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.currentAudio = null;
            });

            // 设置音频属性
            audio.volume = options.volume || 1.0;
            audio.preload = 'auto';

            // 开始加载
            audio.load();

            // 设置超时
            setTimeout(() => {
                if (audio.readyState < 4) { // HAVE_ENOUGH_DATA
                    resolve(false);
                }
            }, 3000); // 缩短超时时间
        });
    }

    /**
     * 播放音频元素
     * @param {HTMLAudioElement} audio - 音频元素
     * @param {Function} resolve - Promise resolve 函数
     */
    playAudioElement(audio, resolve) {
        try {
            this.currentAudio = audio;
            this.isPlaying = true;

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        resolve(true);
                    })
                    .catch(error => {
                        console.error('音频播放失败:', error);
                        this.isPlaying = false;
                        this.currentAudio = null;
                        resolve(false);
                    });
            } else {
                resolve(true);
            }

        } catch (error) {
            console.error('播放音频元素时出错:', error);
            this.isPlaying = false;
            this.currentAudio = null;
            resolve(false);
        }
    }

    /**
     * 使用Web Speech API播放语音
     * @param {string} text - 要播放的文本
     * @param {Object} options - 选项
     * @returns {boolean} 播放是否成功
     */
    playWebSpeech(text, options = {}) {
        if (!this.hasWebSpeechSupport) {
            console.warn('Web Speech API 不可用');
            return false;
        }

        try {
            // 取消正在进行的语音
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // 设置语音参数
            utterance.lang = options.lang || 'en-US';
            utterance.rate = options.rate || 0.8;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;

            // 如果指定了特定的语音
            if (options.voiceName) {
                const voices = window.speechSynthesis.getVoices();
                const voice = voices.find(v => v.name === options.voiceName);
                if (voice) {
                    utterance.voice = voice;
                }
            }

            // 事件监听
            utterance.onstart = () => {
                this.isPlaying = true;
            };

            utterance.onend = () => {
                this.isPlaying = false;
            };

            utterance.onerror = (event) => {
                console.error('Web Speech API 错误:', event);
                this.isPlaying = false;
            };

            window.speechSynthesis.speak(utterance);
            return true;

        } catch (error) {
            console.error('Web Speech API 播放失败:', error);
            return false;
        }
    }

    /**
     * 停止当前播放的音频
     */
    stopCurrentAudio() {
        // 停止HTML5音频
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }

        // 停止Web Speech
        if (this.hasWebSpeechSupport) {
            window.speechSynthesis.cancel();
        }

        this.isPlaying = false;
    }

    /**
     * 添加音频到播放队列
     * @param {Array} items - 要播放的项目数组
     */
    async playAudioQueue(items) {
        this.audioQueue = [...items];

        for (const item of this.audioQueue) {
            if (item.text && item.type) {
                await this.playAudio(item.text, item.type, item.options);
                // 等待当前音频播放完成
                await this.waitForAudioEnd();
            }
        }

        this.audioQueue = [];
    }

    /**
     * 等待音频播放结束
     * @returns {Promise}
     */
    waitForAudioEnd() {
        return new Promise(resolve => {
            const checkAudio = () => {
                if (!this.isPlaying) {
                    resolve();
                } else {
                    setTimeout(checkAudio, 100);
                }
            };
            checkAudio();
        });
    }

    /**
     * 获取可用的语音列表
     * @returns {Array} 语音列表
     */
    getAvailableVoices() {
        if (!this.hasWebSpeechSupport) {
            return [];
        }

        return window.speechSynthesis.getVoices().map(voice => ({
            name: voice.name,
            lang: voice.lang,
            localService: voice.localService
        }));
    }

    /**
     * 设置是否启用Web Speech API回退
     * @param {boolean} enabled - 是否启用
     */
    setFallbackEnabled(enabled) {
        this.fallbackToWebSpeech = enabled;
    }

    /**
     * 清理音频缓存
     */
    clearCache() {
        this.audioCache.clear();
        console.log('音频缓存已清理');
    }

    /**
     * 获取缓存状态
     * @returns {Object} 缓存信息
     */
    getCacheInfo() {
        return {
            size: this.audioCache.size,
            items: Array.from(this.audioCache.keys())
        };
    }
}

// 导出音频管理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
} else {
    window.AudioManager = AudioManager;
}