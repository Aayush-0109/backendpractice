import mongoose from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        requied: true
    },
    thumbnail: {
        type: String,
        requied: true
    },
    title: {
        type: String,
        requied: true
    },
    description: {
        type: String,
        requied: true
    },
    duration: {
        type: Number,
        required
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)