const taskDetailService = require("../apis/v1/services/taskDetail.service");

const find = async (req) => {
  const query = req.query;
  const myUserId = req.user._id;

  const taskDetails = await taskDetailService.findByUserId(myUserId);
  const taskIds = taskDetails.map(item => String(item.task_id));

  const find = {
    deleted: false,
    $or: [
      { _id: { $in: taskIds } },
      { created_by: myUserId }
    ]
  };

  const status = query.status;
  if (status) {
    find.status = status;
  }

  const searchKeyword = query.search_keyword;
  const searchValue = query.search_value;
  if (searchKeyword && searchValue) {
    const regex = new RegExp(searchValue, "i");
    find[searchKeyword] = regex;
  }

  return find;
}

const sort = (query) => {
  const sort = {};

  const sortKey = query.sort_key;
  const sortValue = query.sort_value;
  if (sortKey && sortValue) {
    sort[sortKey] = sortValue;
  }

  return sort;
}

const pagination = (query) => {
  const pagination = {};

  const page = parseInt(query.page);
  const limit = parseInt(query.limit);
  if (
    !isNaN(page) &&
    !isNaN(limit)
  ) {
    pagination.skip = (page * limit - (limit - 1)) - 1;
    pagination.limit = limit;
  }

  return pagination;
}

const taskHelper = {
  find,
  sort,
  pagination
};
module.exports = taskHelper;