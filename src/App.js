import React from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import "./App.css";

const { Component } = React;

class App extends Component {
  constructor() {
    super();
    this.state = {
      photos: [],
      favorites: {},
      totalPhotos: 0,
      perPage: 12,
      currentPage: 1,
      adress: "",
      hasMore: true,
      updated: false
    };
  }

  favoriteImage = (id, e) => {
    if (this.state.favorites[id] === undefined)
      this.state.favorites[id] = false;
    this.setState({
      favorites: { ...this.state.favorites, [id]: !this.state.favorites[id] }
    });
  };
  checkFavorite = id => {
    return this.state.favorites[id];
  };

  componentDidMount() {
    this.fetchPhotos(this.state.currentPage);
  }
  fetchPhotos(page) {
    var self = this;
    const { perPage } = this.state;
    const { appId } = this.props;
    const { currentPage } = this.state;
    const { adress } = this.state;
    var baseUrl;
    const options = {
      params: {
        client_id: appId,
        page: currentPage,
        per_page: perPage,
        query: adress
      }
    };
    if (this.state.updated === false) {
      baseUrl = "https://api.unsplash.com/photos";
      axios.get(baseUrl, options).then(response => {
        console.log(response);
        if (response) {
          if (options.params.page === 1) {
            var photos = [];
          } else {
            var photos = self.state.photos;
          }
          response.data.map(photo => {
            photos.push(photo);
          });
        }
        self.setState({
          photos: photos,
          totalPhotos: parseInt(response.headers["x-total"]),
          currentPage: options.params.page + 1
        });
      });
      if (this.state.photos.totalPhotos === this.state.photos.length) {
        self.setState({
          hasMore: false
        });
      }
    } else {
      baseUrl = "https://api.unsplash.com/search/photos";
      axios.get(baseUrl, options).then(response => {
        console.log(response);
        if (response) {
          if (options.params.page === 1) {
            var photos = [];
          } else {
            var photos = self.state.photos;
          }
          response.data.results.map(photo => {
            photos.push(photo);
          });
        }
        self.setState({
          photos: photos,
          totalPhotos: parseInt(response.headers["x-total"]),
          currentPage: options.params.page + 1
        });
      });
      if (this.state.photos.totalPhotos === this.state.photos.length) {
        self.setState({
          hasMore: false
        });
      }
    }
  }
  handleSearch = event => {
    event.preventDefault();
    this.state.adress = document.getElementById("search_text").value;
    if (this.state.adress) this.state.updated = true;
    else this.state.updated = false;
    this.state.currentPage = 1;
    this.fetchPhotos(1);
    console.log("Button Clicked!");
  };
  render() {
    return (
      <div className="app">
        <div className="search">
          <form className="search_field">
            <input type="text" id="search_text" placeholder="Search" />
            <button
              type="submit"
              id="search_button"
              onClick={this.handleSearch}
            >
              <i className="fa fa-search search_icon" />
            </button>
          </form>
        </div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.fetchPhotos.bind(this)}
          hasMore={this.state.hasMore}
        >
          <List
            data={this.state.photos}
            favoriteImage={this.favoriteImage}
            checkFavorite={this.checkFavorite}
          />
        </InfiniteScroll>
      </div>
    );
  }
}
class ListItem extends Component {
  render() {
    return (
      <div key={this.props.photo.id} className="grid__item card">
        <div className="card__body">
          <img src={this.props.photo.urls.small} alt="" />
        </div>
        <div className="card__footer media">
          <img
            src={this.props.photo.user.profile_image.small}
            alt=""
            className="media__obj"
          />
          <div className="media__body">
            <a href={this.props.photo.user.portfolio_url}>
              {this.props.photo.user.name}
            </a>
            <span
              className={
                this.props.checkFavorite(this.props.photo.id)
                  ? "fa fa-heart favorite"
                  : "fa fa-heart-o favorite"
              }
              onClick={e => this.props.favoriteImage(this.props.photo.id, e)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const List = ({ data, favoriteImage, checkFavorite }) => {
  var items = data.map(photo => (
    <ListItem
      key={photo.id}
      photo={photo}
      favoriteImage={favoriteImage}
      checkFavorite={checkFavorite}
    />
  ));
  return <div className="grid">{items}</div>;
};

export default App;
