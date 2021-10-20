import axios from 'axios';

function asyncRequest(config) {
  const { url, data } = config;
  const method = config['method'] ?? 'get';
  const params = new URLSearchParams(data);
  return method === 'get' ? axios[method](url) : axios[method](url, params.toString());
}

export default asyncRequest;
