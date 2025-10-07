import { useCallback, useContext, useEffect, useRef, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { TwitchChannelsModalContext } from '../TwitchChannelsModal/TwitchChannelsModal';
import './TwitchSearchForm.scss';
import { TwitchSearchResultItem } from '../../../types';

export function TwitchSearchForm(): JSX.Element {
  const { twitch } = useAPI();
  const { twitchChannel, notificationConfig, setNotificationConfig, setSearchResults } = useContext(TwitchChannelsModalContext)!;
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

      twitch.getSearch(query.toString()).then((results) => {
        const curatedResults = curateSearchResults(query.toString(), results);

        setSearchResults(curatedResults);
        setNotificationConfig({
          id:                    curatedResults[0].id,
          notificationChannelId: notificationConfig?.notificationChannelId || '',
          notificationRoleId:    notificationConfig?.notificationRoleId,
        });
        setIsSearching(false);
      });
    }
  }, [twitch, notificationConfig, setNotificationConfig, setSearchResults]);

  useEffect(() => {
    if (twitchChannel && !hasInitialized.current) {
      hasInitialized.current = true;
      twitch.getSearch(twitchChannel.name)
        .then((results) => curateSearchResults(twitchChannel.name, results))
        .then(setSearchResults);
    }

    return (): void => {
      setSearchResults([]);
    };

  }, [hasInitialized, twitch, twitchChannel, setSearchResults]);

  return <div className="twitch-search-form-container">
    <form className="twitch-search-form" onSubmit={onSearchHandler}>
      <input className="twitch-search-form__query" name="query" defaultValue={twitchChannel?.name || ''} />
      <button className="twitch-search-form__button" type="submit">Find</button>
    </form>

    {isSearching ? <LoadingCard /> : <TwitchSearchResults />}
  </div>;
}

const TwitchSearchResults = function(): JSX.Element {
  const { notificationConfig, setNotificationConfig, searchResults, } = useContext(TwitchChannelsModalContext)!;

  return (
    <div className="twitch-search-results">
      {searchResults.slice(0, 5).map((result) =>
        <div
          className={`twitch-search-result-item${notificationConfig?.id === result.id ? ' twitch-search-result-item--selected' : ''}`}
          key={result.id}
          aria-selected={notificationConfig?.id === result.id}
          onClick={() => {
            setNotificationConfig({
              id:                    result.id,
              notificationChannelId: notificationConfig?.notificationChannelId || '',
              notificationRoleId:    notificationConfig?.notificationRoleId,
            });
          }}
        >
          <img className="twitch-search-result-item__image" src={result.thumbnail_url}></img>
          <span className="twitch-search-result-item__name">{result.display_name}</span>
        </div>
      )}
    </div>
  );
};

const curateSearchResults = (query: string, results: TwitchSearchResultItem[]): TwitchSearchResultItem[] => {
  const exactHit = results.find((r) => r.display_name.toLowerCase() === query.toString().toLowerCase());
  const rest = results.filter((r) => r.id !== exactHit?.id);
  const curatedResults = exactHit ? [exactHit, ...rest] : rest;

  return curatedResults;
};
