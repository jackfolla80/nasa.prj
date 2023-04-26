const {getAllLaunches, scheduleNewLauch, existLaunchWithId, abortLaunchById} = require('../../models/launches.model');


async function httpGetAllLaunches(req,res) {

    return res.status(200).json(await getAllLaunches())

}

function httpAddNweLaunch(req,res) {

    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){

        return res.status(400).json({
            error: "BAD REQUEST: Missing required launch property"
        });
    }  

    launch.lauchDate = new Date(launch.launchDate);

    if(isNaN(launch.lauchDate)){

        return res.status(400).json({
            error: "BAD REQUEST: Invalid launch date"
        });

    }
    
    scheduleNewLauch(launch);
    return res.status(201).json(launch);

}

async function httpAbortLaunch(req,res){

   const launchId = Number(req.params.id);
   //si poteva fare anche così
   // +req.params.id e ho fatto il parsing della stringa
   const existsLaunch = await existLaunchWithId(launchId)

   if(!existsLaunch){
       
        return res.status(404).json({
            error: 'launch not found'
        });

   }
   const aborted =  await abortLaunchById(launchId);

   if(!aborted){
        return res.status(400).json({
            error : 'Launch not aborted'
        });
   }
   return res.status(200).json({
    ok : true
});
   
   
}

module.exports ={
    httpGetAllLaunches,
    httpAddNweLaunch,
    httpAbortLaunch,
}