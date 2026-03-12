'use client'

import { useState } from 'react'
import MapSection from './MapSection'
import PackageModal from './PackageModal'
import PackageTicker from './PackageTicker'

export default function HomeClient({ packages, news, blogs, scans, stats }) {
  const [selectedPackage, setSelectedPackage] = useState(null)

  return (
    <>
      <MapSection
        packages={packages}
        onPackageClick={(pkg) => setSelectedPackage(pkg)}
      />
      <PackageTicker packages={packages} />
      {selectedPackage && (
        <PackageModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </>
  )
}
