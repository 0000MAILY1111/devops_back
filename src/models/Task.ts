import mongoose, {Schema, Document, Types, PopulatedDoc }  from "mongoose";
import Project from "./Project";

const taskStatus = {
    PENDING : "pending",
    ON_HOLD : "onHold",
    IN_PROGRESS : "inProgress",
    UNDER_REVIEW : "underReview",
    COMPLETE : "completed"
} as const   //no se puede modificar unicamente se lee estos valors 

export type TaskStatus =  typeof taskStatus [keyof typeof taskStatus]
///aqui taskstatus acepta un solo valor de esos los proporicionado s

export interface Itask extends Document {
    name : string,
    description : string 
    project : Types.ObjectId 
    status : TaskStatus
}

export const TaskShema : Schema = new Schema ({
    name : {
        type : String ,
        trim : true,
        require : true
    },
    description : {
        type : String ,
        trim : true,
        require : true
    },
    //cada documento debe tern un proyect
    project : {
        type: Types.ObjectId, 
        ref: "Project"
    },
    status : {
        type : String,
        enum : Object.values (taskStatus),
        default : taskStatus.PENDING
        ///para convertrilo en un valor que vaya a ser leido 
    }
   }, {timestamps: true} )


const Task = mongoose.model<Itask>("Task", TaskShema)
export default Task 