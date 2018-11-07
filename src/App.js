import React, { Component } from 'react';
import SpotifyLogin from 'react-spotify-login';
import { clientId, redirectUri } from './settings';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem('token');
    this.state = {
      accessToken: token ? token : '',
      albums: []
    };
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onLoginError = this.onLoginError.bind(this);
    this.logout = this.logout.bind(this);
    this.getAlbums = this.getAlbums.bind(this);
  }

  onLoginSuccess(info) {
    // Ici l'authentification a réussi, on récupère et stocke le access token
    this.setState({
      accessToken: info.access_token
    });
    localStorage.setItem('token', info.access_token);
  }

  onLoginError(err) {
    console.error(err);
  }

  logout() {
    this.setState({ accessToken: '' });
    localStorage.removeItem('token');
  }

  getAlbums() {
    fetch(`https://api.spotify.com/v1/search?q=John%20Mayer&type=album`, {
      headers: {
        Authorization: `Bearer ${this.state.accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          albums: data.albums.items
        });
      })
  }

  render() {
    const { accessToken, albums } = this.state;
    return (
      <div className="App">
        {accessToken && <div>Vous êtes authentifié <button onClick={this.logout}>logout</button></div>}
        <SpotifyLogin clientId={clientId}
          redirectUri={redirectUri}
          onSuccess={this.onLoginSuccess}
          onFailure={this.onLoginError}/>

        {accessToken && <button onClick={this.getAlbums}>Get albums</button>}
        {albums.length > 0 && albums.map(album => <li>{album.name}</li>)}
      </div>
    );
  }
}

export default App;
