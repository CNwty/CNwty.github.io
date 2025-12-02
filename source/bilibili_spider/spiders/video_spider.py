"""
Bilibili 热门视频爬虫
使用 bilibili-api-python 库实现
"""
import asyncio
import json
import os
from datetime import datetime
from bilibili_api import hot, rank
from bilibili_api.rank import RankType
from bilibili_api.video import Video
import time
from utils.helpers import load_config


class BilibiliVideoSpider:
    def __init__(self):
        self.config = load_config()
        self.data_dir = self.config.get("data_dir", "./data")
        # 确保data_dir是相对于项目根目录的路径
        if self.data_dir.startswith('../'):
            # 如果是相对上层目录的路径，改为相对于当前工作目录
            import os
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), self.data_dir[3:])
        elif self.data_dir.startswith('./'):
            # 如果是相对当前目录的路径，改为相对于项目根目录
            import os
            self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), self.data_dir[2:])
        
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
    
    async def get_trending_videos(self):
        """
        获取热门视频数据
        """
        try:
            # 获取热门视频列表
            trending_data = await hot.get_hot_videos()
            return trending_data
        except Exception as e:
            print(f"获取热门视频失败: {e}")
            return None
    
    async def get_ranking_videos(self, rid=0):
        """
        获取排行榜视频数据
        rid: 分区ID，默认为0（全站）
        """
        try:
            # 获取排行榜视频列表
            # 根据rid值选择不同的排行榜类型
            if rid == 0:
                # 全站排行榜
                ranking_data = await rank.get_rank(RankType.All)
            elif rid == 1:
                # 动画区排行榜
                ranking_data = await rank.get_rank(RankType.Douga)
            elif rid == 3:
                # 音乐区排行榜
                ranking_data = await rank.get_rank(RankType.Music)
            elif rid == 4:
                # 游戏区排行榜
                ranking_data = await rank.get_rank(RankType.Game)
            elif rid == 5:
                # 娱乐区排行榜
                ranking_data = await rank.get_rank(RankType.Ent)
            elif rid == 36:
                # 知识区排行榜
                ranking_data = await rank.get_rank(RankType.Knowledge)
            elif rid == 160:
                # 生活区排行榜
                ranking_data = await rank.get_rank(RankType.Life)
            elif rid == 119:
                # 鬼畜区排行榜
                ranking_data = await rank.get_rank(RankType.Kichiku)
            elif rid == 155:
                # 时尚区排行榜
                ranking_data = await rank.get_rank(RankType.Fashion)
            elif rid == 167:
                # 国创区排行榜
                ranking_data = await rank.get_rank(RankType.Guochuang)
            elif rid == 177:
                # 电影区排行榜
                ranking_data = await rank.get_rank(RankType.Movie)
            elif rid == 181:
                # TV剧集排行榜
                ranking_data = await rank.get_rank(RankType.TV)
            else:
                # 默认使用全站排行榜
                ranking_data = await rank.get_rank(RankType.All)
            return ranking_data
        except Exception as e:
            print(f"获取排行榜视频失败: {e}")
            return None
    
    async def get_video_detail(self, bvid):
        """
        获取视频详细信息
        """
        try:
            video = Video(bvid=bvid)
            info = await video.get_info()
            return info
        except Exception as e:
            print(f"获取视频 {bvid} 详情失败: {e}")
            return None
    
    async def save_data(self, data, filename):
        """
        保存数据到文件
        """
        filepath = os.path.join(self.data_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"数据已保存到: {filepath}")
    
    async def crawl_trending_videos(self):
        """
        爬取热门视频数据
        """
        print("开始爬取热门视频...")
        trending_data = await self.get_trending_videos()
        
        if trending_data:
            # 保存原始热门数据
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            await self.save_data(trending_data, f"trending_videos_{timestamp}.json")
            
            # 提取视频BV号并获取详细信息
            video_details = []
            if 'list' in trending_data:  # 热门视频数据结构
                videos = trending_data['list']
                for i, video in enumerate(videos):
                    print(f"正在获取视频详情 {i+1}/{len(videos)}: {video.get('title', 'Unknown')}")
                    # 尝试从多个可能的字段获取视频ID
                    bvid = video.get('bvid') or video.get('param')  # 优先使用bvid，备选param
                    if bvid:
                        detail = await self.get_video_detail(bvid)
                        if detail:
                            video_details.append({
                                'trending_info': video,
                                'detail_info': detail
                            })
            
            # 保存详细数据
            await self.save_data(video_details, f"trending_videos_detail_{timestamp}.json")
            print(f"爬取完成，共获取 {len(video_details)} 个视频详情")
            return video_details
        else:
            print("未获取到热门视频数据")
            return []
    
    async def crawl_ranking_videos(self, rid=0):
        """
        爬取排行榜视频数据
        rid: 分区ID，默认为0（全站）
        """
        print(f"开始爬取排行榜视频 (rid={rid})...")
        ranking_data = await self.get_ranking_videos(rid=rid)
        
        if ranking_data:
            # 保存原始排行榜数据
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            await self.save_data(ranking_data, f"ranking_videos_{rid}_{timestamp}.json")
            
            # 提取视频BV号并获取详细信息
            video_details = []
            if 'list' in ranking_data:  # 排行榜视频数据结构
                videos = ranking_data['list']
                for i, video in enumerate(videos):
                    print(f"正在获取视频详情 {i+1}/{len(videos)}: {video.get('title', 'Unknown')}")
                    # 尝试从多个可能的字段获取视频ID
                    bvid = video.get('bvid') or video.get('param')  # 优先使用bvid，备选param
                    if bvid:
                        detail = await self.get_video_detail(bvid)
                        if detail:
                            video_details.append({
                                'ranking_info': video,
                                'detail_info': detail
                            })
            
            # 保存详细数据
            await self.save_data(video_details, f"ranking_videos_detail_{rid}_{timestamp}.json")
            print(f"爬取完成，共获取 {len(video_details)} 个视频详情")
            return video_details
        else:
            print("未获取到排行榜视频数据")
            return []
    
    async def crawl_by_mode(self, mode='trending', **kwargs):
        """
        根据模式爬取视频数据
        mode: 'trending' 或 'ranking'
        """
        if mode == 'trending':
            return await self.crawl_trending_videos()
        elif mode == 'ranking':
            rid = kwargs.get('rid', 0)  # 默认全站排行榜
            return await self.crawl_ranking_videos(rid=rid)
        else:
            print(f"不支持的模式: {mode}")
            return []
    
    async def run_continuous_crawl(self, interval_minutes=30, mode='trending', **kwargs):
        """
        持续爬取视频数据
        interval_minutes: 爬取间隔（分钟）
        mode: 爬取模式 ('trending' 或 'ranking')
        """
        print(f"开始持续爬取 {mode} 模式，间隔 {interval_minutes} 分钟")
        while True:
            try:
                if mode == 'trending':
                    await self.crawl_trending_videos()
                elif mode == 'ranking':
                    rid = kwargs.get('rid', 0)
                    await self.crawl_ranking_videos(rid=rid)
                print(f"等待 {interval_minutes} 分钟后继续...")
                await asyncio.sleep(interval_minutes * 60)
            except KeyboardInterrupt:
                print("用户中断爬取")
                break
            except Exception as e:
                print(f"爬取过程中出现错误: {e}")
                max_retry = self.config.get("max_retry_times", 3)
                for i in range(max_retry):
                    print(f"等待后重试... ({i+1}/{max_retry})")
                    # 随机延迟避免被限制
                    import random
                    delay = random.uniform(1, 5)
                    await asyncio.sleep(delay)
                    try:
                        if mode == 'trending':
                            await self.crawl_trending_videos()
                        elif mode == 'ranking':
                            rid = kwargs.get('rid', 0)
                            await self.crawl_ranking_videos(rid=rid)
                        break  # 成功则跳出重试循环
                    except Exception as retry_e:
                        print(f"重试失败: {retry_e}")
                        if i == max_retry - 1:
                            print("达到最大重试次数，继续等待下一轮")
    
    async def run_continuous_crawl(self, interval_minutes=30):
        """
        持续爬取热门视频数据
        interval_minutes: 爬取间隔（分钟）
        """
        print(f"开始持续爬取热门视频，间隔 {interval_minutes} 分钟")
        while True:
            try:
                await self.crawl_trending_videos()
                print(f"等待 {interval_minutes} 分钟后继续...")
                await asyncio.sleep(interval_minutes * 60)
            except KeyboardInterrupt:
                print("用户中断爬取")
                break
            except Exception as e:
                print(f"爬取过程中出现错误: {e}")
                print(f"等待 {interval_minutes} 分钟后重试...")
                await asyncio.sleep(interval_minutes * 60)


# 使用示例
if __name__ == "__main__":
    spider = BilibiliVideoSpider()
    
    # 单次爬取
    # asyncio.run(spider.crawl_trending_videos())
    
    # 持续爬取（取消注释以启用）
    # asyncio.run(spider.run_continuous_crawl(interval_minutes=30))