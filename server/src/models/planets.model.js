const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path');
const planets = require('./planets.mongo');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}




function loadPlanetsData(){

   return new Promise((resolve,reject)=>{

    fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        .pipe(parse({
        comment: '#',
        columns: true,
        }))
        .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
            //habitablePlanets.push(data);
            savePlanets(data);
        }
        })
        .on('error', (err) => {
        console.log(err);
        reject(error);
        })
        .on('end', async () => {
            //console.log(`${habitablePlanets.length} habitable planets found!`);
            const countAllPlanets = (await getAllPlanets()).length
            console.log(`${countAllPlanets} habitable planets found!`);
            resolve();
        
        });
      
      
    });

}

async function savePlanets(planet){

    try{

        await planets.updateOne({
            keplerName : planet.kepler_name,
        },{
            keplerName : planet.kepler_name
        },{
            upsert : true,
        });

    }catch(err){

        console.error("non salvato" + err);
    }
     
}

async function getAllPlanets(){
    
    return await planets.find({},
        {'__v' : 0,
        '_id' : 0}
    )
}




module.exports = {
    loadPlanetsData,
    getAllPlanets,
 
}