#!/usr/bin/env python3
"""
音频文件生成脚本
Audio File Generation Script

使用 Mac OS 的 say 命令生成英语音频，然后用 ffmpeg 转换为 MP3 格式
Uses Mac OS say command to generate English audio, then converts to MP3 with ffmpeg
"""

import os
import subprocess
import json
import re
import sys
from pathlib import Path

class AudioGenerator:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.audio_dir = self.base_dir / "audio"
        self.data_file = self.base_dir / "data.js"

        # 创建音频目录结构
        self.create_directories()

    def create_directories(self):
        """创建音频文件目录结构"""
        dirs = [
            self.audio_dir,
            self.audio_dir / "vocabulary",
            self.audio_dir / "phrases",
            self.audio_dir / "sentences"
        ]

        for dir_path in dirs:
            dir_path.mkdir(exist_ok=True)
            print(f"创建目录: {dir_path}")

    def sanitize_filename(self, text):
        """将文本转换为安全的文件名"""
        # 移除或替换不安全的字符
        sanitized = re.sub(r'[<>:"/\\|?*]', '', text)
        # 替换空格和特殊字符为下划线
        sanitized = re.sub(r'[^\w\s-]', '_', sanitized)
        sanitized = re.sub(r'\s+', '_', sanitized)
        # 限制长度
        if len(sanitized) > 50:
            sanitized = sanitized[:50]
        return sanitized.lower()

    def generate_audio_with_say(self, text, output_path):
        """使用 say 命令生成音频文件"""
        try:
            # 首先生成 AIFF 文件
            aiff_path = output_path.with_suffix('.aiff')
            cmd = ['say', '-v', 'Samantha', '-r', '180', '-o', str(aiff_path), text]

            print(f"生成音频: {text[:50]}...")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)

            if result.returncode == 0 and aiff_path.exists():
                # 转换为 MP3
                return self.convert_to_mp3(aiff_path, output_path)
            else:
                print(f"say 命令失败: {result.stderr}")
                return False

        except subprocess.TimeoutExpired:
            print(f"生成音频超时: {text[:50]}...")
            return False
        except Exception as e:
            print(f"生成音频出错: {e}")
            return False

    def convert_to_mp3(self, input_path, output_path):
        """使用 ffmpeg 将音频文件转换为 MP3"""
        try:
            cmd = [
                'ffmpeg', '-y',  # 覆盖输出文件
                '-i', str(input_path),  # 输入文件
                '-codec:a', 'libmp3lame',  # 使用 MP3 编码
                '-qscale:a', '2',  # 音质设置 (0-9, 0是最高质量)
                str(output_path)
            ]

            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)

            if result.returncode == 0 and output_path.exists():
                # 删除临时的 AIFF 文件
                input_path.unlink()
                print(f"✓ 转换完成: {output_path.name}")
                return True
            else:
                print(f"ffmpeg 转换失败: {result.stderr}")
                return False

        except subprocess.TimeoutExpired:
            print(f"转换超时: {input_path}")
            return False
        except FileNotFoundError:
            print("错误: 未找到 ffmpeg。请先安装 ffmpeg。")
            print("安装命令: brew install ffmpeg")
            return False
        except Exception as e:
            print(f"转换出错: {e}")
            return False

    def load_data(self):
        """从 data.js 文件加载数据"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # 提取 flashcardData 对象
            start_marker = "const flashcardData = "
            end_marker = ";"

            start_idx = content.find(start_marker)
            if start_idx == -1:
                raise ValueError("未找到 flashcardData")

            start_idx += len(start_marker)
            end_idx = content.find(end_marker, start_idx)
            if end_idx == -1:
                raise ValueError("未找到数据结束标记")

            data_str = content[start_idx:end_idx]
            data = json.loads(data_str)

            return data

        except json.JSONDecodeError as e:
            print(f"JSON解析失败: {e}")
            # 尝试使用简单的正则表达式提取数据
            return self.extract_data_with_regex(content)
        except Exception as e:
            print(f"加载数据失败: {e}")
            return None

    def extract_data_with_regex(self, content):
        """使用正则表达式提取数据（备用方法）"""
        try:
            # 提取 vocabulary 数组
            vocab_match = re.search(r'vocabulary:\s*\[(.*?)\]', content, re.DOTALL)
            phrases_match = re.search(r'phrases:\s*\[(.*?)\]', content, re.DOTALL)
            sentences_match = re.search(r'sentences:\s*\[(.*?)\]', content, re.DOTALL)

            def parse_array(array_text):
                if not array_text:
                    return []

                items = []
                # 查找所有对象
                obj_pattern = r'\{\s*english:\s*"([^"]*)"\s*,\s*chinese:\s*"([^"]*)"\s*(?:,\s*unit:\s*(\d+))?\s*(?:,\s*keyWords:\s*\[(.*?)\])?\s*\}'
                for match in re.finditer(obj_pattern, array_text):
                    item = {
                        'english': match.group(1),
                        'chinese': match.group(2)
                    }
                    if match.group(3):
                        item['unit'] = int(match.group(3))
                    if match.group(4):
                        # 清理关键词数组
                        keywords = match.group(4).strip()
                        if keywords:
                            item['keyWords'] = [kw.strip().strip('"\'') for kw in keywords.split(',')]
                    items.append(item)
                return items

            return {
                'vocabulary': parse_array(vocab_match.group(1) if vocab_match else ''),
                'phrases': parse_array(phrases_match.group(1) if phrases_match else ''),
                'sentences': parse_array(sentences_match.group(1) if sentences_match else '')
            }

        except Exception as e:
            print(f"正则表达式提取数据失败: {e}")
            return None

    def generate_vocabulary_audio(self, vocabulary_data):
        """生成词汇音频文件"""
        print(f"\n=== 生成词汇音频 ({len(vocabulary_data)} 个) ===")
        success_count = 0

        for item in vocabulary_data:
            english = item.get('english', '').strip()
            if not english:
                continue

            filename = self.sanitize_filename(english) + ".mp3"
            output_path = self.audio_dir / "vocabulary" / filename

            if output_path.exists():
                print(f"跳过已存在: {filename}")
                success_count += 1
                continue

            if self.generate_audio_with_say(english, output_path):
                success_count += 1

        print(f"词汇音频生成完成: {success_count}/{len(vocabulary_data)}")
        return success_count

    def generate_phrases_audio(self, phrases_data):
        """生成短语音频文件"""
        print(f"\n=== 生成短语音频 ({len(phrases_data)} 个) ===")
        success_count = 0

        for item in phrases_data:
            english = item.get('english', '').strip()
            if not english:
                continue

            filename = self.sanitize_filename(english) + ".mp3"
            output_path = self.audio_dir / "phrases" / filename

            if output_path.exists():
                print(f"跳过已存在: {filename}")
                success_count += 1
                continue

            if self.generate_audio_with_say(english, output_path):
                success_count += 1

        print(f"短语音频生成完成: {success_count}/{len(phrases_data)}")
        return success_count

    def generate_sentences_audio(self, sentences_data):
        """生成句子音频文件"""
        print(f"\n=== 生成句子音频 ({len(sentences_data)} 个) ===")
        success_count = 0

        for item in sentences_data:
            english = item.get('english', '').strip()
            if not english:
                continue

            filename = self.sanitize_filename(english) + ".mp3"
            output_path = self.audio_dir / "sentences" / filename

            if output_path.exists():
                print(f"跳过已存在: {filename}")
                success_count += 1
                continue

            if self.generate_audio_with_say(english, output_path):
                success_count += 1

        print(f"句子音频生成完成: {success_count}/{len(sentences_data)}")
        return success_count

    def generate_all_audio(self):
        """生成所有音频文件"""
        print("开始生成音频文件...")

        # 检查系统依赖
        if not self.check_dependencies():
            return False

        # 加载数据
        data = self.load_data()
        if not data:
            return False

        total_success = 0
        total_items = 0

        # 生成词汇音频
        vocabulary = data.get('vocabulary', [])
        total_items += len(vocabulary)
        total_success += self.generate_vocabulary_audio(vocabulary)

        # 生成短语音频
        phrases = data.get('phrases', [])
        total_items += len(phrases)
        total_success += self.generate_phrases_audio(phrases)

        # 生成句子音频
        sentences = data.get('sentences', [])
        total_items += len(sentences)
        total_success += self.generate_sentences_audio(sentences)

        print(f"\n=== 音频生成完成 ===")
        print(f"总计: {total_success}/{total_items} 个文件")

        if total_success == total_items:
            print("✓ 所有音频文件生成成功！")
            return True
        else:
            print(f"⚠ 有 {total_items - total_success} 个文件生成失败")
            return False

    def check_dependencies(self):
        """检查系统依赖"""
        print("检查系统依赖...")

        # 检查 say 命令
        try:
            result = subprocess.run(['which', 'say'], capture_output=True, text=True, check=True)
            if result.returncode == 0:
                print("✓ say 命令可用")
            else:
                print("✗ say 命令不可用（此脚本需要 Mac OS）")
                return False
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("✗ say 命令不可用（此脚本需要 Mac OS）")
            return False

        # 检查 ffmpeg
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            print("✓ ffmpeg 可用")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("✗ ffmpeg 未安装")
            print("请安装 ffmpeg: brew install ffmpeg")
            return False

        return True

def main():
    """主函数"""
    print("英语音频文件生成器")
    print("English Audio File Generator")
    print("=" * 50)

    generator = AudioGenerator()

    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "clean":
            # 清理已生成的音频文件
            print("清理已生成的音频文件...")
            import shutil
            if generator.audio_dir.exists():
                shutil.rmtree(generator.audio_dir)
                print("✓ 清理完成")
            generator.create_directories()
            return

    # 生成所有音频文件
    success = generator.generate_all_audio()

    if success:
        print("\n🎉 音频生成全部完成！")
        print("现在可以运行 web 应用并使用本地音频文件了。")
    else:
        print("\n❌ 音频生成过程中出现错误")
        sys.exit(1)

if __name__ == "__main__":
    main()