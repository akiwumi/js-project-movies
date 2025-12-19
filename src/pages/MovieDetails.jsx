import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getMovieDetails, getPosterUrl } from '../api/tmdb'
import './MovieDetails.css'

export default function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!id) return
      setIsLoading(true)
      setError('')
      try {
        const data = await getMovieDetails(id, { language: 'en-US' })
        if (cancelled) return
        setMovie(data)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Failed to load movie details')
        setMovie(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [id])

  const posterUrl = movie?.poster_path ? getPosterUrl(movie.poster_path, 'w500') : ''

  return (
    <main className="movie-details">
      <div className="movie-details__topbar">
        <button className="movie-details__back" type="button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <Link className="movie-details__home" to="/">
          Home
        </Link>
      </div>

      {isLoading && <p className="movie-details__status">Loading…</p>}
      {error && <p className="movie-details__error">{error}</p>}

      {!isLoading && !error && movie && (
        <section className="movie-details__content">
          {posterUrl && <img className="movie-details__poster" src={posterUrl} alt={movie.title} />}

          <div className="movie-details__meta">
            <h2 className="movie-details__title">{movie.title}</h2>
            {movie.tagline && <p className="movie-details__tagline">{movie.tagline}</p>}

            <div className="movie-details__facts">
              <span>
                <strong>Release:</strong> {movie.release_date || '—'}
              </span>
              <span>
                <strong>Rating:</strong> {movie.vote_average?.toFixed?.(1) ?? movie.vote_average ?? '—'}
              </span>
              <span>
                <strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} min` : '—'}
              </span>
            </div>

            {movie.genres?.length ? (
              <div className="movie-details__genres">
                {movie.genres.map((g) => (
                  <span key={g.id} className="movie-details__genre">
                    {g.name}
                  </span>
                ))}
              </div>
            ) : null}

            {movie.overview && <p className="movie-details__overview">{movie.overview}</p>}
          </div>
        </section>
      )}
    </main>
  )
}


