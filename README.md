# 英语六年级上册闪卡学习系统
# English Grade 6 Flashcard Learning System

一个基于Web的英语闪卡学习应用，专为六年级上册英语学习设计。

A web-based flashcard learning application designed for Grade 6 English textbook study.

## 📖 项目简介

本项目将《英语六年级上册知识点扩展版学习手册》转换为交互式闪卡应用，包含所有单元的单词、短语和句型练习。

This project converts the "English Grade 6 Knowledge Points Extended Study Manual" into an interactive flashcard application, including vocabulary, phrases, and sentence patterns from all units.

## ✨ 主要功能

### 🎯 学习内容
- **核心单词** - 54个英语单词
- **重点短语** - 64个常用短语
- **句型练习** - 20个句型模式
- **10个单元** - 完整覆盖所有课程内容

### 🎮 交互功能
- **翻转闪卡** - 点击卡片查看中英文翻译
- **语音朗读** - 所有英文内容支持语音播放
- **单元选择** - 可选择特定单元或全部内容
- **随机模式** - 打乱顺序学习
- **自动播放** - 自动切换卡片
- **重复模式** - 循环学习

### 📊 学习工具
- **进度追踪** - 可视化学习进度条
- **难度标记** - 标记卡片为简单/一般/困难
- **学习统计** - 记录学习时间和数据
- **快捷键支持** - 键盘快捷操作
- **本地存储** - 自动保存学习进度

## 🚀 快速开始

### 方法一：直接打开
```bash
# 直接在浏览器中打开主页面
open index.html
```

### 方法二：本地服务器
```bash
# 启动本地服务器
python3 -m http.server 8000

# 在浏览器中访问
open http://localhost:8000
```

### 方法三：测试页面
```bash
# 打开测试页面验证功能
open test.html
```

## 🎯 使用指南

### 基本操作
1. **选择内容类型** - 点击"核心单词"、"重点短语"或"句型练习"
2. **选择单元** - 使用下拉菜单选择特定单元或"全部单元"
3. **学习卡片** - 点击卡片翻转查看答案
4. **语音播放** - 点击🔊图标或按P键播放发音

### 控制功能
- **随机顺序** - 打乱卡片顺序
- **自动播放** - 自动翻转和切换卡片
- **重复模式** - 循环学习所有卡片

### 难度标记
- **困难** (红色) - 需要多练习
- **一般** (橙色) - 基本掌握
- **简单** (绿色) - 已熟练掌握

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| ← → | 切换上一张/下一张卡片 |
| 空格键 | 翻转当前卡片 |
| 1 | 标记为困难 |
| 2 | 标记为一般 |
| 3 | 标记为简单 |
| P | 播放语音 |

## 📂 项目结构

```
English_G6/
├── index.html          # 主应用页面
├── style.css           # 样式文件
├── script.js           # 主要功能脚本
├── data.js             # 闪卡数据
├── test.html           # 功能测试页面
├── README.md           # 项目说明
└── 英语六上知识点扩展版学习手册.docx  # 原始Word文档
```

## 📊 数据统计

### 内容分布
- **模块 1**: How long? - 6个单词, 4个短语, 2个句型
- **模块 2**: Chinatown and Tombs - 9个单词, 6个短语, 2个句型
- **模块 3**: Stamps and Hobbies - 7个单词, 6个短语, 2个句型
- **模块 4**: Festivals - 6个单词, 6个短语, 2个句型
- **模块 5**: Pen Friends - 4个单词, 6个短语, 2个句型
- **模块 6**: School and Answers - 4个单词, 7个短语, 3个句型
- **模块 7**: Animals - 8个单词, 7个短语, 2个句型
- **模块 8**: Habits and Tidy Room - 7个单词, 7个短语, 2个句型
- **模块 9**: Peace and UN - 4个单词, 6个短语, 3个句型
- **模块 10**: Travel and Safety - 4个单词, 8个短语, 2个句型

### 总计
- **54个词汇单词**
- **64个重点短语**
- **20个句型模式**

## 🛠️ 技术栈

- **HTML5** - 语义化页面结构
- **CSS3** - 响应式设计和动画效果
- **Vanilla JavaScript** - 核心功能实现
- **Web Speech API** - 语音合成功能
- **LocalStorage** - 本地数据存储

## 🌟 特色功能

### 🎨 设计特点
- **渐变背景** - 现代化视觉设计
- **卡片动画** - 流畅的3D翻转效果
- **响应式布局** - 支持桌面和移动设备
- **色彩编码** - 不同类型内容用颜色区分

### 📱 用户体验
- **直观操作** - 简单易用的界面
- **即时反馈** - 实时进度更新
- **无干扰模式** - 专注学习体验
- **离线可用** - 无需网络连接

## 🔧 自定义和扩展

### 添加新内容
在 `data.js` 文件中添加新的闪卡数据：

```javascript
// 添加新单词
{ english: "new word", chinese: "新单词", unit: 1 },

// 添加新短语
{ english: "new phrase", chinese: "新短语", unit: 1 },

// 添加新句型
{ english: "This is a new sentence.", chinese: "这是一个新句子。", unit: 1 }
```

### 修改样式
在 `style.css` 中自定义颜色、字体和布局：

```css
/* 修改主题色 */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
}
```

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交问题报告和功能请求！请遵循以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 项目讨论区

## 🙏 致谢

感谢所有为英语教育做出贡献的教育工作者和开发者。

---

**Happy Learning! 祝学习愉快！** 🎓✨