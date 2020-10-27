'use strict';

const {frontendParams} = require(`../../common/params`);


const pageDifferential = Math.floor(frontendParams.MAX_DISPLAYED_PAGES / 2);
const differentBetweenFirstAndLastPage = frontendParams.MAX_DISPLAYED_PAGES - 1;

module.exports = (params) => {
  const {page, itemCount, path = ``} = params;
  const lastPage = Math.ceil(itemCount / frontendParams.ONE_PAGE_LIMIT);
  if (lastPage <= frontendParams.MAX_DISPLAYED_PAGES) {
    return {
      start: frontendParams.FIRST_PAGE,
      end: lastPage,
      page,
      path,
    };
  }
  let start = page - pageDifferential;
  if (start < frontendParams.FIRST_PAGE) {
    start = frontendParams.FIRST_PAGE;
  }
  let end = start + differentBetweenFirstAndLastPage;
  if (lastPage < end) {
    end = lastPage;
    start = end - differentBetweenFirstAndLastPage;
  }
  return {
    start,
    end,
    page,
    path,
  };
};
