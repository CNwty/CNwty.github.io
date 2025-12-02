import sys
sys.path.append('.')

from spiders.video_spider import BilibiliVideoSpider
import asyncio

async def test_data_fetching():
    spider = BilibiliVideoSpider()
    
    print('获取热门视频数据...')
    trending_data = await spider.get_trending_videos()
    print(f'热门视频数据类型: {type(trending_data)}')
    
    if trending_data:
        print(f'热门视频数据keys: {list(trending_data.keys()) if isinstance(trending_data, dict) else "Not a dict"}')
        if 'list' in trending_data:
            print(f'热门视频列表长度: {len(trending_data["list"])}')
            if len(trending_data['list']) > 0:
                print(f'第一个视频标题: {trending_data["list"][0].get("title", "N/A")}')
        else:
            print(f'热门数据结构: {trending_data}')
    else:
        print('热门视频数据为空')
    
    print('\n获取排行榜数据...')
    ranking_data = await spider.get_ranking_videos(rid=0)
    print(f'排行榜数据类型: {type(ranking_data)}')
    
    if ranking_data:
        print(f'排行榜数据keys: {list(ranking_data.keys()) if isinstance(ranking_data, dict) else "Not a dict"}')
        if 'list' in ranking_data:
            print(f'排行榜列表长度: {len(ranking_data["list"])}')
            if len(ranking_data['list']) > 0:
                print(f'第一个排行榜视频标题: {ranking_data["list"][0].get("title", "N/A")}')
        else:
            print(f'排行榜数据结构: {ranking_data}')
    else:
        print('排行榜数据为空')

if __name__ == "__main__":
    asyncio.run(test_data_fetching())