// import {addPage, getData} from '../actions/actions';
import {combineReducers} from 'redux';
import {REQUEST_PAGES, RECEIVE_PAGES, REQUEST_PAGES_FAILURE, UPDATE_PAGE_SUCCESS, UPDATE_PAGE_FAILURE, REQUEST_UPDATE_PAGE, REQUEST_DELETE_PAGE, DELETE_PAGE_SUCCESS, DELETE_PAGE_FAILURE, EDIT_PAGE_SUCCESS, EDIT_PAGE_FAILURE, REQUEST_EDIT_PAGE, REQUEST_FRONTPAGE, FRONTPAGE_SUCCESS, FRONTPAGE_FAILURE, UPDATE_FRONTPAGE_SUCCESS, UPDATE_FRONTPAGE_FAILURE, REQUEST_UPDATE_FRONTPAGE, REQUEST_LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, REQUEST_IMAGES, IMAGES_SUCCESS, IMAGES_FAILURE} from '../actions/actions';

function getPages(state = {
  isFetching: false,
  didFail: false,
  data: [],
}, action) {
  switch (action.type) {
    case REQUEST_PAGES_FAILURE:
      return Object.assign({}, state, {
        didFail: true,
      });

    case REQUEST_PAGES:
      return Object.assign({}, state, {
        isFetching: true,
        didFail: false,
      });

    case RECEIVE_PAGES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        data: action.data,
      });

    default:
      return state;
  }
}

function createPage(state={
  isFetching: false,
  didFail: false,
  data: [],
}, action) {
  switch (action.type) {
    case UPDATE_PAGE_FAILURE:
      return Object.assign({}, state, {
        didFail: true,
      });

    case REQUEST_UPDATE_PAGE:
      return Object.assign({}, state, {
        isFetching: true,
        didFail: false,
      });

    case UPDATE_PAGE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        data: action.data,
      });
    default:
      return state;
  }
}

function deletePage(state={
  isFetching: false,
  didFail: false,
  id: '',
  data: [],
}, action) {
  switch (action.type) {
    case DELETE_PAGE_FAILURE:
      return Object.assign({}, state, {
        didFail: true,
      });

    case REQUEST_DELETE_PAGE:
      return Object.assign({}, state, {
        isFetching: true,
        didFail: false,
      });

    case DELETE_PAGE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        id: action.id,
      });

    default:
      return state;
  }
}

function editPage(state = {
  isFetching: false,
  didFail: false,
  id: '',
  data: [],
}, action) {
  switch (action.type) {
    case EDIT_PAGE_FAILURE:
      return Object.assign({}, state, {
        didFail: true,
      });

    case REQUEST_EDIT_PAGE:
      return Object.assign({}, state, {
        didFail: false,
        isFetching: true,
      });

    case EDIT_PAGE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        id: action.id,
        data: action.data,
      });

    default:
      return state;
  }
}

function getFrontpage(state = {
  isFetching: false,
  didFail: false,
  data: [],
}, action) {
  switch (action.type) {
    case REQUEST_FRONTPAGE:
      return Object.assign({}, state, {
        didFail: false,
        isFetching: true,
      });

    case FRONTPAGE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });

    case FRONTPAGE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        data: action.data,
      });

    default:
      return state;
  }
}

function updateFrontpage(state = {
  isFetching: false,
  didFail: false,
  data: [],
}, action ) {
  switch(action.type) {
    case REQUEST_UPDATE_FRONTPAGE:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case UPDATE_FRONTPAGE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        data: action.data,
      });

    case UPDATE_FRONTPAGE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });

    default:
      return state;
  }
}

function login(state = {
  isFetching: false,
  didFail: false,
  data: [],
}, action ) {
  switch(action.type) {
    case REQUEST_LOGIN:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        data: action.data,
      });

    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });

    default:
      return state;
  }
}
function images(state = {
  isFetching: false,
  didFail: false,
  data: [],
}, action) {
  switch(action.type) {
    case REQUEST_IMAGES:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case IMAGES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        data: action.data,
      });

    case IMAGES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });

    default:
      return state;
  }
}
const rootReducer = combineReducers({
  getPages,
  createPage,
  deletePage,
  editPage,
  getFrontpage,
  updateFrontpage,
  login,
  images,
});

export default rootReducer;
