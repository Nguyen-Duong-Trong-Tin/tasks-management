const checkValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
}

const dateHelper = {
  checkValidDate
};
module.exports = dateHelper;