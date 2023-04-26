const launchesData = require('./launches.mongo');


const launches = new Map();
let latestFlightNumber = 100;

const launch = {

    flightNumber:100,
    mission: ' Kepler exploration X',
    rocket: 'Explore IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-422 b',
    customer: [
        'ZTM',
        'NASA'
    ],
    upcoming: true,
    success: true,
}

launches.set(launch.flightNumber, launch);

function existLaunchWithId(launchId){
  
    return launches.has(launchId);
}

function getAllLaunches() {
    return Array.from(launches.values());
}

async function saveLaunch(launch){

    await launchesData.updateOne(launch,{
        flightNumber : launch.flightNumber
    },{
        launch
    },{
        upsert : true
    })

}

//saveLaunch(launch);

function addNewLaunch(launch) {

    latestFlightNumber ++;
    launches.set( latestFlightNumber, Object.assign(launch,{
        
        flightNumber : latestFlightNumber,
        upcoming : true,
        customer: ['ZTM', 'NASA'],
        success: true

    })
    
    )

}

function abortLaunchById(launchId){

    const aborted = launches.get(launchId);
    aborted.success = false;
    aborted.upcoming = false;
    return aborted;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById,
}