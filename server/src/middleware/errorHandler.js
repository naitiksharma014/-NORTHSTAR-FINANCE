export function notFound(req, res) { res.status(404).json({message:`Route not found: ${req.method} ${req.originalUrl}`}); }
export function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.name === 'ValidationError') return res.status(400).json({message:error.message});
  if (error.code === 11000) return res.status(409).json({message:'A record with this value already exists.'});
  if (error.code === 'SMTP_NOT_CONFIGURED') return res.status(503).json({message:error.message});
  if (error.name === 'MulterError') return res.status(400).json({message:error.message});
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) return res.status(400).json({message:'Invalid JSON request body.'});
  const status = Number(error.status || error.statusCode) || 500;
  res.status(status >= 400 && status < 600 ? status : 500).json({message:status < 500 ? (error.message || 'Request failed.') : 'Internal server error.'});
}
