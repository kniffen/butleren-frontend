import { useCallback, useContext, useEffect, useRef, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { SpotifyShowsModalContext } from '../SpotifyShowsModal/SpotifyShowsModal';
import './SpotifySearchForm.scss';
import { SpotifySearchResultItem } from '../../../types';

export function SpotifySearchForm(): JSX.Element {
  const { spotify } = useAPI();
  const { spotifyShow, notificationConfig, setNotificationConfig, setSearchResults } = useContext(SpotifyShowsModalContext)!;
  const hasInitialized = useRef(false);
  const [isSearching, setIsSearching] = useState(false);


  const onSearchHandler = useCallback((e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const form = e.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);
    const query = formData.get('query');

    if (query) {
      setIsSearching(true);

      spotify.getSearch(query.toString()).then((results) => {
        const curatedResults = curateSearchResults(query.toString(), results);

        setSearchResults(curatedResults);
        setNotificationConfig({
          showId:                curatedResults[0].showId,
          notificationChannelId: notificationConfig?.notificationChannelId || '',
          notificationRoleId:    notificationConfig?.notificationRoleId,
        });
        setIsSearching(false);
      });
    }
  }, [spotify, notificationConfig, setNotificationConfig, setSearchResults]);

  useEffect(() => {
    if (spotifyShow && !hasInitialized.current) {
      hasInitialized.current = true;
      spotify.getSearch(spotifyShow.name)
        .then((results) => curateSearchResults(spotifyShow.name, results))
        .then(setSearchResults);
    }

    return (): void => {
      setSearchResults([]);
    };

  }, [hasInitialized, spotify, spotifyShow, setSearchResults]);

  return <div className="spotify-search-form-container">
    <form className="spotify-search-form" onSubmit={onSearchHandler}>
      <input className="spotify-search-form__query" name="query" defaultValue={spotifyShow?.name || ''} />
      <button className="spotify-search-form__button" type="submit">Find</button>
    </form>

    {isSearching ? <LoadingCard /> : <SpotifySearchResults />}
  </div>;
}

const SpotifySearchResults = function(): JSX.Element {
  const { notificationConfig, setNotificationConfig, searchResults, } = useContext(SpotifyShowsModalContext)!;

  return (
    <div className="spotify-search-results">
      {searchResults.map((result) =>
        <div
          className={`spotify-search-result-item${notificationConfig?.showId === result.showId ? ' spotify-search-result-item--selected' : ''}`}
          key={result.showId}
          aria-selected={notificationConfig?.showId === result.showId}
          onClick={() => {
            setNotificationConfig({
              showId:                result.showId,
              notificationChannelId: notificationConfig?.notificationChannelId || '',
              notificationRoleId:    notificationConfig?.notificationRoleId,
            });
          }}
        >
          <img className="spotify-search-result-item__image" src={result.imageURL}></img>
          <span className="spotify-search-result-item__name">{result.name}</span>
        </div>
      )}
    </div>
  );
};

const curateSearchResults = (query: string, results: SpotifySearchResultItem[]): SpotifySearchResultItem[] => {
  const exactHit = results.find((r) => r.name.toLowerCase() === query.toString().toLowerCase());
  const rest = results.filter((r) => r.showId !== exactHit?.showId);
  const curatedResults = exactHit ? [exactHit, ...rest] : rest;

  return curatedResults;
};
