'use client'

import { useState } from 'react'

export default function EmailSubscription() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('') // idle | loading | success | error | already
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setStatus('loading')
    const form = e.currentTarget
    const formData = new FormData(form)
    const rawEmail = (formData.get('email') || '').toString().trim()
    const honeypot = (formData.get('website') || '').toString().trim()

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: rawEmail, website: honeypot }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.status === 429) {
        setStatus('error')
        setMessage(data?.error || 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.')
        return
      }

      if (!res.ok) {
        setStatus('error')
        setMessage(data?.error || 'Bir hata oluştu.')
        return
      }

      if (data?.alreadySubscribed) {
        setStatus('already')
        setMessage(data?.message || 'Bu e-posta adresi zaten listemizde kayıtlı.')
        return
      }

      if (data?.success) {
        setStatus('success')
        setEmail('')
        form.reset()
        setMessage(data?.message || 'Teşekkür ederiz! E-posta listemize başarıyla eklendiniz.')
        return
      }

      setStatus('error')
      setMessage('Beklenmeyen yanıt.')
    } catch {
      setStatus('error')
      setMessage('Bağlantı hatası.')
    }
  }

  const messageClass =
    status === 'error'
      ? 'text-red-600'
      : status === 'already'
        ? 'text-amber-800'
        : 'text-[var(--accent)]'

  return (
    <section className="py-12 sm:py-16 bg-[var(--primary)]/10 border-t border-[var(--primary)]/20">
      <div className="container mx-auto px-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          <aside className="order-2 lg:order-1 w-full max-w-xl mx-auto lg:max-w-none rounded-xl border-2 border-dashed border-[var(--foreground)]/15 bg-[var(--background)]/70 px-4 py-3 text-center min-h-[120px] sm:min-h-[160px] flex flex-col items-center justify-center">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-light)]/80">Reklam alanı</span>
            <span className="block text-xs sm:text-sm text-[var(--text-light)] mt-1">Sol banner (728x180 / 320x200)</span>
          </aside>

          <div className="order-1 lg:order-2 max-w-xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
              GezginKitap yolculuğunu kaçırmayın
            </h3>
            <p className="text-[var(--text-light)] text-sm sm:text-base mb-6">
              GezginKitap projesinin en güncel hareketlerini, yeni kitap yolculuklarını ve sürpriz etkinlikleri öğrenmek için mail listemize katılın.
            </p>
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col sm:flex-row gap-3 justify-center"
              noValidate
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                defaultValue=""
                className="absolute left-0 top-0 h-px w-px opacity-0 overflow-hidden pointer-events-none"
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta adresiniz"
                required
                disabled={status === 'loading'}
                autoComplete="email"
                maxLength={254}
                className="flex-1 min-w-0 rounded-xl border border-slate-300 px-4 py-3 text-[var(--foreground)] bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-xl bg-[var(--primary)] text-white font-semibold px-6 py-3 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
              >
                {status === 'loading' ? 'Gönderiliyor...' : 'Ücretsiz Abone Ol'}
              </button>
            </form>
            {message && (
              <p role="status" className={`mt-3 text-sm font-medium ${messageClass}`}>
                {message}
              </p>
            )}
          </div>

          <aside className="order-3 w-full max-w-xl mx-auto lg:max-w-none rounded-xl border-2 border-dashed border-[var(--foreground)]/15 bg-[var(--background)]/70 px-4 py-3 text-center min-h-[120px] sm:min-h-[160px] flex flex-col items-center justify-center">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-light)]/80">Reklam alanı</span>
            <span className="block text-xs sm:text-sm text-[var(--text-light)] mt-1">Sağ banner (728x180 / 320x200)</span>
          </aside>
        </div>
      </div>
    </section>
  )
}
