import React from 'react'
import './MovieList.css'
import MovieCard from './Moviecard.jsx'

const MovieList = ({
  category,
  sort,
  order,
  movies,
  isLoading,
  error,
  onCategoryChange,
  onSortChange,
  onOrderChange,
}) => {
  return (
    <section className="movie-list">
      <header className="movie-list__header">
        <h2 className="movie-list__title">Select</h2>

        <div className="movie-list__filters">
          <ul className="movie-list__filter-list">
            <li
              className={`movie-list__filter-item ${category === 'popular' ? 'active' : ''}`}
              onClick={() => onCategoryChange?.('popular')}
            >
              Popular
            </li>
            <li
              className={`movie-list__filter-item ${category === 'top_rated' ? 'active' : ''}`}
              onClick={() => onCategoryChange?.('top_rated')}
            >
              Top Rated
            </li>
            <li
              className={`movie-list__filter-item ${category === 'new' ? 'active' : ''}`}
              onClick={() => onCategoryChange?.('new')}
            >
              New Releases
            </li>
          </ul>

          <select
            className="movie-list__sorting"
            value={sort}
            onChange={(e) => onSortChange?.(e.target.value)}
          >
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="release_date">Release Date</option>
          </select>

          <select
            className="movie-list__sorting"
            value={order}
            onChange={(e) => onOrderChange?.(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

        </div>
      </header>

      <div className="movie_cards">
        {isLoading && <p className="movie-list__status">Loading…</p>}
        {error && !isLoading && <p className="movie-list__error">{error}</p>}
        {!error &&
          !isLoading &&
          movies?.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
            />
          ))}
      </div>
    </section>
  )
}

export default MovieList