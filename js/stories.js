"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="fa-regular fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);

    // Check if the story is in the user's favorites
    const isFavorite = currentUser.isFavorite(story);

    // Update the star icon class based on the favorite status
    if (isFavorite) {
      $story.find('.fa-star').removeClass('fa-regular').addClass('fa-solid');
    }
  }

  $allStoriesList.show();

  // Add event listener to the star icon using event delegation
  $allStoriesList.on('click', '.fa-star', function () {
    const $starIcon = $(this);
    const $story = $starIcon.closest('.story');
    const storyId = $story.attr('id');

    // Toggle the class on the star icon
    $starIcon.toggleClass('fa-regular fa-solid');

    // Get the story object from the storyList using the storyId
    const story = storyList.stories.find(story => story.storyId === storyId);

    // Check if the story is already in the user's favorites
    const isFavorite = currentUser.isFavorite(story);

    // Add or remove the story from the user's favorites and update localStorage
    if (isFavorite) {
      currentUser.removeFavorite(story);
    } else {
      currentUser.addFavorite(story);
    }
    currentUser.saveFavoritesToLocalStorage();
  });
}

async function createStory(e) {
  e.preventDefault();
  const title = $('#new-story-title').val();
  const url = $('#new-story-url').val();
  const addedStory = await storyList.addStory(currentUser, { title: title, author: currentUser.name, url: url });
  putStoriesOnPage();
  $('#new-story-title').val('');
  $('#new-story-url').val('');
  $('.submit-form').hide();
  currentUser.ownStories.push(addedStory);
  currentUser.saveOwnStoriesToLocalStorage();
}

$('#submit-btn').on("click", createStory);
