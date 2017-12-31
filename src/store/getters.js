/**
 * Gets current article from $store
 * @param  {object} state $state object
 * @return {int}       current article ID
 */
export const getCurrentArticle = ((state) => {
  state.history.push('getting article id', state.currentArticle);
  return state.currentArticle;
});

/**
 * Placeholder
 * @param  {[type]} state [description]
 * @param  {[type]} id    [description]
 * @return {[type]}       [description]
 */
export const commitSomethingElse = (state, id) => {
  state.history.push('current article = ', id);
};
