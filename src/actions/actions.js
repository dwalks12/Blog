import fetch from 'isomorphic-fetch';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
export const REQUEST_UPDATE_PAGE = 'REQUEST_UPDATE_PAGE';
export const UPDATE_PAGE_SUCCESS = 'UPDATE_PAGE_SUCCESS';
export const UPDATE_PAGE_FAILURE = 'UPDATE_PAGE_FAILURE';
export const INITIAL_STATE = 'INITIAL_STATE';
export const REQUEST_PAGES = 'REQUEST_PAGES';
export const RECEIVE_PAGES = 'RECEIVE_PAGES';
export const REQUEST_PAGES_FAILURE = 'REQUEST_PAGES_FAILURE';


function requestPages() {
  return {
    type: REQUEST_PAGES,
  }
}

function receivePages(json) {
  return {
    type: RECEIVE_PAGES,
    data: json,
  }
}

function requestPagesFailure() {
  return {
    type: REQUEST_PAGES_FAILURE,
    message: 'FAILURE IN REQUESTING',
  }
}


function requestUpdatePage(id) {
    return {
      type: REQUEST_UPDATE_PAGE,
      id: id,
    };
}
function updatePageSuccess(id, json) {
  return {
    type: UPDATE_PAGE_SUCCESS,
    id: id,
    data: json,
  };
}
function updatePageFailure(id) {
  return {
    type: UPDATE_PAGE_FAILURE,
    id: id,
    message: 'UPDATE FAILURE',
  }
}

export function fetchPages() {

  console.log('yooo');
  return function (dispatch) {
    dispatch(requestPages())

    return fetch(postURL + '/posts',{
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
    }).then(response => response.json())
    .then(json => {
      dispatch(receivePages(json));
    });
  }
}
