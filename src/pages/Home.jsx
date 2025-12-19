import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import MovieList from '../components/MovieList/MovieList'
import { listMoviesByCategory } from '../api/tmdb'

const CATEGORY_DEFAULT = 'popular'

function mapUiCategoryToApi(category) {
  if (category === 'new') return 'now_playing'
  return category
}

function sortMovies(movies, sortKey, order) {
  const dir = order === 'asc' ? 1 : -1
  const copy = [...movies]

  copy.sort((a, b) => {
    if (sortKey === 'rating') return dir * ((a.vote_average ?? 0) - (b.vote_average ?? 0))
    if (sortKey === 'release_date') {
      const ad = a.release_date ? Date.parse(a.release_date) : 0
      const bd = b.release_date ? Date.parse(b.release_date) : 0
      return dir * (ad - bd)
    }
    // popularity
    return dir * ((a.popularity ?? 0) - (b.popularity ?? 0))
  })

  return copy
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category') || CATEGORY_DEFAULT // popular | top_rated | new
  const sort = searchParams.get('sort') || 'popularity' // popularity | rating | release_date
  const order = searchParams.get('order') || 'desc' // asc | desc

  const [rawMovies, setRawMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function run() {
      setIsLoading(true)
      setError('')
      try {
        const apiCategory = mapUiCategoryToApi(category)
        const data = await listMoviesByCategory(apiCategory, { page: 1, language: 'en-US' })
        if (cancelled) return
        setRawMovies(data?.results ?? [])
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load movies')
        setRawMovies([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [category])

  const movies = useMemo(() => sortMovies(rawMovies, sort, order), [rawMovies, sort, order])

  const setCategory = (nextCategory) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('category', nextCategory)
      return next
    })
  }

  const setSort = (nextSort) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('sort', nextSort)
      return next
    })
  }

  const setOrder = (nextOrder) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('order', nextOrder)
      return next
    })
  }

  return (
    <MovieList
      category={category}
      sort={sort}
      order={order}
      movies={movies}
      isLoading={isLoading}
      error={error}
      onCategoryChange={setCategory}
      onSortChange={setSort}
      onOrderChange={setOrder}
    />
  )
}


