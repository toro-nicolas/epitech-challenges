import { Schema, model } from 'mongoose';
import {Activity} from "./activity";
import {Account} from "./account";
import {Challenge} from "./challenge";



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
    }]
}, {
    id: false
});

export async function createUserActivity(userId: string, activityId: string) {
    if (Account.findById(userId) === null) {
        return null;
    }

    const activity = await Activity.findById(activityId).populate('challenge');
    if (activity === null) {
        return null;
    }

    let newUserId = new UserActivity({
        user: userId,
        activity: activityId,
    });
    let challenge = await Challenge.findById(activity.challenge._id);
    if (challenge === null) {
        return null;
    }
    for (let file of challenge.working_files) {
        console.log(file);
        //TODO: to test and improve
    }
    return newUserId;
}

export const UserActivity = model('UserActivity', UserActivitySchema);
