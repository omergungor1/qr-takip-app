'use client'

import MapSection from './MapSection'
import PackageTicker from './PackageTicker'

export default function HomeClient({ packages, recentScanMessages }) {
  return (
    <>
      <PackageTicker packages={packages} />
      <div className="mt-6">
        <MapSection packages={packages} recentScanMessages={recentScanMessages} />
      </div>
    </>
  )
}
