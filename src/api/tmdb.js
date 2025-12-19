const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

function getAuthHeaders() {
  const token = import.meta.env.VITE_TMDB_READ_TOKEN
  if (!token) return {}
  return {
    Authorization: `Bearer ${token}`,
  }
}

function getApiKeyParam() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  return apiKey ? `api_key=${encodeURIComponent(apiKey)}` : ''
}

async function tmdbFetch(path, { params = {} } = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`)

  // Prefer Bearer token auth; fall back to api_key query param if present.
  const apiKeyParam = getApiKeyParam()
  const authHeaders = getAuthHeaders()

  if (!apiKeyParam && !authHeaders.Authorization) {
    throw new Error('Missing TMDB credentials. Set VITE_TMDB_READ_TOKEN or VITE_TMDB_API_KEY in your env.')
  }

  if (apiKeyParam) {
    const [k, v] = apiKeyParam.split('=')
    url.searchParams.set(k, v)
  }

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    url.searchParams.set(k, String(v))
  })

  const res = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      ...authHeaders,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`TMDB ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`)
  }

  return res.json()
}

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export function getPosterUrl(path, size = 'w342') {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function listMoviesByCategory(category, { page = 1, language = 'en-US' } = {}) {
  return tmdbFetch(`/movie/${category}`, { params: { language, page } })
}

export function getMovieDetails(movieId, { language = 'en-US' } = {}) {
  return tmdbFetch(`/movie/${movieId}`, { params: { language } })
}


