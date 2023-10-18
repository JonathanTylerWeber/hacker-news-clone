"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $('.submit-form').hide();
  $('#favorites-container').hide();
  putStoriesOnPage();
  const userStoriesContainer = document.getElementById('user-stories-container');
  userStoriesContainer.style.display = 'none';
  $('#all-stories-container').show();
  currentUser.toggleFavorite();
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
}

function goToSubmit() {
  $('.submit-form').show();
}

$('#nav-submit').on("click", goToSubmit);

function goToOwnStories() {
  $('.submit-form').hide();
  const userStoriesContainer = document.getElementById('user-stories-container');
  userStoriesContainer.style.display = 'flex';
  $('#all-stories-container').hide();
  $('#favorites-container').hide();
  let ownStoriesList = $('#own-stories-list');
  ownStoriesList.empty();
  currentUser.getOwnStoriesFromLocalStorage();
  for (let story of currentUser.ownStories) {
    let li = document.createElement('li');
    story.storyId = 69;
    li.appendChild(generateStoryMarkup(story)[0]);
    ownStoriesList.append(li);
  }
  currentUser.toggleFavorite();
}

$('#nav-user-stories').on("click", goToOwnStories);

function goToFavorites() {
  $('.submit-form').hide();
  const userStoriesContainer = document.getElementById('user-stories-container');
  userStoriesContainer.style.display = 'none';
  $('#favorites-container').show();
  $('#all-stories-container').hide();
  let favoritesList = $('#favorites-list');
  favoritesList.empty();
  currentUser.getFavoritesFromLocalStorage();
  currentUser.toggleFavorite();
}

$('#nav-favorites').on('click', function () {
  goToFavorites();
  currentUser.putFavoritesOnPage();
});