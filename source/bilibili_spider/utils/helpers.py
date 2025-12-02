"""
工具函数和配置
"""
import json
import os


def load_config(config_path="../config.json"):
    """
    加载配置文件
    """
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        # 返回默认配置
        default_config = {
            "crawl_interval": 30,
            "data_dir": "../data",
            "max_retry_times": 3,
            "delay_range": [1, 3]
        }
        save_config(default_config, config_path)
        return default_config


def save_config(config, config_path="../config.json"):
    """
    保存配置文件
    """
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)


def format_duration(seconds):
    """
    格式化时长（秒）为 HH:MM:SS 格式
    """
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


def clean_filename(filename):
    """
    清理文件名，移除特殊字符
    """
    import re
    # 移除或替换不安全的文件名字符
    return re.sub(r'[<>:"/\\|?*]', '_', filename)
