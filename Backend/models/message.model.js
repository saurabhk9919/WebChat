import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    message: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true,
        validate: [
            {
                validator: (value) => {
                    return value.length > 0;
                },
                message: "Message cannot be empty",
            },
        ],
    },
    detectedAction: {
        type: Object,
        default: null
    },
    linkedTaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        default: null
    },
    embedding: {
        type: [Number],
        default: []
    },
}, {
    timestamps: true,
});

const Message = mongoose.model("Message", messageSchema);
export default Message;