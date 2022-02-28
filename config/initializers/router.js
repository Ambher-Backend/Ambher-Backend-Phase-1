const MergeParams = (req, res, next) => {
  const merged = {
    ...req.body,
    ...req.params,
    ...req.query
  };
  req.body = merged;
  next();
};

module.exports = MergeParams;
