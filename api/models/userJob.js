var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const shortid = require('shortid');

const socialMedia = new Schema({
    type: {
        type: String,
        enum: ["FACEBOOK", "TWITTER", "LINKEDIN"]
    },
    authorization: {
        token: String,
        userId: String,
        imageUrl: String
    }
});

const scores = new Schema({
    segmented: {
        resume: Schema.Types.Mixed,
        profilePicture: Schema.Types.Mixed,
        coverLetter: Schema.Types.Mixed,
        socialMedia: Schema.Types.Mixed
    }
});

var UserJobSchema = new Schema({
    jobId: {
        type: String,
        unique: true,
        default: shortid.generate
    },
    resume: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    profilePicture: {
        type: Schema.Types.Mixed
    },
    coverLetter: {
        type: String
    },
    socialMedia: {
        type: [socialMedia]
    },
    status: {
        type: String,
        default: "INITIAL",
        enum: ["INITIAL", "PROCESSING", "GENERATING", "COMPLETED", "FAILED", "CANCELED"]
    },
    scores: {
        type: scores,
    },
    title: {
        type: String,
        required: true
    }
});

UserJobSchema.statics = {
    getDoc(id) {
        var objID
            = mongoose.Types.ObjectId(id);
        return
        this.find({
            _id: objID
        }).select('-__v')
            .exec()
            .then((visited) => {
                if (visited) {
                    return
                    Promise.resolve(visited);
                }
                return Promise.reject(new Error("No data exists"));
            });
    },

    findData(query) {
        console.log(query)
        return this.find(query)
            .select('-__v')
            .exec()
            .then((visited) => {
                if (visited) {
                    return
                    Promise.resolve(visited);
                }
                return Promise.reject(new Error("No data exists"));
            });
    },

    findOneDoc(query) {
        return this.findOne(query)
            .select('-__v')
            .exec()
            .then((visited) => {
                if (visited) {
                    return Promise.resolve(visited);
                }
                return Promise.reject(new Error("No data exists"));
            });
    },

    list(query, { skip =
        0, limit
        = 50
    } = {}) {
        return this.find(query)
            .select('-__v')
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limit)
            .exec();
    },

    updateDoc(condition, set, options =
        {
            safe: false,
            upsert: false,
            new: true
        }) {

        return this.findOneAndUpdate(condition, set, options)
            .exec()
            .then((visited) => {
                if (visited) {
                    return Promise.resolve(visited);
                }
                return Promise.reject(new Error("No data exists"));
            });
    },

    many(data) {
        return
        this.insertMany(data,
            function
                (error, docs) {
                if (error) {
                    return Promise.reject(error);
                }
                return Promise.resolve(docs);
            })
    },

    updateMany(filter, data) {
        return this.updateMany(filter,
            data, function
                (error, docs) {
                if (error) {
                    return Promise.reject(error);
                }
                return
                Promise.resolve(docs);
            })
    }

};

mongoose.model('UserJob', UserJobSchema);