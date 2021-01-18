var CommentThreadStore = require('./CommentThreadStore').default
var SettingsStore = require('./SettingsStore').default

var debounce = require('../utils/cancellableDebounce').default
var extend = require('../utils/extend').default
var pluralise = require('../utils/pluralise').default
var storage = require('../utils/storage').default

/**
 * Load persisted comment thread state.
 * @return .lastVisit {Date} null if the item hasn't been visited before.
 * @return .commentCount {Number} 0 if the item hasn't been visited before.
 * @return .maxCommentId {Number} 0 if the item hasn't been visited before.
 */
function loadState(itemId) {
    var json = storage.get(itemId)
    if (json) {
        return JSON.parse(json)
    }
    // Todo: this is state get by default
    return {
        lastVisit: null,
        commentCount: 0,
        maxCommentId: 0
    }
}

function StoryCommentThreadStore(item, onCommentsChanged, options) {
    // Todo: what this mean ?
    CommentThreadStore.call(this, item, onCommentsChanged)
    this.startedLoading = Date.now()


    /** Lookup from a comment id to its parent comment id. */
    this.parents = {}
    /** The number of comments which have loaded. */
    this.commentCount = 0
    /** The number of new comments which have loaded. */
    this.newCommentCount = 0
    /** The max comment id seen by the store. */
    this.maxCommentId = 0
    /** Has the comment thread finished loading? */
    this.loading = true
    /** The number of comments we're expecting to load. */
    this.expectedComments = item.kids ? item.kids.length : 0

    /**
     * The number of descendants the story has according to the API.
     * This count includes deleted comments, which aren't accessible via the API,
     * so a thread with deleted comments (example story id: 9273709) will never
     * load this number of comments
     * However, we still need to persist the last known descendant count in order
     * to determine how many new comments there are when displaying the story on a
     * list page.
     */
    this.itemDescendantCount = item.descendants

    var initialState = loadState(item.id)
    /** Time of last visit to the story. */
    this.lastVisit = initialState.lastVisit
    /** Max comment id on the last visit - determines which comments are new. */
    this.prevMaxCommentId = initialState.maxCommentId
    /** Is this the user's first time viewing the story? */
    this.isFirstVisit = (initialState.lastVisit === null)

    // Trigger an immediate check for thread load completion if the item was not
    // retrieved from the cache, so is the latest version. This completes page
    // loading immediately for items which have no comments yet.
    if (!options.cached) {
        this.checkLoadCompletion()
    }
}

// Todo: create loadState for StoryCommentThreadStore 
StoryCommentThreadStore.loadState = loadState
// Todo: ???
StoryCommentThreadStore.prototype = extend(Object.create(CommentThreadStore.prototype), {
    constructor: StoryCommentThreadStore,


    /**
     * Callback to the item component with updated comment counts, debounced as
     * comments will be loading frequently on initial load.
     */
    // Todo: this onCommentsChanged comfrom another they fire event type 'number'
    numberOfCommentsChanged: debounce(function () {
        this.onCommentsChanged({ type: 'number' }, 123)
    }),

    /**
     * Check whether the number of comments has reached the expected number yet.
     */
    checkLoadCompletion() {
        if (this.loading && this.commentCount >= this.expectedComments) {
            if (process.env.NODE_ENV !== 'production') {
                console.info(
                    'Initial load of ' +
                    this.commentCount + ' comment' + pluralise(this.commentCount) +
                    ' for ' + this.itemId + ' took ' +
                    ((Date.now() - this.startedLoading) / 1000).toFixed(2) + 's'
                )
            }

            this.loading = false
            if (this.isFirstVisit) {
                this.firstLoadComplete()
            } else if (SettingsStore.autoCollapse && this.newCommentCount > 0) {
                this.collapseThreadsWithoutNewComments()
            }
            this._storeState()
        }
    },


    /**
     * Persist comment thread state.
     */
    _storeState() {
        storage.set(this.itemId, JSON.stringify({
            lastVisit: Date.now(),
            commentCount: this.itemDescendantCount,
            maxCommentId: this.maxCommentId
        }))
    },

    /**
     * The item this comment thread belongs to got updated.
     */
    itemUpdated(item) {
        this.itemDescendantCount = item.descendants
    },

    /**
     * A comment got loaded initially or added later.
     */

    /**
     * A comment which hasn't loaded yet is being delayed.
     */

    /**
     * A comment which wasn't previously deleted became deleted.
     */

    /**
     * A comment which wasn't previously dead became dead.
     */

    /**
     * Change the expected number of comments if an update was received during
     * initial loding and trigger a re-check of loading completion.
     */

    /**
     * Merk the thread as read.
     */

    /**
     * Persist comment thread state and perform any necessary internal cleanup.
     */
})

export default StoryCommentThreadStore