const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        refPath: 'authorModel',
        required: true
    },
    authorModel: {
        type: String,
        required: true,
        enum: ['Teacher', 'Student']
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic'
    },
    customTopic: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
