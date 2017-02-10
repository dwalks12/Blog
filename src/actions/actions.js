import fetch from 'isomorphic-fetch';
const URLS = require('../../models/config.js');
const postURL = URLS.globalUrl;
import appHistory from '../utility/app_history';
export const REQUEST_UPDATE_PAGE = 'REQUEST_UPDATE_PAGE';
export const UPDATE_PAGE_SUCCESS = 'UPDATE_PAGE_SUCCESS';
export const UPDATE_PAGE_FAILURE = 'UPDATE_PAGE_FAILURE';
export const INITIAL_STATE = 'INITIAL_STATE';
export const REQUEST_PAGES = 'REQUEST_PAGES';
export const RECEIVE_PAGES = 'RECEIVE_PAGES';
export const REQUEST_PAGES_FAILURE = 'REQUEST_PAGES_FAILURE';
export const REQUEST_DELETE_PAGE = 'REQUEST_DELETE_PAGE';
export const DELETE_PAGE_SUCCESS = 'DELETE_PAGE_SUCCESS';
export const DELETE_PAGE_FAILURE = 'DELETE_PAGE_FAILURE';
export const REQUEST_EDIT_PAGE = 'REQUEST_EDIT_PAGE';
export const EDIT_PAGE_SUCCESS = 'EDIT_PAGE_SUCCESS';
export const EDIT_PAGE_FAILURE = 'EDIT_PAGE_FAILURE';
export const REQUEST_FRONTPAGE = 'REQUEST_FRONTPAGE';
export const FRONTPAGE_SUCCESS = 'FRONTPAGE_SUCCESS';
export const FRONTPAGE_FAILURE = 'FRONTPAGE_FAILURE';
export const REQUEST_UPDATE_FRONTPAGE = 'REQUEST_UPDATE_FRONTPAGE';
export const UPDATE_FRONTPAGE_SUCCESS = 'UPDATE_FRONTPAGE_SUCCESS';
export const UPDATE_FRONTPAGE_FAILURE = 'UPDATE_FRONTPAGE_FAILURE';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

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
function requestDeletePage(id) {
  return {
    type: REQUEST_DELETE_PAGE,
    id: id,
  }
}
function deletePageFailure(id) {
  return {
    type: DELETE_PAGE_FAILURE,
    id: id,
    message: 'DELETE FAILURE',
  }
}
function deletePageSuccess(id) {
  return {
    type: DELETE_PAGE_SUCCESS,
    id: id,
  }
}

function requestEditPage(id) {
  return {
    type: REQUEST_EDIT_PAGE,
    id: id,
  }
}
function editPageFailure(id) {
  return {
    type: EDIT_PAGE_FAILURE,
    id: id,
  }
}
function editPageSuccess(id, json) {
  return {
    type: EDIT_PAGE_SUCCESS,
    id: id,
    data: json,
  };
}

function requestFrontpage() {
    return {
      type: REQUEST_FRONTPAGE,
    }
}
function frontpageFailure() {
  return {
    type: FRONTPAGE_FAILURE,
  }
}
function frontpageSuccess(json) {
  return {
    type: FRONTPAGE_SUCCESS,
    data: json,
  }
}
function requestUpdateFrontpage() {
  return {
    type: REQUEST_UPDATE_FRONTPAGE,
  }
}

function updateFrontpageFailure() {
  return {
    type: UPDATE_FRONTPAGE_FAILURE,
  }
}

function updateFrontpageSuccess(json) {
  return {
    type: UPDATE_FRONTPAGE_SUCCESS,
    data: json,
  }
}

function requestLogin() {
  return {
    type: REQUEST_LOGIN,
  }
}

function loginFailure() {
  return {
    type: LOGIN_FAILURE,
  }
}
function loginSuccess(json) {
  return {
    type: LOGIN_SUCCESS,
    data: json,
  }
}
export function login(data) {
  console.log(data);
  return function (dispatch) {
    dispatch(requestLogin());
    return fetch(postURL + '/login', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
    .then(json => {
      if(json) {
        dispatch(loginSuccess(json));
      } else {
        dispatch(updateFrontpageFailure());
      }
    })
  }
}
export function updateFrontpage(data) {

  console.log(data);
  return function (dispatch) {
    dispatch(requestUpdateFrontpage());

    return fetch(postURL + '/frontpage', {
      method: 'POST',
      body: data,
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
    .then(json => {
      if(json) {
        dispatch(updateFrontpageSuccess(json));
      } else {
        dispatch(updateFrontpageFailure());
      }
    })
  }
}

export function getFrontpage() {
  return function (dispatch) {
    dispatch(requestFrontpage());

    return fetch(postURL + '/frontpage', {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
    }).then(response => response.json())
    .then(json => {
      if(json) {
        dispatch(frontpageSuccess(json));

      } else {
        dispatch(frontpageFailure());
      }
    })
  }
}

export function editPage(id) {

  return function (dispatch) {
    dispatch(requestEditPage(id));

    return fetch(postURL + '/posts/' + id, {
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
    }).then(response => response.json())
    .then(json => {
      if(json) {
        dispatch(editPageSuccess(json));
        appHistory.replace('/contentpage/addPage?id=' + id);
      } else {
        dispatch(editPageFailure(id));

      }
    })
  }

}
export function fetchPages() {

  return function (dispatch) {
    dispatch(requestPages())

    return fetch(postURL + '/posts',{
      method: 'GET',
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
    }).then(response => response.json())
    .then(json => {
      if(json) {
        dispatch(receivePages(json));
      } else {
        dispatch(requestPagesFailure());
      }

    });
  }
}

export function deletePage(id) {
  return function (dispatch) {
    dispatch(requestDeletePage(id));
    return fetch(postURL + '/posts/' + id, {
      method: 'DELETE',
      headers: {
        'x-access-token': sessionStorage.getItem('jwtToken'),
      },
    }).then(response => {
      if(response.status === 204) {
        dispatch(deletePageSuccess(id));

      } else {
        dispatch(deletePageFailure(id));
      }
    });
    // .then(json => {
    //
    //   dispatch(deletePageSuccess(id));
    // })
  }
}
