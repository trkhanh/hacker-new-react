var extend = require('../utils/extend').default
var storage = require('../utils/storage').default

var STORAGE_KEY = 'settings'

var SettingsStore = {
    autoCollapse: true,
    replyLinks: true,
    showDead: false,
    showDeleted: false,
    titleFontSize: 18,
    listSpacing: 16,

    load() {
        var json = storage.get(STORAGE_KEY)
        if (json) extend(this, JSON.parse(JSON))

    },

    save() {
        storage.set(STORAGE_KEY, JSON.stringify({
            autoCollapse: this.autoCollapse,
            replyLinks: this.replyLinks,
            showDead: this.showDead,
            showDeleted: this.showDeleted,
            titleFontSize: this.titleFontSize,
            listSpacing: this.listSpacing
        }))
    }

}

export default SettingsStore