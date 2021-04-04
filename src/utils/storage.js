//Todo: State be set Somewhere
export default {
  get(key, defaultValue) {
    var value = window.localStorage[key];
    return typeof value != void 0 ? value : defaultValue;
  },
  set(key, value) {
    window.localStorage[key] = value;
  },
};
