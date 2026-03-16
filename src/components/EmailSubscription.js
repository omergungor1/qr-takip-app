'use client'

import { useState } from 'react'

export default function EmailSubscription() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('') // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setMessage(data?.error || 'Bir hata oluştu.')
        return
      }
      setStatus('success')
      setEmail('')
      setMessage('E-posta listemize eklendiniz. Teşekkürler!')
    } catch {
      setStatus('error')
      setMessage('Bağlantı hatası.')
    }
  }

  return (
    <section className="py-12 sm:py-16 bg-[var(--primary)]/10 border-t border-[var(--primary)]/20">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
          GezginKitap yolculuğunu kaçırmayın
        </h3>
        <p className="text-[var(--text-light)] text-sm sm:text-base mb-6">
          GezginKitap projesinin en güncel hareketlerini, yeni kitap yolculuklarını ve sürpriz etkinlikleri öğrenmek için mail listemize katılın.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            disabled={status === 'success'}
            className="flex-1 min-w-0 rounded-xl border border-slate-300 px-4 py-3 text-[var(--foreground)] bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-xl bg-[var(--primary)] text-white font-semibold px-6 py-3 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === 'loading' ? 'Gönderiliyor...' : 'Abone Ol'}
          </button>
        </form>
        {message && (
          <p className={`mt-3 text-sm ${status === 'error' ? 'text-red-600' : 'text-[var(--accent)]'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  )
}
