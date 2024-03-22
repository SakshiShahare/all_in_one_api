import mongoose , {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile : {
            type : String, //cloudingary url
            required : true,
        },
        thumbnail : {
            type : String, //clodinary url
            required : true,   
        },
        title : {
            type : String, 
            required : true,
        },
        description : {
            type : String, 
            required : true,
        },
        duration : {
            type : Number,
            required : true
        },

        views : {
            type : Number,
            default : 0
        },
        isPublished : {
            type : Boolean,
            default : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {timestamps : true}
)
//so that we can write aggregation complex queries using pipeline in video schema
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video" , videoSchema);