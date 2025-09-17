import mongoose, {Schema, Document, Types, PopulatedDoc }  from "mongoose";

export interface IUser extends Document {
    name : string,
    email : string,
    password : string,
    confirmedPassword : boolean,
}

const UserShema : Schema = new Schema ({
    name : {
        type : String ,
        require : true,
    },
    email : {
        type : String ,
        require : true,
        lowercase: true,
        unique: true
    },
    password : {
        type : String ,
        require : true
    },
    confirmedPassword : {
        type: Boolean,
        default: false
    }
}, {timestamps: true} )

const User = mongoose.model<IUser>("User", UserShema)
export default User
