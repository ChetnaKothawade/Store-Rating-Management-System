const validateUser = (req, res, next) => {
  const { name, email, address, password } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (name.length < 20) errors.push('Name must be at least 20 characters');
    if (name.length > 60) errors.push('Name must be at most 60 characters');
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push('Invalid email format');
  }

  if (address !== undefined) {
    if (address.length > 400) errors.push('Address must be at most 400 characters');
  }

  if (password !== undefined) {
    if (password.length < 8 || password.length > 16)
      errors.push('Password must be 8-16 characters');
    if (!/[A-Z]/.test(password))
      errors.push('Password must contain at least one uppercase letter');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      errors.push('Password must contain at least one special character');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateRating = (req, res, next) => {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
    return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
  }
  next();
};

module.exports = { validateUser, validateRating };
