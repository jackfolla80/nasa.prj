const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const launch = {

    //in commento i nomi dei campi che arrivano dalle api spaceX

    flightNumber:101, //flight_number
    launchDate: new Date('December 27, 2030'), //date_local
    mission: "Kepler exploration X", //name
    rocket: 'Explore IS1', //rocket.name
    target: 'Kepler-422 b', //not applicable
    upcoming: true, //upcoming
    success: true, //success
    customers: ['ZTM', 'NASA'], // corrisponde ad una query su payload nel campo customers che è un array paylod.customers per ogni payload
}



async function saveLaunch(lan){

        await launchesDatabase.findOneAndUpdate({
            flightNumber : lan.flightNumber
        },
            lan
        ,{
            upsert : true
        })

    

}

async function existLaunchWithId(launchId){
    
    const exist = await findLaunch({
        flightNumber: launchId
    });
    console.log("Travato: " + exist.flightNumber)
    return exist;
}

async function abortLaunchById(launchId){

    const aborted = await launchesDatabase.updateOne({
        flightNumber : launchId,
    },{
        upcoming : false,
        success : false,
    })
   
    return aborted.modifiedCount === 1;
}

//saveLaunch(launch);

//primo lancio
const DEFAULTFLIGHTNUMBER = 100

const SPACE_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){

    const response = await axios.post(SPACE_API_URL,{
        query : {},
        options :{
            pagination : false,
            populate : [
            {
                path : 'rocket',
                select : {
                    'name' : 1
                },
             
                
            },
            {
                path : 'payloads',
                select : {
                    'customers': 1
                }
            }
            
        ]
        }
    });

    if(response.status !== 200){

        console.log('problem with fetch spaceXapis')
        throw new Error('Launch data download field')
    }

    const launchDocs = response.data.docs;

    for(const launchDoc of launchDocs){

        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload)=>{

            return payload['customers'];

        });

        const launch = {

            flightNumber: launchDoc['flight_number'],
            launchDate: launchDoc['date_local'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            target: 'Kepler-422 b', //not applicable
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers,


        }

       await saveLaunch(launch)
    }

}

async function findLaunch(filter){

    return await launchesDatabase.findOne(filter);
}

async function loadLaunchesData(){

    const firstLaunch = await findLaunch({
        flightNumber : 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if(firstLaunch){

        console.log('launch data is already loaded')
        
    }else{

        populateLaunches();
    }
    console.log("downloading launch data...")

    

    
}

async function getLastestFlightNumber(){

    const latestLaunch = await launchesDatabase
        .findOne()
        .sort(
            '-flightNumber'
        )
    
    if(!latestLaunch){
        return DEFAULTFLIGHTNUMBER;
    }
    return latestLaunch.flightNumber;
}

//sistema qua non è lan
async function scheduleNewLauch(launch){

    const planetsExists = planets.findOne({
        kepler_name : launch.target
    });

    if(!planetsExists){
        throw new Error('No matching panets');
    }

    const newFlightNumber = await getLastestFlightNumber() + 1

    const newLaunch = Object.assign(launch,{
        success : true,
        upcoming : true,
        customers: ['ZTM', 'NASA'],
        flightNumber : newFlightNumber,
    })

    await saveLaunch(newLaunch);


}


 async function getAllLaunches(){

        return await launchesDatabase.find({},{
            '_id' : 0,
            '__v' : 0,
        })

    
}

module.exports = {
    scheduleNewLauch,
    getAllLaunches,
    existLaunchWithId,
    abortLaunchById,
    loadLaunchesData
}