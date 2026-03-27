import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { consumeRateLimit, getClientIp } from '@/lib/subscribe-rate-limit'
import { isValidTurkishMobileDigits, normalizeTurkishMobileDigits } from '@/lib/turkish-mobile-phone'

const MAX_ATTEMPTS_PER_IP = 8
const WINDOW_MS = 15 * 60 * 1000

function trim(str) {
  return typeof str === 'string' ? str.trim() : ''
}

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    const limited = consumeRateLimit(`ad-request:${ip}`, MAX_ATTEMPTS_PER_IP, WINDOW_MS)
    if (!limited.ok) {
      return NextResponse.json(
        {
          error: `Çok fazla deneme yapıldı. Lütfen yaklaşık ${Math.ceil(limited.retryAfterSec / 60)} dakika sonra tekrar deneyin.`,
        },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } }
      )
    }

    const body = await request.json()
    const trap = body?.website
    if (typeof trap === 'string' && trap.trim() !== '') {
      return NextResponse.json({ error: 'İstek işlenemedi.' }, { status: 400 })
    }

    const company_name = trim(body?.company_name)
    const contact_person = trim(body?.contact_person)
    const phone_raw = body?.phone_number
    const address = trim(body?.address)

    if (!company_name || company_name.length > 500) {
      return NextResponse.json({ error: 'Geçerli bir firma adı girin.' }, { status: 400 })
    }
    if (!contact_person || contact_person.length > 300) {
      return NextResponse.json({ error: 'İlgili kişi adı zorunludur.' }, { status: 400 })
    }
    if (!isValidTurkishMobileDigits(phone_raw)) {
      return NextResponse.json(
        { error: 'Cep telefonunu 05XX XXX XX XX biçiminde, eksiksiz girin.' },
        { status: 400 }
      )
    }
    const phone_number = normalizeTurkishMobileDigits(phone_raw)
    if (address.length > 2000) {
      return NextResponse.json({ error: 'Adres metni çok uzun.' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[ad-request] Supabase yapılandırması eksik')
      return NextResponse.json({ error: 'Servis yapılandırılmamış.' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('ad_requests').insert({
      company_name,
      contact_person,
      phone_number,
      address: address || null,
    })

    if (error) {
      console.error('[ad-request] Supabase:', error.code, error.message)
      return NextResponse.json(
        { error: error.message || 'Talep kaydedilemedi.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[ad-request]', err?.message || err)
    return NextResponse.json({ error: err?.message || 'Bir hata oluştu.' }, { status: 500 })
  }
}
