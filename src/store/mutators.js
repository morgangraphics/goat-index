/**
 * Set Current Article ID on click
 * @param {object} state $state object
 * @param {int} id    Article ID
 */
export const setCurrentArticle = (state, id) => {
  state.currentArticle = id;
  state.history.push('setting current article to ', id);
};
/**
 * Set Article Visibility
 * @param {object} state $state object
 * @param {int} id    Article ID
 */
export const setArticleVisibility = (state, id) => {
  state.artvis[id].on = !state.artvis[id].on;
  state.history.push(`setting visibility of article = ${id} to ${state.artvis[id].on}`);
};

/**
 * Set Table Visibility
 * @param {object} state $state object
 * @param {int} id    Article ID
 */
export const cleanUpTables = (state, id) => {
  state.artvis.forEach((item) => {
    item.table = false;
  });
};
