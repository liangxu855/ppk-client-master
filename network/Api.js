/**
 * Created by fei on 14/06/2017.
 */

// import fetch from 'react-native-fetch-polyfill';

function serialize(data) {
  let retArray = [];
  for (const key in data) {
    retArray.push(`${key}=${data[key]}`);
  }
  return retArray.join('&');
}

function ajax(fullURL, method="GET", parameter=null, jsonParam=true, customHeaders=null, ) {
  let currentHeader = null;
  if (jsonParam) {
    currentHeader = {
      "Content-Type": "application/json",
      'Accept': 'application/json',
    };
  } else {
    currentHeader = {
      "Content-Type": "application/x-www-form-urlencoded",
      'Accept': 'application/json',
    };
    if (parameter) {
      parameter = serialize(parameter);
    }
  }

  console.log("Request url:"+fullURL+", method: "+method+", param:"+JSON.stringify(parameter));
  return fetch(fullURL, {
    method: method,
    headers: {
      ...customHeaders,
      ...currentHeader
    },
    body: parameter ? (jsonParam? JSON.stringify(parameter): parameter) : null,
    timeout: 10*1000,
  })
    .then((response) => {
      return response.json();
    })
    .then((responsejson) => {
      console.log(responsejson);
      return responsejson;
  }).catch((error) => {
    console.log(error);
    return Promise.reject(error);
  });
}

export default {
  ajax,
};
