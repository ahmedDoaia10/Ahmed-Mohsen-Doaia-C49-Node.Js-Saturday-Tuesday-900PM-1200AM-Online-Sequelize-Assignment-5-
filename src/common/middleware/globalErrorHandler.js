export default (err, req, res, next) => {
  console.log(err);

  res.status(err?.cause || 500).json({
    message: err.message,
    stack: err.stack,
    err: err,
  });
};