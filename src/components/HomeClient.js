'use client'

import { useState } from 'react'
import MapSection from './MapSection'
import PackageModal from './PackageModal'

export default function HomeClient({ packages, news, blogs, scans, stats }) {
  const [selectedPackage, setSelectedPackage] = useState(null)

  return (
    <>
      <MapSection
        packages={packages}
        onPackageClick={(pkg) => setSelectedPackage(pkg)}
      />
      {selectedPackage && (
        <PackageModal
          package={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          baseUrl={typeof window !== 'undefined' ? window.location.origin : ''}
        />
      )}
    </>
  )
}
