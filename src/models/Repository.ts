import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";


export interface IRepository extends Document {
    repositoryName: string,
    description: string,
    project: Types.ObjectId
    url: string
}

const RepositorySchema : Schema = new Schema({
    repositoryName: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: false
    },
    project : {
        type: Types.ObjectId,
        ref: "Project"
    },
    url: {
        type: String,
        trim: true,
        required: true
    }
},{timestamps: true});

const Repository = mongoose.model<IRepository>("Repository", RepositorySchema);
export default Repository;
