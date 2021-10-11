// import $ from 'jquery';
// import _ from 'lodash';
import axios from 'axios';

// function asyncRequest(config) {
//   let obj = {};
//
//   if (!_.has(config, 'data.method') || config.data.method === 'GET') {
//     obj = { type: 'GET' };
//   } else {
//     if (_.has(config, 'data.method')) {
//       obj.type = config.data.method;
//     }
//     if (_.has(config, 'data.data')) {
//       obj.data = config.data.data;
//     }
//   }
//   $.ajax(config.url, obj)
//     .then(response => {
//       try {
//         return JSON.parse(response);
//       } catch (e) {
//         return response;
//       }
//     })
//     .then(response => config.callbacks(response))
//     .catch(config.errors);
// }
function asyncRequest(config) {
  const { url, data } = config;
  const method = config['method'] ?? 'get';
  const params = new URLSearchParams(data);
  return axios[method](url, params.toString());
}

export default asyncRequest;
