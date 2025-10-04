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
     * @returns {string} 音频文件路径
     */
    getAudioFilePath(text, type) {
        // 将文本转换为安全的文件名
        const filename = this.sanitizeFilename(text) + '.mp3';
        return `${this.audioBasePath}${type}/${filename}`;
    }

    /**
     * 将文本转换为安全的文件名
     * @param {string} text - 原始文本
     * @returns {string} 安全的文件名
     */
    sanitizeFilename(text) {
        return text
            .toLowerCase()
            .replace(/[<>:"/\\|?*]/g, '') // 移除不安全字符
            .replace(/[^\w\s-]/g, '_') // 替换特殊字符为下划线
            .replace(/\s+/g, '_') // 替换空格为下划线
            .substring(0, 50); // 限制长度
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
        return new Promise((resolve) => {
            const audioPath = this.getAudioFilePath(text, type);

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
                console.warn(`音频文件加载失败: ${audioPath}`, e);
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
                    console.warn(`音频加载超时: ${audioPath}`);
                    resolve(false);
                }
            }, 5000);
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