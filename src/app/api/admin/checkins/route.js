import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getStorageUrl } from '@/lib/utils'

const STATUSES = ['pending', 'approved', 'rejected', 'hidden']

function parseIntSafe(value, fallback) {
  const n = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export async function GET(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'pending'
    const q = (url.searchParams.get('q') || '').trim()
    const page = parseIntSafe(url.searchParams.get('page'), 1)
    const limit = parseIntSafe(url.searchParams.get('limit'), 20)
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('package_scans')
      .select('id,status,created_at,message,image_path,province,district,packages(code,title)')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (type === 'pending') {
      query = query.eq('status', 'pending')
    }

    if (type === 'all' && q) {
      const like = `%${q}%`
      const or = [
        `province.ilike.${like}`,
        `district.ilike.${like}`,
        `message.ilike.${like}`,
        `packages.title.ilike.${like}`,
        `packages.code.ilike.${like}`,
      ].join(',')

      query = query.or(or)
    }

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: error.message || 'Query failed' }, { status: 400 })
    }

    const items = (data || []).map((row) => ({
      id: row.id,
      status: row.status,
      created_at: row.created_at,
      province: row.province,
      district: row.district,
      message: row.message,
      image_url: row.image_path ? getStorageUrl(row.image_path) : null,
      package: row.packages
        ? {
            code: row.packages.code,
            title: row.packages.title,
          }
        : null,
    }))

    const hasMore = items.length === limit
    return NextResponse.json({ items, hasMore })
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const id = body?.id
    const status = body?.status

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Geçersiz id' }, { status: 400 })
    }
    if (!STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('package_scans')
      .update({ status })
      .eq('id', id)
      .select('id,status')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message || 'Update failed' }, { status: 400 })
    }

    return NextResponse.json({ success: true, row: data })
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

