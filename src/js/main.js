"use strict";

import "core-js/stable";

import { redditAPI } from "./api";

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const searchLimit = document.getElementById("limit");
const loadingIndicator = document.querySelector(".loading");
const results = document.querySelector(".results");

const shortenString = function (input, maxLength) {
  if (input.length <= maxLength) {
    return input;
  }

  const lastSpaceIndex = input.lastIndexOf(" ", maxLength);
  const shortenedString = input.substring(0, lastSpaceIndex);

  return shortenedString + "...";
};

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const sortBy = document.querySelector('input[name="sortby"]:checked');
  const sortByValue = sortBy.value;
  const searchInputValue = searchInput.value;
  const searchLimitValue = searchLimit.value;

  loadingIndicator.style.display = "flex";

  // Clear field
  searchInput.value = "";
  results.innerHTML = "";

  try {
    const redditResults = await redditAPI(
      searchInputValue,
      searchLimitValue,
      sortByValue
    );

    if (redditResults.length === 0) {
      results.textContent = "No search results found.";
      results.style.marginTop = "1.8rem";
      loadingIndicator.style.display = "none";
      return;
    }

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cards-container");

    redditResults.forEach((post) => {
      cardsContainer.innerHTML += `<div class="card">
        <img src="${
          post.preview
            ? post.preview.images[0].source.url
            : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg"
        }" alt="Card image cap" />
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">
            ${post.selftext ? shortenString(post.selftext, 60) : ""}
          </p>
          <a href="${
            post.url
          }" target="_blank" class="btn btn-primary">Read more</a>
          <div class="badge-container">
            <span class="badge badge-grey">Subreddit: ${post.subreddit}</span>
            <span class="badge badge-dark">Score: ${post.score}</span>
          </div>
        </div>
      `;
    });

    results.appendChild(cardsContainer);
  } catch (error) {
    results.textContent = "An error occurred while fetching data.";
    results.style.marginTop = "1.8rem";
    console.log(error);
  }

  loadingIndicator.style.display = "none";
});
