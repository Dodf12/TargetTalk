from .config import settings
from upstash_redis import Redis

redis = Redis(url=settings.UPSTASH_REDIS_REST_URL, token=settings.UPSTASH_REDIS_REST_TOKEN)

def save_audience(audience: str):
    redis.zincrby("audiences", increment=1, member=audience)

def get_top_audiences():
    results = redis.zrevrange("audiences", 0, 4, withscores=True)
    
    if not results:
        return []
    
    top_score = results[0][1]
    top_audiences = [audience for audience, score in results if score == top_score]
    
    return top_audiences

