"""
Bilibili 热门视频爬虫 - 主程序
提供实时更新功能
"""
import asyncio
import argparse
from spiders.video_spider import BilibiliVideoSpider


def main():
    parser = argparse.ArgumentParser(description='Bilibili 热门视频爬虫')
    parser.add_argument('--once', action='store_true', help='只运行一次（不持续更新）')
    parser.add_argument('--interval', type=int, default=30, help='更新间隔（分钟）默认30')
    parser.add_argument('--mode', choices=['trending', 'ranking'], default='trending', 
                        help='爬取模式: trending(热门), ranking(排行榜)')
    parser.add_argument('--rid', type=int, default=0, help='排行榜分区ID，默认为0（全站）')
    
    args = parser.parse_args()
    
    spider = BilibiliVideoSpider()
    
    if args.once:
        # 单次运行
        print("开始单次爬取...")
        if args.mode == 'trending':
            asyncio.run(spider.crawl_trending_videos())
        elif args.mode == 'ranking':
            asyncio.run(spider.crawl_ranking_videos(rid=args.rid))
        print("单次爬取完成")
    else:
        # 持续运行
        print(f"开始持续爬取 {args.mode} 模式，间隔 {args.interval} 分钟")
        if args.mode == 'trending':
            asyncio.run(spider.run_continuous_crawl(interval_minutes=args.interval, mode='trending'))
        elif args.mode == 'ranking':
            asyncio.run(spider.run_continuous_crawl(interval_minutes=args.interval, mode='ranking', rid=args.rid))


if __name__ == "__main__":
    main()