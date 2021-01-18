var HNService = require('../services/HNService').default

var StoryStore = require('./StoryStore').default
var UpdatesStore = require('./UpdatesStore').default

var commentParentLookup = {}
var titleCache = {}

function fetchCommentParent({ comment, cb, result }) {
    var commentId = comment.id
    var parentId = comment.parent

    while (commentParentLookup[parentId] || titleCache[parentId]) {
        // We just saved ourselves an item fetch
        result.itemCount++
        result.cacheHits++

        // the parent is a know non-comment
        if (titleCache[parentId]) {
            if (result.itemCount === 1) { result.parent = titleCache[parentId] }
            result.op = titleCache[parentId]
            cb(result)
            return
        }

        if (commentParentLookup[parentId]) {
            if (result.itemCount === 1) {
                result.parent = { id: parentId, type: 'comment' }
                // Set the parent comment's ids up for the next iteration
                commentId = parentId
                parentId = commentParentLookup[parentId]
            }
        }
    }

    // The parent of the current comment isn't known, so we'll have to fetch it
    ItemStore.getItem(parentId, (parent) => {
        result.itemCount++
        // Add the current comment's parent to the lookup for next time
        commentParentLookup[commentId] = parentId
        if (parent.type === 'comment') {
            commentParentLookup[parent.id] = parent.parent
        }
        // Todo: ??? they recall process
        processCommentParent(parent, cb, result)
    }, result)
}

function processCommentParent(item, cb, result) {
    // Todo: this result don't have type this problem can be solve during thinking but for for design
    if (result.itemCount === 1) {
        result.parent = item
    }

    if (item.type !== 'comment') {
        // Todo: during dev expreiement i dun know result have op ???
        result.op = item
        // Todo: if there are no type i must to remember item have id props => this suck
        titleCache[item.id] = {
            id: item.id,
            type: item.type,
            title: item.title
        }
        // Todo: this shit thing can be shut the fuck up if cb return ??
        cb(result)
    } else {
        // Todo:  WTF this loop
        fetchCommentParent(item, cb, result)
    }
}

var ItemStore = {
    // Todo: get(id, cb, result<null>) is that right
    getItem(id, cb, result) {
        var cachedItem = this.getCachedItem(id)
        if (cachedItem) {
            if (result) {
                // Todo: add more meaning full for result 
                result.cacheHits++
            }
            setImmediate(cb, cachedItem)
        } else {
            HNService.fetchItem(id, cb)
        }
    },

    getCachedItem(id) {
        return StoryStore.getItem(id) || UpdatesStore.getItem(id) || null
    },

    getCachedStory(id) {
        return StoryStore.getItem(id) || UpdatesStore.getStory(id) || null
    },

    fetchCommentAncestors(comment, cb) {
        var startTime = Date.now()
        // Todo: Define the result prototype 
        var result = { itemCount: 0, cacheHits: 0 }
        fetchCommentParent(comment, () => {
            result.timeTaken = Date.now() - startTime
            // Todo: read about this document
            setImmediate(cb, result)
        }, result)
    }
}

export default ItemStore