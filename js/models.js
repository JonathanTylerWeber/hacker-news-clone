"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    const url = new URL(this.url);
    return url.hostname;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, newStory) {
    const requestBody = {
      token: user.loginToken,
      story: {
        author: newStory.author,
        title: newStory.title,
        url: newStory.url
      }
    };
    const response = await axios.post(`${BASE_URL}/stories`, requestBody);
    const { storyId, title, author, url, username, createdAt } = response.data.story;
    const addedStory = new Story({ storyId, title, author, url, username, createdAt });
    this.stories.unshift(addedStory);
    return addedStory;
  }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
    username,
    name,
    createdAt,
    favorites = [],
    ownStories = []
  },
    token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  async toggleFavorites() {
    const savedFavorites = await this.getFavorites();
    const stars = document.querySelectorAll('.fa-star');
    stars.forEach(star => {
      const storyId = star.parentNode.id;
      const isFavorited = savedFavorites.some(favorite => favorite.storyId === storyId);
      if (isFavorited) {
        star.classList.remove('fa-regular');
        star.classList.add('fa-solid');
      } else {
        star.classList.remove('fa-solid');
        star.classList.add('fa-regular');
      }
      star.addEventListener('click', async function () {
        console.log('you clicked a star');
        console.log(this.parentNode);
        if (this.classList.contains('fa-regular')) {
          this.classList.remove('fa-regular');
          this.classList.add('fa-solid');
          await currentUser.addFavoriteToApi(star);
          // console.log('add to favs');
        }
        else {
          this.classList.remove('fa-solid');
          this.classList.add('fa-regular');
          await currentUser.removeFavoriteFromApi(star);
          // console.log('remove from favs');
        }
      });
    });
  };

  async getFavorites() {
    const username = currentUser.username;
    const token = currentUser.loginToken;
    const response = await axios.get(`${BASE_URL}/users/${username}?token=${token}`);
    const favorites = response.data.user.favorites
    console.log(favorites);
    return favorites;
  }

  async addFavoriteToApi(star) {
    const username = currentUser.username;
    const storyId = star.parentNode.id;
    const requestBody = {
      token: currentUser.loginToken,
    };
    const response = await axios.post(`${BASE_URL}/users/${username}/favorites/${storyId}`, requestBody);
    console.log(response);
  }

  async removeFavoriteFromApi(star) {
    const username = currentUser.username;
    const storyId = star.parentNode.id;
    const requestBody = {
      token: currentUser.loginToken,
    };
    const response = await axios.delete(`${BASE_URL}/users/${username}/favorites/${storyId}`, {
      data: requestBody
    });
    console.log(response);
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}
