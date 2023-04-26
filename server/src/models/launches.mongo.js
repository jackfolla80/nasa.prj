const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({

    flightNumber : {
        type : Number,
        required : true,
                
    },
    launchDate : {
        type : Date,
        required : true,
    },
    mission : {
        type : String,
        required : true,
    },
    rocket : {
        type : String,
        required : true,

    },
    target : {
        type : String,
        
    },
    upcoming : {
        type : Boolean,
        required : true,
    },
    success : {
        type : Boolean,
        required : true,
        default : true,
    },
    customers : [String],
       

});

//Collega launchesSchema con launches collections, le collections hanno nomi plurali perchè hanno molti docuemnts

const launches = mongoose.model('Launch', launchesSchema);
module.exports = launches;
