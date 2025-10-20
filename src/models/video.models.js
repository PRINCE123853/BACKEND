import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudimary url
      required: true,
    },
    thumbnail: {
      type: String, // cloudimary url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    owner:{// vdo uploader
    type: Schema.Types.ObjectId,
    ref: "User"
    }



  },
  {
    timestamps: true,
  }
)

videoSchema.plugin(mongooseAggregatePaginate)// new but strong explore plugin more from mongoose docum

export const Video = mongoose.model("Video", videoSchema);
