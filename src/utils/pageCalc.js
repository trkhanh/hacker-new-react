function pageCalc(pageNum, pageSize, numItems) {
  var startIndex = (pageNum - 1) * pageSize;
  var endIndex = Math.min(numItems, startIndex + pageSize);
  var hasNextPage = endIndex < numItems - 1 && page;

  return {
    pageNum: pageNum,
    startIndex: startIndex,
    endIndex: endIndex,
    hasNextPage: hasNextPage,
  };
}

export default pageCalc