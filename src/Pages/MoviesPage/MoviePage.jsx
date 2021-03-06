import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import * as moviesAPI from '../../Services/moveis-api';
import qs from 'query-string';

const MoviesPage = () => {
  const { pathname, search } = useLocation();
  const history = useNavigate();
  const [query, setQuery] = useState(qs.parse(search)?.query || '');
  const [resultSearch, setResultSearch] = useState([]);

  useEffect(() => {
    if (!search) {
      return;
    }

    moviesAPI
      .fetchMoviesByQuery(query)
      .then(movies => setResultSearch(movies.results));

    setQuery('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleChange = event => {
    setQuery(event.currentTarget.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (query.trim() === '') {
      return;
    }

    history({
      pathname,
      search: `query=${query}`,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter movie title"
          autoComplete="off"
          value={query}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>

      {resultSearch && resultSearch.length > 0 && (
        <ul>
          {resultSearch.map(movie => (
            <li key={movie.id}>
              <Link
                to={{
                  pathname: `/movies/${movie.id}`,
                  state: {
                    backUrl: pathname,
                    query: qs.parse(search)?.query,
                  },
                }}
              >
                {movie.title || movie.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default MoviesPage;