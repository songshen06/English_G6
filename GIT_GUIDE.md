# Git 使用指南

## 📋 项目状态

当前项目已成功初始化 Git 仓库并完成初始提交。

Current project has been successfully initialized with Git and initial commit completed.

## 🚀 Git 基本命令

### 查看状态
```bash
git status
```

### 查看提交历史
```bash
git log --oneline
git log --graph --pretty=format:'%h - %an, %ar : %s'
```

### 创建新分支
```bash
git checkout -b feature/new-feature
```

### 切换分支
```bash
git checkout main
git checkout feature-name
```

### 添加文件
```bash
# 添加所有文件
git add .

# 添加特定文件
git add filename.js
```

### 提交更改
```bash
git commit -m "描述你的更改"
```

### 推送到远程仓库（如果已配置）
```bash
git push origin main
git push origin feature-branch
```

### 拉取最新更改
```bash
git pull origin main
```

## 📝 提交消息规范

### 格式
```
类型(范围): 简短描述

详细描述（可选）

关联问题（可选）
```

### 类型说明
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建或辅助工具变动

### 示例
```bash
git commit -m "feat(voice): add speech rate control feature"
git commit -m "fix(cards): resolve card flipping animation issue"
git commit -m "docs(readme): update installation instructions"
```

## 🔄 分支策略

### 主要分支
- `main`: 主分支，稳定版本
- `develop`: 开发分支（如需要）

### 功能分支
- `feature/功能名`: 新功能开发
- `bugfix/问题描述`: bug修复
- `hotfix/紧急修复`: 紧急修复

## 🏷️ 标签管理

### 创建标签
```bash
# 轻量标签
git tag v1.0.0

# 附注标签
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### 推送标签
```bash
git push origin v1.0.0
git push origin --tags
```

## 📊 项目文件状态

### 已跟踪文件
- ✅ `index.html` - 主应用页面
- ✅ `style.css` - 样式文件
- ✅ `script.js` - 主要脚本
- ✅ `data.js` - 闪卡数据
- ✅ `test.html` - 测试页面
- ✅ `README.md` - 项目说明
- ✅ `.gitignore` - Git忽略规则

### 忽略的文件
- 系统文件 (`.DS_Store` 等)
- 临时文件
- 编辑器配置
- 缓存文件

## 🔧 配置建议

### 全局配置
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 项目特定配置
```bash
git config user.name "项目作者名"
git config user.email "项目邮箱"
```

## 🚨 常见问题解决

### 撤销未提交的更改
```bash
# 撤销工作区更改
git checkout -- filename

# 撤销暂存区更改
git reset HEAD filename
```

### 修改最后一次提交
```bash
git commit --amend -m "新的提交消息"
```

### 查看文件更改
```bash
git diff
git diff --staged
```

## 📚 扩展阅读

- [Pro Git Book](https://git-scm.com/book)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [GitHub Docs](https://docs.github.com)

---

**注意**: 如需推送到远程仓库，请先在GitHub/GitLab等平台创建仓库并配置远程origin。