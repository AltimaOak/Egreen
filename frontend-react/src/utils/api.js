const TOKEN_KEY = 'egreen_token';

class ApiError extends Error {
  constructor({ error, details, status }) {
    super(error || 'Request failed');
    this.name = 'ApiError';
    this.error = error;
    this.details = details || [];
    this.status = status;
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(endpoint, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Handle token expiry specifically
    if (response.status === 401 && data.error === 'TOKEN_EXPIRED') {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('auth:tokenExpired'));
    }

    throw new ApiError({
      error: data.error || 'Request failed',
      details: data.details || [],
      status: response.status,
    });
  }

  return data;
}

const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  del: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export { api, ApiError, TOKEN_KEY };
