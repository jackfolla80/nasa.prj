const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://jackfolla80:F3T88p02Y0RRsdlS@jackcluster.u1hhl.mongodb.net/nasa?retryWrites=true&w=majority';



mongoose.connection.once('open', ()=>{
    console.log('mongodb connection ready');
});

mongoose.connection.on('error', (error)=>{
    console.error(error);
});

async function mongoConnect(){

    await mongoose.connect(MONGO_URL)

}

async function mongoDisconnect(){

    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
};