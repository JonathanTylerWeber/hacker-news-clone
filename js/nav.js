"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $('.submit-form').hide();
  putStoriesOnPage();
  await currentUser.toggleFavorites();
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

async function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  await currentUser.toggleFavorites();
}

function goToSubmit() {
  $('.submit-form').show();
}

$('#nav-submit').on("click", goToSubmit);

async function goToFavorites() {
  hidePageComponents();
  $favoritesList.empty();
  $favoritesList.show();
  const favorites = await currentUser.getFavorites();
  for (let favorite of favorites) {
    const { storyId, title, author, url, username, createdAt } = favorite;
    const favoriteStory = new Story({ storyId, title, author, url, username, createdAt });
    const $story = (generateStoryMarkup(favoriteStory));
    $favoritesList.append($story);
  };
  await currentUser.toggleFavorites();
}

$('#nav-favorites').on('click', goToFavorites);
