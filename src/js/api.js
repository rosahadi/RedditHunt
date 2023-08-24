export const redditAPI = async function (searchTerm, searchLimit, sortBy) {
  try {
    const response = await fetch(
      `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const formattedResults = data.data.children.map((data) => data.data);

    return formattedResults;
  } catch (err) {
    throw err;
  }
};
