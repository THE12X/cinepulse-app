export const TMDB_API_KEY = 'f96971678159b1d7b4f33621e335babf';

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

export const GENRES = [
  { id: 'all', name: 'All Genres' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

export const COUNTRIES = [
  { code: 'all', name: 'All Countries' },
  { code: 'US', name: 'United States 🇺🇸' },
  { code: 'CN', name: 'China 🇨🇳' },
  { code: 'KR', name: 'South Korea 🇰🇷' },
  { code: 'JP', name: 'Japan 🇯🇵' },
  { code: 'GB', name: 'United Kingdom 🇬🇧' },
  { code: 'FR', name: 'France 🇫🇷' },
  { code: 'ES', name: 'Spain 🇪🇸' }
];

export async function fetchDiscoverData({ mediaType = 'movie', genreId = 'all', countryCode = 'all', page = 1, searchQuery = '' }) {
  if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
    throw new Error('Please add your TMDB API key in src/services/tmdb.js');
  }

  let url = `${BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&include_adult=false`;

  if (searchQuery.trim()) {
    url = `${BASE_URL}/search/${mediaType}?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=${page}`;
  } else {
    if (genreId !== 'all') url += `&with_genres=${genreId}`;
    if (countryCode !== 'all') url += `&with_origin_country=${countryCode}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch media data');
  return res.json();
}

export async function fetchTrailerKey(mediaType, id) {
  try {
    const res = await fetch(`${BASE_URL}/${mediaType}/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
    const data = await res.json();
    const trailer = data.results?.find(v => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube');
    return trailer ? trailer.key : null;
  } catch (err) {
    return null;
  }
}