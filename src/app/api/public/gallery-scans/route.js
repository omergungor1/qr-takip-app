import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getStorageUrl } from '@/lib/utils'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const rawOffset = parseInt(searchParams.get('offset') || '0', 10)
    const rawLimit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = Number.isFinite(rawOffset) && rawOffset >= 0 ? rawOffset : 0
    const limit = Math.min(30, Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 10))

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Sunucu yapılandırması eksik.' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const rangeEnd = offset + limit - 1

    const { data, error } = await supabase
      .from('package_scans')
      .select('id, province, district, message, image_path, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, rangeEnd)

    if (error) {
      console.error('[gallery-scans]', error.message)
      return NextResponse.json({ error: error.message || 'Veri alınamadı.' }, { status: 500 })
    }

    const rows = data || []
    const items = rows.map((s) => ({
      id: s.id,
      province: s.province,
      district: s.district,
      message: s.message,
      image_path: s.image_path ? getStorageUrl(s.image_path) : null,
      created_at: s.created_at,
    }))

    return NextResponse.json({
      items,
      hasMore: rows.length === limit,
      nextOffset: offset + rows.length,
    })
  } catch (err) {
    console.error('[gallery-scans]', err)
    return NextResponse.json({ error: err?.message || 'Bir hata oluştu.' }, { status: 500 })
  }
}
