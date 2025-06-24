import { Schema, model } from 'mongoose';



const UserActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    files_content: [{
        filename: String,
        content: String,
        required: true
    }]
}, {
    id: false
});

export const UserActivity = model('UserActivity', UserActivitySchema);
