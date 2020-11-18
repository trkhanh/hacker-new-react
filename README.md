# [react-hn](https://trkhanh.github.io/hacker-new-react)

A [React](http://facebook.github.io/react) &
[react-router](https://github.com/rackt/react-router)-powered implementation of
[Hacker News](https://news.ycombinator.com) using its
[Firebase API](https://github.com/HackerNews/API).

[![react-hn screenshot](https://github.com/trkhanh/hacker-new-react/raw/master/screenshot.png "New comment highlighting in react-hn")](https://trkhanh.github.io/hacker-new-react)


## Features

* Supports display of all item types:
  [stories](https://trkhanh.github.io/hacker-new-react/#/story/8863),
  [jobs](https://trkhanh.github.io/hacker-new-react/#/job/8426937),
  [polls](https://trkhanh.github.io/hacker-new-react/#/poll/126809) and
  [comments](https://trkhanh.github.io/hacker-new-react/#/comment/8054455)
* Basic [user profiles](https://trkhanh.github.io/hacker-new-react/#/user/patio11)
* Collapsible comment threads, with child counts
* "Realtime" updates (free via Firebase!)
* Last visit details for stories are cached in `localStorage`
* New comments are highlighted:
  * Comments since your last visit to an item
  * New comments which load while you're reading an item
  * New comments in collapsed threads
* Automatic or manual collapsing of comment threads which don't contain any new
  comments
* Manual highlighting of the X most recent comments to catch up on threads you were reading elsewhere
* Stories with new comments are marked on list pages
* Stories can be marked as read to remove highighting from new comments
* "comments" sections driven by the Changed Items API
* Story listing pages are cached in `sessionStorage` for quick back button usage
  and pagination in the same session
* Configurable settings:
  * auto collapse - automatically collapse comment threads without new comments
    on page load
  * show reply links - show "reply" links to Hacker News
  * show dead - show items flagged as dead
  * show deleted - show comments flagged as deleted in threads
* Delayed comment detection - so tense! Who will it be? What will they say?


## Building

Install dependencies:

```
npm install
```

### npm scripts

* `npm start` - start development server
* `npm run build` - build into the `dist/` directory
* `npm run lint` - lint `src/`
* `npm run lint:fix` - lint `src/` and auto-fix issues where possible

## MIT Licensed