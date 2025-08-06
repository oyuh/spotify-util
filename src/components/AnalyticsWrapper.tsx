'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { inject } from "@vercel/analytics"
import { injectSpeedInsights } from '@vercel/speed-insights';

export function AnalyticsWrapper() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      {injectSpeedInsights()}
      {inject()}
    </>
  )
}
