import { useCallback, useContext, useEffect, useRef, useState, type JSX } from 'react';
import { useAPI } from '../../../provider/hooks/useAPI';
import { LoadingCard } from '../../LoadingCard/LoadingCard';
import { KickChannelsModalContext } from '../KickChannelsModal/KickChannelsModal';
import './KickSearchForm.scss';

export function KickSearchForm(): JSX.Element {
  const { kick } = useAPI();
  const { kickChannel, notificationConfig, setNotificationConfig, setSearchResults } = useContext(KickChannelsModalContext)!;
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
      kick.getSearch(query.toString()).then((results) => {
        setSearchResults(results);
        setNotificationConfig({
          broadcasterUserId:     results[0]?.broadcaster_user_id           || 0,
          notificationChannelId: notificationConfig?.notificationChannelId || '',
          notificationRoleId:    notificationConfig?.notificationRoleId    || null,
        });
        setIsSearching(false);
      });
    }
  }, [kick, notificationConfig, setNotificationConfig, setSearchResults]);

  useEffect(() => {
    if (kickChannel && !hasInitialized.current) {
      hasInitialized.current = true;
      kick.getSearch(kickChannel.name).then(setSearchResults);
    }

    return (): void => {
      setSearchResults([]);
    };

  }, [hasInitialized, kick, kickChannel, setSearchResults]);

  return <div className="kick-search-form-container">
    <form className="kick-search-form" onSubmit={onSearchHandler}>
      <input className="kick-search-form__query" name="query" defaultValue={kickChannel?.name || ''} />
      <button className="kick-search-form__button" type="submit">Find</button>
    </form>

    {isSearching ? <LoadingCard/> : <KickSearchResults />}
  </div>;
}

const KickSearchResults = function(): JSX.Element {
  const { notificationConfig, setNotificationConfig, searchResults, } = useContext(KickChannelsModalContext)!;

  return (
    <div className="kick-search-results">
      {searchResults.map((result) =>
        <div
          className={`kick-search-result-item${notificationConfig?.broadcasterUserId === result.broadcaster_user_id ? ' kick-search-result-item--selected' : ''}`}
          key={result.broadcaster_user_id}
          aria-selected={notificationConfig?.broadcasterUserId === result.broadcaster_user_id}
          onClick={() => {
            setNotificationConfig({
              broadcasterUserId:     result.broadcaster_user_id,
              notificationChannelId: notificationConfig?.notificationChannelId || '',
              notificationRoleId:    notificationConfig?.notificationRoleId    || null,
            });
          }}
        >
          <img className="kick-search-result-item__image" src={result.banner_picture}></img>
          <span className="kick-search-result-item__name">{result.slug}</span>
        </div>
      )}
    </div>
  );
};

