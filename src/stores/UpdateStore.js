var EventEmitter = require('events').EventEmitter

var HNService = require('../services/HNService').default

var { UPDATES_CACHE_SIZE } = require('../utils/const').default
var extend = require('../utils/extend').default

/**
 * Firebase reference used to stream updates.
 */
var updatesRef = null


/**
 * Contains item id -> item cache objects. Persisted to sessionStorage.
 * @prop .comments {Object.<id,item>} comments cache.
 * @prop .stories {Object.<id,item>} story cache.
 */
var updatesCache = null



/**
 * Lists of items in reverse chronological order for display.
 * @prop .comments {Array.<item>} comment updates.
 * @prop .stories {Array.<item>} story updates.
 */
var updates = {}

function sortByTimes(a, b) {
    return b.time - a.time
}

function cacheObjToSortedArray(obj) {
    return Object.keys(obj).map((id) => obj[id]).sort(sortByTimes)
}


/**
 * Populate lists of updates for display from the cache.
 */
function populateUpdates() {
    updates.comments = processCacheObj(updatesCache.comments)
    updates.stories = processCacheObj(updatesCache.stories)
}

/**
 * Create an array of items from a cache object, sorted in reverse chronological
 * order. Evict the oldest items from the cache if it's grown above
 * UPDATES_CACHE_SIZE.
 */
function processCacheObj(cacheObj) {
    var arr = cacheObjToSortedArray(cacheObj)
    arr.splice(UPDATES_CACHE_SIZE, Math.max(0, arr.length - UPDATES_CACHE_SIZE)).forEach(
        ({ id }) => delete cacheObj[id]
    )
}

/**
 * Lookup to filter out any items which appear in the updates feed which can't
 * be displayed by the Updates component.
 */
var updateItemTypes = {
    comment: true,
    job: true,
    poll: true,
    story: true
}

/**
 * Process incoming items from the update stream.
 */
function handleUpdateItems(items) {

    for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i]
        // Silently ignore deleted items (because irony)
        if (item.deleted) { continue }

        if (typeof updateItemTypes[item.type] == 'undefined') {
            if (process.env.NODE_ENV !== 'production') {
                console.warn("An item which can't be displaued by the Updates components was received in the updates stream:" + JSON.stringify(item));
            }
            continue
        }

        if (item.type === 'comment') {
            updatesCache.comments[item.id] = item
        } else {
            updatesCache.stories[item.id] = item
        }
    }
    populateUpdates()
    UpdateStore.emit('updates', updates)
}

var UpdateStore = extend(new EventEmitter(), {
    loadSession() {
        var json = window.sessionStorage.updates
        updatesCache = (json ? JSON.parse(json) : { comment: {}, stories: {} })
        populateUpdates()
    },

    saveSession() {
        window.sessionStorage.updates = JSON.stringify(updatesCache)
    },

    start() {
        if (updatesRef === null) {
            updatesRef = HNService.updatesRef()
            updatesRef.on('value', (snapshot) => {
                HNService.fetchItems(snapshot.val(), handleUpdateItems)
            })
        }
    },

    stop() {
        updatesRef.off();
        updatesRef = null
    },

    getUpdates() {
        return updates;
    },

    getItem(id) {
        return (updatesCache.comments[id] || updatesCache.stories[id] || null)
    },

    getComment(id) {
        return (updatesCache.comments[id] || null)
    },

    getStory(id) {
        return (updatesCache.stories[id] || null)
    }

})

UpdatesStore.off = UpdatesStore.removeListener
export default UpdatesStore