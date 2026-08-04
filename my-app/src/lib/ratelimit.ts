import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN

export const submissionLimiter = hasUpstash
  ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '1 h') })
  : null

export const writeLimiter = hasUpstash
  ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(20, '1 h') })
  : null

export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'
}
