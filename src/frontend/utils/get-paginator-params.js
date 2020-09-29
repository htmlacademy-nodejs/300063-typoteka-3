'use strict';

const {frontendParams} = require(`../../common/params`);


const PAGE_DIFFERENTIAL = Math.floor(frontendParams.MAX_DISPLAYED_PAGES / 2);
const DIFFERENT_BETWEEN_FIRST_AND_LAST_PAGE = frontendParams.MAX_DISPLAYED_PAGES - 1;

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
  let start = page - PAGE_DIFFERENTIAL;
  if (start < frontendParams.FIRST_PAGE) {
    start = frontendParams.FIRST_PAGE;
  }
  let end = start + DIFFERENT_BETWEEN_FIRST_AND_LAST_PAGE;
  if (lastPage < end) {
    end = lastPage;
    start = end - DIFFERENT_BETWEEN_FIRST_AND_LAST_PAGE;
  }
  return {
    start,
    end,
    page,
    path,
  };
};
