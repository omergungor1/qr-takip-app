'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  formatTurkishMobileDisplay,
  isValidTurkishMobileDigits,
  normalizeTurkishMobileDigits,
} from '@/lib/turkish-mobile-phone'

export default function AdRequestForm() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const phoneOk = useMemo(() => isValidTurkishMobileDigits(phoneNumber), [phoneNumber])

  function handlePhoneChange(e) {
    setPhoneNumber(formatTurkishMobileDisplay(e.target.value))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!isValidTurkishMobileDigits(phoneNumber)) {
      setError('Cep telefonunu 05XX XXX XX XX biçiminde, 11 hane olarak girin.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ad-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          contact_person: contactPerson,
          phone_number: normalizeTurkishMobileDigits(phoneNumber),
          address,
          website: honeypot,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Gönderim başarısız oldu.')
        return
      }
      router.push('/reklam-ver/tesekkur')
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 mb-1">
          Firma adı <span className="text-red-500">*</span>
        </label>
        <input
          id="company_name"
          type="text"
          required
          maxLength={500}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        />
      </div>
      <div>
        <label htmlFor="contact_person" className="block text-sm font-medium text-slate-700 mb-1">
          İlgili kişi <span className="text-red-500">*</span>
        </label>
        <input
          id="contact_person"
          type="text"
          required
          maxLength={300}
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
        />
      </div>
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700 mb-1">
          Cep telefonu <span className="text-red-500">*</span>
        </label>
        <input
          id="phone_number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
          maxLength={14}
          value={phoneNumber}
          onChange={handlePhoneChange}
          aria-invalid={phoneNumber.length > 0 && !phoneOk}
          className={`w-full rounded-lg border px-3 py-2.5 text-slate-900 tracking-wide focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none ${
            phoneNumber.length > 0 && !phoneOk ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200'
          }`}
        />
        <p className="mt-1 text-xs text-slate-500">
          11 haneli cep numarası; örnek: 05XX XXX XX XX. Başında 0 ve 5 olmalıdır.
        </p>
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
          Adres
        </label>
        <textarea
          id="address"
          rows={4}
          maxLength={2000}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none resize-y min-h-[100px]"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !phoneOk}
        className="w-full sm:w-auto min-w-[160px] rounded-lg bg-[var(--primary)] text-white font-semibold px-8 py-3 hover:opacity-95 disabled:opacity-60 transition-opacity"
      >
        {loading ? 'Gönderiliyor…' : 'Gönder'}
      </button>
    </form>
  )
}
