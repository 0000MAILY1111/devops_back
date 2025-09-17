import mongoose, {Schema, Document, Types, PopulatedDoc }  from "mongoose";

export interface Itoken extends Document {
    token : string,
    user : Types.ObjectId,
    createdAt : Date,
}

const tokenSchema : Schema = new Schema ({
    token : {
        type : String,
        require : true,
    },
    user : {
        type : Types.ObjectId,
        ref : "User",
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : '10minutes'   ///tiempo del token 
    },
 
}, {timestamps: true} )


const TokenModel = mongoose.model<Itoken>("Token", tokenSchema)
export default TokenModel