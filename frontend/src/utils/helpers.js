export function getRoleLabel(role) {
  const labels = { admin: 'System Administrator', user: 'Normal User', owner: 'Store Owner' };
  return labels[role] || role;
}

export function getHomePath(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'owner':
      return '/owner/dashboard';
    case 'user':
      return '/stores';
    default:
      return '/login';
  }
}

export function formatRating(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toFixed(2);
}

export function getApiError(err) {
  const data = err.response?.data;
  if (data?.errors?.length) return data.errors.join('. ');
  return data?.message || err.message || 'Something went wrong';
}
