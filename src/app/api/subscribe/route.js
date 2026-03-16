import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
}

export async function POST(request) {
  try {
    const body = await request.json()
    const email = (body?.email || '').trim().toLowerCase()
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[subscribe] Supabase URL veya API key tanımlı değil (.env.local)')
      return NextResponse.json(
        { error: 'Abonelik servisi yapılandırılmamış.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { error } = await supabase.from('subscribers').insert({ email })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ success: true })
      }
      console.error('[subscribe] Supabase error:', error.code, error.message)
      return NextResponse.json(
        { error: error.message || 'Abonelik kaydedilemedi.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[subscribe] Exception:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Bir hata oluştu.' },
      { status: 500 }
    )
  }
}
