// import {addPage, getData} from '../actions/actions';
import {combineReducers} from 'redux';
import {REQUEST_PAGES, RECEIVE_PAGES, REQUEST_PAGES_FAILURE, UPDATE_PAGE_SUCCESS, UPDATE_PAGE_FAILURE, REQUEST_UPDATE_PAGE} from '../actions/actions';

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


const rootReducer = combineReducers({
  getPages,
  createPage,
});

export default rootReducer;
