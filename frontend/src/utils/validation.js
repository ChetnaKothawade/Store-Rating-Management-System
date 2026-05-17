export function validateName(name) {
  const errors = [];
  if (!name || name.length < 20) errors.push('Name must be at least 20 characters');
  if (name && name.length > 60) errors.push('Name must be at most 60 characters');
  return errors;
}

export function validateEmail(email) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) errors.push('Invalid email format');
  return errors;
}

export function validateAddress(address) {
  const errors = [];
  if (address && address.length > 400) errors.push('Address must be at most 400 characters');
  return errors;
}

export function validatePassword(password) {
  const errors = [];
  if (!password || password.length < 8 || password.length > 16) {
    errors.push('Password must be 8-16 characters');
  }
  if (password && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (password && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  return errors;
}

export function validateRating(rating) {
  const num = Number(rating);
  if (!num || num < 1 || num > 5 || !Number.isInteger(num)) {
    return ['Rating must be an integer between 1 and 5'];
  }
  return [];
}

export function validateUserForm({ name, email, address, password }, requirePassword = true) {
  return [
    ...validateName(name),
    ...validateEmail(email),
    ...validateAddress(address),
    ...(requirePassword && password ? validatePassword(password) : requirePassword && !password ? ['Password is required'] : []),
  ];
}
