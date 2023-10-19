"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();

  $allStoriesList.show();
  currentUser.toggleFavorites();
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
  currentUser.toggleFavorites();
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
    console.log(storyData);
    const story = new Story(storyData);
    console.log(story);
    $ownStoriesList.append(generateStoryMarkup(story));
  }
  currentUser.toggleFavorites();
}

$('#nav-user-stories').on("click", goToOwnStories);

// function goToFavorites() {
//   console.log('favorites');
//   hidePageComponents();
//   $favoritesContainer[0].style.display = 'flex';
//   // FIXME: above is called instead of the jQuery method 'show()' because 'show()' sets display to block, not sure how else to fix aside from this or creating new function
//   $favoritesList.empty();
//   const favorites = JSON.parse(localStorage.getItem('favorites'));
//   currentUser.favorites = favorites;
//   const allStoriesList = document.querySelector('#all-stories-list');
//   const listItems = allStoriesList.querySelectorAll('li');
//   listItems.forEach((listItem) => {
//     const storyId = listItem.id;
//     if (favorites.includes(storyId)) {
//       $favoritesList.append(listItem);
//     }
//   });
//   currentUser.toggleFavorites();
// }

function goToFavorites() {
  console.log('favorites');
  hidePageComponents();
  $favoritesContainer[0].style.display = 'flex';
  $favoritesList.empty();
  const favorites = JSON.parse(localStorage.getItem('favorites'));
  for (let storyId of favorites) {
    const story = storyList.stories.find(story => story.storyId === storyId);
    if (story) {
      $favoritesList.append(generateStoryMarkup(story));
    }
  }
  currentUser.toggleFavorites();
}

$('#nav-favorites').on("click", goToFavorites);

function addToFavorites(storyId) {
  currentUser.favorites.push(storyId);
  console.log(currentUser.favorites);
}

function removeFromFavorites(storyId) {
  currentUser.favorites = currentUser.favorites.filter(id => id !== storyId);
  console.log(currentUser.favorites);
}

