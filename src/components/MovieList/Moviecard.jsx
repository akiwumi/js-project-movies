import React from 'react'
import './MovieCard.css'
import { Link } from 'react-router-dom'
import { getPosterUrl } from '../../api/tmdb'

const MovieCard = ({ movie }) => {
  const posterUrl = movie?.poster_path ? getPosterUrl(movie.poster_path, 'w342') : ''
  const year = movie?.release_date ? movie.release_date.slice(0, 4) : ''
  const rating = movie?.vote_average ? movie.vote_average.toFixed(1) : ''

  return (
    <Link to={`/movie/${movie?.id}`} className="movie_card" aria-label={movie?.title || 'Movie'}>
      {posterUrl ? (
        <img src={posterUrl} alt={movie?.title || 'Movie poster'} className="movie_poster" />
      ) : (
        <div className="movie_poster movie_poster--placeholder" />
      )}
      <div className="movie_details">
        <h3 className="movie_details_heading">{movie?.title || 'Untitled'}</h3>

        <div className="movie_date_rate">
          <p className="movie_date">{year ? `Release: ${year}` : 'Release: —'}</p>
          <p className="movie_rating">{rating ? `Rating: ${rating}` : 'Rating: —'}</p>
        </div>

        {movie?.overview ? <p className="movie_description">{movie.overview}</p> : null}
      </div>
    </Link>
  )
}

export default MovieCard