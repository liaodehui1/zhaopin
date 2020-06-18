function getData(list, pageNum, pageSize) {
  return list.slice((pageNum - 1)*pageSize, (pageNum - 1)*pageSize + pageSize)
}

module.exports = {
  getData
}