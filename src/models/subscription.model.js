import mongoose , {Schema} from "mongoose"
//whenever a channel is subscribed a new document is formed

const subscriptionSchema = new Schema(
    {
        subscriber : {
            type : Schema.Types.ObjectId, // the one who is subscribing 
            ref : "User"
        } ,

        channel : {
            type : Schema.Types.ObjectId, // the one who is subscribed
            ref : "User"
        }
    },
    {timestamps : true}
    );



export const Subscription = mongoose.model("Subscription" , subscriptionSchema);