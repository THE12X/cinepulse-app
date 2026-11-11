import React, { useState, useEffect } from 'react';
import { Search, Film, Tv, Globe, Bookmark, Star, Play, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { GENRES, COUNTRIES, IMAGE_BASE, BACKDROP_BASE, fetchDiscoverData, fetchTrailerKey } from './services/tmdb';

export default function App() {
  const [mediaType, setMediaType] = useState('movie');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('explore');
  const [watchlist, setWatchlist] = useState(() => {
    return JSON.parse(localStorage.getItem('cinepulse_watchlist') || '[]');
  });

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    localStorage.setItem('cinepulse_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    let isSubscribed = true;
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDiscoverData({
          mediaType,
          genreId: selectedGenre,
          countryCode: selectedCountry,
          page,
          searchQuery
        });
        if (isSubscribed) {
          setItems(data.results || []);
          setTotalPages(Math.min(data.total_pages || 1, 500));
        }
      } catch (err) {
        if (isSubscribed) setError(err.message);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    const timer = setTimeout(loadData, searchQuery ? 500 : 0);
    return () => {
      isSubscribed = false;
      clearTimeout(timer);
    };
  }, [mediaType, selectedGenre, selectedCountry, page, searchQuery]);

  const handleSelectMedia = async (item) => {
    setSelectedMedia(item);
    setTrailerKey(null);
    const key = await fetchTrailerKey(mediaType, item.id);
    setTrailerKey(key);
  };

  const toggleWatchlist = (e, item) => {
    e.stopPropagation();
    const exists = watchlist.some((w) => w.id === item.id);
    if (exists) {
      setWatchlist(watchlist.filter((w) => w.id !== item.id));
    } else {
      setWatchlist([...watchlist, { ...item, media_type: mediaType }]);
    }
  };

  const heroItem = items[0];

  return (
    <div style={{ backgroundColor: '#060b17', color: '#ffffff', minHeight: '100vh', width: '100vw', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>
      {/* Global Fonts & Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
        }

        html, body, #root {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          background-color: #060b17;
          font-family: 'Poppins', sans-serif !important;
        }
        
        .genre-scroll::-webkit-scrollbar { display: none; }
        .genre-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* Desktop Header Layout */
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 3rem;
          background-color: #0e182e;
          border-bottom: 2px solid #1a294d;
          width: 100%;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 2.25rem;
        }

        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.75rem;
          background-color: #0e182e;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid #1a294d;
          width: 100%;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 1.5rem;
          width: 100%;
        }

        .hero-banner {
          height: 420px;
          width: 100%;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 2rem;
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: flex-end;
          border: 1px solid #1a294d;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0.5rem 0;
          color: #ffffff;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .header-container { padding: 1rem 1.5rem; }
          .header-left { gap: 1.5rem; }
          .media-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.25rem; }
          .hero-banner { height: 340px; }
          .hero-title { font-size: 2rem; }
        }

        @media (max-width: 768px) {
          .header-container { flex-direction: column; align-items: stretch; gap: 0.85rem; padding: 1rem; }
          .header-left { width: 100%; justify-content: space-between; gap: 0.5rem; }
          .search-wrapper { width: 100% !important; }
          .filter-bar { flex-direction: column; align-items: stretch; gap: 0.85rem; padding: 0.85rem; }
          .media-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.85rem; }
          .hero-banner { height: 280px; }
          .hero-title { font-size: 1.4rem; }
          .main-content { padding: 1rem !important; }
        }
      `}</style>

      {/* Header Bar */}
      <header className="header-container">
        <div className="header-left">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#D7FF00', padding: '0.45rem', borderRadius: '0.5rem', display: 'flex' }}>
              <Film size={24} color="#060b17" />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff', margin: 0 }}>
              Cine<span style={{ color: '#D7FF00' }}>Pulse</span>
            </h1>
          </div>

          {/* Navigation Buttons directly next to logo on desktop */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setActiveTab('explore')}
              style={{ padding: '0.55rem 1.1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'explore' ? '#0047AB' : 'transparent', color: activeTab === 'explore' ? '#ffffff' : '#94a3b8', fontWeight: 700, fontSize: '0.9rem' }}
            >
              Explore
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              style={{ padding: '0.55rem 1.1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'watchlist' ? '#0047AB' : 'transparent', color: activeTab === 'watchlist' ? '#ffffff' : '#94a3b8', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Bookmark size={16} color={activeTab === 'watchlist' ? '#D7FF00' : 'currentColor'} /> Watchlist ({watchlist.length})
            </button>
          </div>
        </div>

        {/* Search Wrapper */}
        <div className="search-wrapper" style={{ position: 'relative', width: '380px' }}>
          <Search size={18} color="#D7FF00" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search thousands of titles..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.6rem', backgroundColor: '#060b17', color: '#ffffff', border: '1px solid #1a294d', borderRadius: '0.5rem', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'explore' ? (
        <main className="main-content" style={{ padding: '2rem 3rem', width: '100%' }}>
          {/* Spotlight Hero Banner */}
          {heroItem && !searchQuery && (
            <div
              className="hero-banner"
              onClick={() => handleSelectMedia(heroItem)}
              style={{
                backgroundImage: heroItem.backdrop_path ? `url(${BACKDROP_BASE}${heroItem.backdrop_path})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #060b17 20%, rgba(6, 11, 23, 0.3) 100%)' }} />
              <div style={{ position: 'relative', padding: '2rem', zIndex: 10, maxWidth: '850px' }}>
                <span style={{ backgroundColor: '#D7FF00', color: '#060b17', padding: '0.3rem 0.7rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                  FEATURED SPOTLIGHT
                </span>
                <h2 className="hero-title">{heroItem.title || heroItem.name}</h2>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                  {heroItem.overview}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button style={{ backgroundColor: '#D7FF00', border: 'none', color: '#060b17', padding: '0.65rem 1.4rem', borderRadius: '0.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <Play size={18} fill="#060b17" /> Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="filter-bar">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#060b17', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #1a294d' }}>
                <button
                  onClick={() => { setMediaType('movie'); setPage(1); }}
                  style={{ padding: '0.45rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', backgroundColor: mediaType === 'movie' ? '#0047AB' : 'transparent', color: mediaType === 'movie' ? '#D7FF00' : '#94a3b8', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Film size={16} /> Movies
                </button>
                <button
                  onClick={() => { setMediaType('tv'); setPage(1); }}
                  style={{ padding: '0.45rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', backgroundColor: mediaType === 'tv' ? '#0047AB' : 'transparent', color: mediaType === 'tv' ? '#D7FF00' : '#94a3b8', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Tv size={16} /> TV Shows
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={18} color="#D7FF00" />
                <select
                  value={selectedCountry}
                  onChange={(e) => { setSelectedCountry(e.target.value); setPage(1); }}
                  style={{ backgroundColor: '#060b17', color: '#ffffff', border: '1px solid #1a294d', padding: '0.45rem 0.85rem', borderRadius: '0.5rem', outline: 'none', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="genre-scroll" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem', maxWidth: '100%' }}>
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setSelectedGenre(g.id); setPage(1); }}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '1rem',
                    border: selectedGenre === g.id ? '1px solid #D7FF00' : '1px solid #1a294d',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    backgroundColor: selectedGenre === g.id ? '#0047AB' : '#060b17',
                    color: selectedGenre === g.id ? '#D7FF00' : '#94a3b8'
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: '#1e1b4b', color: '#f87171', border: '1px solid #ef4444', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={20} color="#D7FF00" />
              <div>
                <strong>TMDB API Notice:</strong> {error}. Make sure your key is set in <code>src/services/tmdb.js</code>!
              </div>
            </div>
          )}

          {/* Media Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem', color: '#D7FF00', fontWeight: 'bold' }}>Loading media content...</div>
          ) : (
            <div className="media-grid">
              {items.map((item) => {
                const isWatchlisted = watchlist.some((w) => w.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectMedia(item)}
                    style={{
                      backgroundColor: '#0e182e',
                      borderRadius: '0.75rem',
                      overflow: 'hidden',
                      border: '1px solid #1a294d',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', paddingTop: '148%', backgroundColor: '#060b17' }}>
                      {item.poster_path ? (
                        <img
                          src={`${IMAGE_BASE}${item.poster_path}`}
                          alt={item.title || item.name}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                          No Poster
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(6, 11, 23, 0.9)', border: '1px solid #1a294d', padding: '0.2rem 0.45rem', borderRadius: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '800', color: '#D7FF00' }}>
                        <Star size={12} color="#D7FF00" fill="#D7FF00" />
                        {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                      </div>
                      <button
                        onClick={(e) => toggleWatchlist(e, item)}
                        style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: isWatchlisted ? '#D7FF00' : 'rgba(6, 11, 23, 0.85)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Bookmark size={16} color={isWatchlisted ? '#060b17' : '#ffffff'} fill={isWatchlisted ? '#060b17' : 'none'} />
                      </button>
                    </div>

                    <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: '0 0 0.35rem 0', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title || item.name}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                        {item.release_date || item.first_air_date ? (item.release_date || item.first_air_date).split('-')[0] : 'N/A'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem', width: '100%' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ padding: '0.55rem 1.2rem', borderRadius: '0.5rem', border: '1px solid #1a294d', backgroundColor: '#0e182e', color: '#ffffff', cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page <= 1 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
            >
              <ChevronLeft size={16} color="#D7FF00" /> Previous
            </button>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{ padding: '0.55rem 1.2rem', borderRadius: '0.5rem', border: '1px solid #1a294d', backgroundColor: '#0e182e', color: '#ffffff', cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page >= totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
            >
              Next <ChevronRight size={16} color="#D7FF00" />
            </button>
          </div>
        </main>
      ) : (
        /* Watchlist Tab */
        <main className="main-content" style={{ padding: '2rem 3rem', width: '100%' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', color: '#ffffff' }}>My Watchlist ({watchlist.length})</h2>
          {watchlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8', backgroundColor: '#0e182e', borderRadius: '0.75rem', border: '1px dashed #1a294d' }}>
              Your watchlist is empty. Tap the bookmark button on any movie or TV show to save it here!
            </div>
          ) : (
            <div className="media-grid">
              {watchlist.map((item) => (
                <div key={item.id} onClick={() => handleSelectMedia(item)} style={{ backgroundColor: '#0e182e', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #1a294d', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'relative', paddingTop: '148%' }}>
                    <img src={`${IMAGE_BASE}${item.poster_path}`} alt={item.title || item.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={(e) => toggleWatchlist(e, item)} style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#060b17', border: '1px solid #1a294d', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <X size={16} color="#D7FF00" />
                    </button>
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || item.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Modal & Trailer */}
      {selectedMedia && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 11, 23, 0.9)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#0e182e', width: '100%', maxWidth: '850px', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #1a294d', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setSelectedMedia(null)} style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#060b17', color: '#D7FF00', border: '1px solid #1a294d', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <X size={20} />
            </button>

            {trailerKey ? (
              <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                  title="Official Trailer"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : selectedMedia.backdrop_path ? (
              <img src={`${BACKDROP_BASE}${selectedMedia.backdrop_path}`} alt="backdrop" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
            ) : null}

            <div style={{ padding: '1.5rem 1.75rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#ffffff' }}>{selectedMedia.title || selectedMedia.name}</h2>
              <div style={{ display: 'flex', gap: '1rem', color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1rem', fontWeight: 600 }}>
                <span style={{ color: '#D7FF00' }}>⭐ {selectedMedia.vote_average?.toFixed(1)} / 10</span>
                <span>Release: {selectedMedia.release_date || selectedMedia.first_air_date}</span>
              </div>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>{selectedMedia.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}