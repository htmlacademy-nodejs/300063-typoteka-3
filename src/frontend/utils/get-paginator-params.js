'use strict';

const {
  ONE_PAGE_LIMIT,
  MAX_DISPLAYED_PAGES,
  FIRST_PAGE,
} = require(`../../common/params`);


const PAGE_DIFFERENTIAL = Math.floor(MAX_DISPLAYED_PAGES / 2);
const DIFFERENT_BETWEEN_FIRST_AND_LAST_PAGE = MAX_DISPLAYED_PAGES - 1;

module.exports = (page, itemCount) => {
  const lastPage = Math.ceil(itemCount / ONE_PAGE_LIMIT);
  if (lastPage <= MAX_DISPLAYED_PAGES) {
    return {
      start: FIRST_PAGE,
      end: lastPage,
      page,
    };
  }
  let start = page - PAGE_DIFFERENTIAL;
  if (start < FIRST_PAGE) {
    start = FIRST_PAGE;
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
  };
};
