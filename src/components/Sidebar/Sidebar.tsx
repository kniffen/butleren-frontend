import { JSX } from 'react';
import logo from '../../assets/images/logo.png';
import { useAPI } from '../../provider/hooks/useAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './Sidebar.scss';

export const Sidebar = function(): JSX.Element {
  const params = useParams();
  const { guild: currentGuild, guilds } = useAPI();
  const navigate = useNavigate();

  return (<nav className="sidebar">
    <div className="brand">
      <img className="brand__img" src={logo} alt="Logo"  />
      <span className="brand__text">Butleren</span>
    </div>

    <div className="guilds">
      {guilds.map(guild => (
        <div className={`guild${params.id === guild.id ? ' guild--active' : ''}`} key={guild.id} onClick={() => {
          currentGuild.set(guild.id);
          navigate(`/guild/${guild.id}`);
        }}>
          <img className="guild__img" src={guild.iconURL || logo} alt="Guild logo" />
          <span className="guild__name">{guild.name}</span>
        </div>
      ))}
    </div>

    <div className="links">
      <Link to="/logs">Logs</Link>
    </div>
  </nav>);
};