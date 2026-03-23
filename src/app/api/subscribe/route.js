import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { consumeRateLimit, getClientIp } from '@/lib/subscribe-rate-limit'

const MAX_ATTEMPTS_PER_IP = 10
const WINDOW_MS = 15 * 60 * 1000

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
}

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const limited = consumeRateLimit(`subscribe:${ip}`, MAX_ATTEMPTS_PER_IP, WINDOW_MS)
    if (!limited.ok) {
      return NextResponse.json(
        {
          error: `Çok fazla deneme yapıldı. Lütfen yaklaşık ${Math.ceil(limited.retryAfterSec / 60)} dakika sonra tekrar deneyin.`,
        },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } }
      )
    }

    const body = await request.json()

    // Honeypot: botlar genelde gizli alanı doldurur; boş olmalı
    const trap = body?.website
    if (typeof trap === 'string' && trap.trim() !== '') {
      return NextResponse.json({ error: 'İstek işlenemedi.' }, { status: 400 })
    }

    const email = (body?.email || '').trim().toLowerCase()
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[subscribe] NEXT_PUBLIC_SUPABASE_URL veya anon key tanımlı değil (.env.local)')
      return NextResponse.json(
        { error: 'Abonelik servisi yapılandırılmamış.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('subscribers').insert({ email })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          alreadySubscribed: true,
          message: 'Bu e-posta adresi zaten listemizde kayıtlı.',
        })
      }
      console.error('[subscribe] Supabase error:', error.code, error.message)
      return NextResponse.json(
        { error: error.message || 'Abonelik kaydedilemedi.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Teşekkür ederiz! E-posta listemize başarıyla eklendiniz.',
    })
  } catch (err) {
    console.error('[subscribe] Exception:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Bir hata oluştu.' },
      { status: 500 }
    )
  }
}
