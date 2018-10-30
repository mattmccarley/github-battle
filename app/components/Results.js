const React = require('react');
const PropTypes = require('prop-types');
const Link = require('react-router-dom').Link
const queryString = require('query-string');
const api = require('../utils/api');
const PlayerPreview = require('./PlayerPreview');
const Loading = require('./Loading');

function Profile({ info }) {
  const {
    avatar_url,
    login,
    name,
    location,
    company,
    followers,
    following,
    public_repos,
    blog
  } = info;

  return (
    <PlayerPreview
      avatar={avatar_url}
      username={login}
    >
      <ul className='space-list-items'>
        {name && <li>{name}</li>}
        {location && <li>{location}</li>}
        {company && <li>{company}</li>}
        <li>Followers: {followers}</li>
        <li>Following: {following}</li>
        <li>Public Repos: {public_repos}</li>
        {blog && <li><a href={blog}>{blog}</a></li>}
      </ul>
    </PlayerPreview>
  )
}

Profile.propTypes = {
  info: PropTypes.object.isRequired
}

function Player ({ label, score, profile }) {
  return (
    <div>
      <h1 className='header'>{label}</h1>
      <h3 style={{textAlign: 'center'}}>Score: {score}</h3>
      <Profile 
        info={profile}
      />
    </div>
  )
}

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
}

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true
    }
  }

  componentDidMount() {
    const { location } = this.props;

    const { playerOneName, playerTwoName } = queryString.parse(location.search);
    api.battle([
      playerOneName,
      playerTwoName
    ]).then((players) => {
      if (players === null) {
        this.setState(() => ({
          error: 'Looks like there was an error. Check that both users exist on Github',
          loading: false,
        }));
      }

      this.setState(() => ({
        error: null,
        winner: players[0],
        loser: players[1],
        loading: false
      }));
    });
    
  }

  render() {
    const { error, winner, loser, loading } = this.state;

    if (loading === true) {
      return <Loading />
    }

    if (error) {
      return (
        <div>
          <p>{error}</p>
          <Link to='/battle'>Reset</Link>
        </div>
      )
    }

    return (
      <div className='row'>
        <Player 
          label='Winner'
          score={winner.score}
          profile={winner.profile}
        />
        <Player 
          label='Loser'
          score={loser.score}
          profile={loser.profile}
        />
      </div>
    )
  }
}

module.exports = Results;