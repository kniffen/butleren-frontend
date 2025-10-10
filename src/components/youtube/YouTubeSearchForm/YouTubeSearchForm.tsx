import { useCallback, useContext, useEffect, useRef, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { YouTubeChannelsModalContext } from '../YouTubeChannelsModal/YouTubeChannelsModal';
import './YouTubeSearchForm.scss';
import { YouTubeSearchResultItem } from '../../../types';

export function YouTubeSearchForm(): JSX.Element {
  const { youtube } = useAPI();
  const { youtubeChannel, notificationConfig, setNotificationConfig, setSearchResults } = useContext(YouTubeChannelsModalContext)!;
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

      youtube.getSearch(query.toString()).then((results) => {
        const curatedResults = curateSearchResults(query.toString(), results);

        setSearchResults(curatedResults);
        setNotificationConfig({
          channelId:             curatedResults[0].channelId,
          includeLiveStreams:    false,
          notificationChannelId: notificationConfig?.notificationChannelId || '',
          notificationRoleId:    notificationConfig?.notificationRoleId || null,
        });
        setIsSearching(false);
      });
    }
  }, [youtube, notificationConfig, setNotificationConfig, setSearchResults]);

  useEffect(() => {
    if (youtubeChannel && !hasInitialized.current) {
      hasInitialized.current = true;
      youtube.getSearch(youtubeChannel.name)
        .then((results) => curateSearchResults(youtubeChannel.name, results))
        .then(setSearchResults);
    }

    return (): void => {
      setSearchResults([]);
    };

  }, [hasInitialized, youtube, youtubeChannel, setSearchResults]);

  return <div className="youtube-search-form-container">
    <form className="youtube-search-form" onSubmit={onSearchHandler}>
      <input className="youtube-search-form__query" name="query" defaultValue={youtubeChannel?.name || ''} />
      <button className="youtube-search-form__button" type="submit">Find</button>
    </form>

    {isSearching ? <LoadingCard /> : <YouTubeSearchResults />}
  </div>;
}

const YouTubeSearchResults = function(): JSX.Element {
  const { notificationConfig, setNotificationConfig, searchResults, } = useContext(YouTubeChannelsModalContext)!;

  return (
    <div className="youtube-search-results">
      {searchResults.slice(0, 5).map((result) =>
        <div
          className={`youtube-search-result-item${notificationConfig?.channelId === result.channelId ? ' youtube-search-result-item--selected' : ''}`}
          key={result.channelId}
          aria-selected={notificationConfig?.channelId === result.channelId}
          onClick={() => {
            setNotificationConfig({
              channelId:             result.channelId,
              includeLiveStreams:    false,
              notificationChannelId: notificationConfig?.notificationChannelId || '',
              notificationRoleId:    notificationConfig?.notificationRoleId    || null,
            });
          }}
        >
          <img className="youtube-search-result-item__image" src={result.imageURL}></img>
          <span className="youtube-search-result-item__name">{result.name}</span>
        </div>
      )}
    </div>
  );
};

const curateSearchResults = (query: string, results: YouTubeSearchResultItem[]): YouTubeSearchResultItem[] => {
  const exactHit = results.find((r) => r.name.toLowerCase() === query.toString().toLowerCase());
  const rest = results.filter((r) => r.channelId !== exactHit?.channelId);
  const curatedResults = exactHit ? [exactHit, ...rest] : rest;

  return curatedResults;
};
