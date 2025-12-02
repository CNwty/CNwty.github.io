"""
Web服务器 - 提供Bilibili热门视频数据的动态展示
"""
import json
import os
from datetime import datetime
from flask import Flask, render_template, jsonify, send_from_directory, request
from flask_cors import CORS  # 添加CORS支持
import threading
import time
from spiders.video_spider import BilibiliVideoSpider
import asyncio
import requests
from flask import Response

app = Flask(__name__, template_folder='web', static_folder='web')
CORS(app)  # 启用CORS

# 全局变量存储最新数据
latest_trending_data = []
latest_ranking_data = []

def update_data_periodically():
    """定期更新数据的后台线程"""
    global latest_trending_data, latest_ranking_data
    
    while True:
        try:
            print("正在更新热门视频数据...")
            # 使用asyncio运行异步函数
            trending_data = asyncio.run(run_spider_get_trending())
            if trending_data and 'list' in trending_data:
                latest_trending_data = trending_data['list'][:20]  # 只取前20个
            
            print("正在更新排行榜数据...")
            # 使用asyncio运行异步函数
            ranking_data = asyncio.run(run_spider_get_ranking())
            if ranking_data and 'list' in ranking_data:
                latest_ranking_data = ranking_data['list'][:100]  # 取前100个
            
            print(f"数据更新完成 - 热门: {len(latest_trending_data)}, 排行榜: {len(latest_ranking_data)}")
            
            # 等待5分钟后再次更新
            time.sleep(300)
        except Exception as e:
            print(f"更新数据时出错: {e}")
            import traceback
            traceback.print_exc()
            time.sleep(60)  # 出错时等待1分钟后重试

async def run_spider_get_trending():
    """异步运行爬虫获取热门数据"""
    spider = BilibiliVideoSpider()
    return await spider.get_trending_videos()

async def run_spider_get_ranking():
    """异步运行爬虫获取排行榜数据"""
    spider = BilibiliVideoSpider()
    return await spider.get_ranking_videos(rid=0)

@app.route('/')
def index():
    """主页"""
    return render_template('index.html')

@app.route('/api/trending')
def get_trending():
    """获取热门视频数据API"""
    global latest_trending_data
    return jsonify(latest_trending_data)

@app.route('/api/ranking')
def get_ranking():
    """获取排行榜数据API"""
    global latest_ranking_data
    return jsonify(latest_ranking_data)

@app.route('/api/refresh')
def refresh_data():
    """手动刷新数据API"""
    global latest_trending_data, latest_ranking_data
    try:
        # 使用asyncio运行异步函数
        trending_data = asyncio.run(run_spider_get_trending())
        if trending_data and 'list' in trending_data:
            latest_trending_data = trending_data['list'][:20]
        
        ranking_data = asyncio.run(run_spider_get_ranking())
        if ranking_data and 'list' in ranking_data:
            latest_ranking_data = ranking_data['list'][:20]
        
        return jsonify({
            'status': 'success',
            'trending_count': len(latest_trending_data),
            'ranking_count': len(latest_ranking_data)
        })
    except Exception as e:
        print(f"手动刷新数据时出错: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/api/image-proxy')
def image_proxy():
    """图片代理API，用于绕过CORS限制"""
    url = request.args.get('url', '')
    if not url:
        return Response('No URL provided', status=400)
    
    try:
        # 获取图片内容
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        response.raise_for_status()
        
        # 返回图片内容
        return Response(
            response.content,
            mimetype=response.headers.get('content-type', 'image/jpeg'),
            headers={'Cache-Control': 'public, max-age=3600'}
        )
    except Exception as e:
        print(f"图片代理错误: {e}")
        return Response('Failed to fetch image', status=500)

# 在应用启动时立即获取一次数据
def initialize_data():
    """初始化数据"""
    global latest_trending_data, latest_ranking_data
    print("初始化数据...")
    try:
        trending_data = asyncio.run(run_spider_get_trending())
        if trending_data and 'list' in trending_data:
            latest_trending_data = trending_data['list'][:20]
        
        ranking_data = asyncio.run(run_spider_get_ranking())
        if ranking_data and 'list' in ranking_data:
            latest_ranking_data = ranking_data['list'][:20]
        
        print(f"初始化完成 - 热门: {len(latest_trending_data)}, 排行榜: {len(latest_ranking_data)}")
    except Exception as e:
        print(f"初始化数据时出错: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    # 初始化数据
    initialize_data()
    
    # 启动后台数据更新线程
    update_thread = threading.Thread(target=update_data_periodically, daemon=True)
    update_thread.start()
    
    # 启动Web服务器
    app.run(debug=True, host='0.0.0.0', port=5000)