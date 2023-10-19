"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

function addToFavorites(storyId) {
  currentUser.favorites.push(storyId);
  console.log(currentUser.favorites);
}

function removeFromFavorites(storyId) {
  currentUser.favorites = currentUser.favorites.filter(id => id !== storyId);
  console.log(currentUser.favorites);
}

function checkFavorites(storyList, favorites) {
  favorites = currentUser.favorites;
  const favoritesList = [];
  for (let i = 0; i < storyList.length; i++) {
    const story = storyList[i];
    if (favorites.includes(story.storyId)) {
      favoritesList.push(story);
    }
  }
}

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();

  $allStoriesList.show();
  currentUser.addFavoritesEventListeners();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  currentUser.addFavoritesEventListeners();
}

function goToSubmit() {
  $submitForm.show();
}

$('#nav-submit').on("click", goToSubmit);

function goToOwnStories() {
  hidePageComponents();
  $userStoriesContainer[0].style.display = 'flex';
  // FIXME: above is called instead of the jQuery method 'show()' because 'show()' sets display to block, not sure how else to fix aside from this or creating new function
  $ownStoriesList.empty();
  const userLoggedStories = JSON.parse(localStorage.userLoggedStories);
  for (let storyData of userLoggedStories) {
    const story = new Story(storyData);
    $ownStoriesList.append(generateStoryMarkup(story));
  }
  currentUser.addFavoritesEventListeners();
}

$('#nav-user-stories').on("click", goToOwnStories);

function goToFavorites() {
  console.log('favorites')
  hidePageComponents();
  $favoritesContainer[0].style.display = 'flex';
  // FIXME: above is called instead of the jQuery method 'show()' because 'show()' sets display to block, not sure how else to fix aside from this or creating new function
  $favoritesList.empty();
  const storedFavorites = JSON.parse(localStorage.favorites);
  for (let storyData of storedFavorites) {
    const story = new Story(storyData);
    $favoritesList.append(generateStoryMarkup(story));
  }
  currentUser.addFavoritesEventListeners();
}

$('#nav-favorites').on("click", goToFavorites);

