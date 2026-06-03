import mongoose from 'mongoose';

const subscribeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    subscribedAt: { 
        type: Date,
        default: Date.now
    }
});

const subscribeModel= mongoose.models.Subscribe || mongoose.model('Subscribe', subscribeSchema);
export default subscribeModel;