import mongoose, {Schema, Document, PopulatedDoc, Types}  from "mongoose";
import  { Itask } from "./Task";

///typo de datos Ts
export interface IProject extends Document {
    projectName: string;
    clientName: string;    
    description: string;
    tasks : PopulatedDoc <Itask & Document > []
}
///typo de dato Mongose
const ProjectShema : Schema  = new Schema({
    projectName: {
        type: String,
        trim: true,
        required: true 
    },
    clientName: {
        type: String,
        trim: true,
        required: true 
    },
    description: {
        type: String,
        trim: true,
        required: true 
    },
    tasks : [{
        type : Types.ObjectId,
        ref : "Task"
    }]
     
}, {timestamps: true} );

const Project = mongoose.model<IProject>("Project", ProjectShema);
export default Project;

