'use client'

import MapSection from './MapSection'
import PackageTicker from './PackageTicker'

export default function HomeClient({ packages, news, blogs, scans, stats }) {
  return (
    <>
      <MapSection packages={packages} />
      <PackageTicker packages={packages} />
    </>
  )
}
