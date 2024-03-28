import mongoose, {Model, Schema, ObjectId, model} from "mongoose";

interface TokenInterface {
    userId: ObjectId
    tokenPurpose: string
    token: string
    stringDate: string
    dateCreated: Date
}

export enum TokenPurposeEnum  {
    AUTH = "Auth Token",
};

const TokenSchema = new mongoose.Schema<TokenInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    tokenPurpose: {
        type: String,
        enum: TokenPurposeEnum,
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    stringDate: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        required: true,
    },
});


const Tokens = model<TokenInterface>("Token", TokenSchema);
export default Tokens;