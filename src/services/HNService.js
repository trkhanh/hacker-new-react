import app, { database } from "firebase";

var config = {
  databaseURL: "https://hacker-news.firebaseio.com",
};

var firebase = app.initializeApp(config);
var version = "/v0";
var api = firebase.database().ref(version);

function fetchItem(id, cb) {
  itemRef(id).once("value", function (snapshot) {
    cb(snapshot.val());
  });
}

function fetchItems(ids, cb) {
  var items = [];
  ids.forEach((id) => {
    fetchItem(id, addItem);
  });

  function addItem(item) {
    items.push(item);
    if (items.length >= ids.length) {
      cb(items);
    }
  }
}


function storiesRef(path) {
  return api.child(path)
}

function itemRef(id) {
  return api.child('item/' + id)
}

function userRef(id) {
  return api.child('user/' + id)
}

/**
 * API: update items
 */
function updatesRef() {
  return api.child('updates/items')
}

export default {
  fetchItem,
  fetchItems,
  storiesRef,
  itemRef,
  userRef,
  updatesRef
}