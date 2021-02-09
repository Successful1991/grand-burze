import $ from 'jquery';

function asyncRequest(config) {
  let obj = {
    type: config.data.method,
    data: config.data.data,
  };
  if (config.data.method === 'GET') {
    obj = { type: config.data.method };
  }
  $.ajax(config.url, obj)
    .then(response => config.callbacks(response))
    .catch(config.errors);
}

export default asyncRequest;
