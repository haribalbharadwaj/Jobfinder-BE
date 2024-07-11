const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
        required: true,
        match: /^(https?:\/\/[^\s$.?#].[^\s]*)$/i
    },
    jobPosition: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        min: [1, 'Salary must be a positive number'],
        required: true
    },
    jobType: {
        type: String,
        enum:['fullTime','part-time','internship','contract'],
        required: true
    },
    jobMode: {
        type: String,
        enum:['remote','office','hybrid'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        required: true
    },
    skillsRequired: {
        type: [String],
        required: true
    },
    information: {
        type: String,
        required: true
    },
    refUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
    {timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}}
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
