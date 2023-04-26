const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');




describe(' Lunches API', ()=>{

    beforeAll(async ()=>{
        await mongoConnect();
    });

    afterAll(async ()=>{
        await mongoDisconnect();
    })

    describe('Test GET/ launches', ()=>{

        test('Dovrebbe rispondere con 200 success', async ()=>{
    
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
                .expect('Content-Type',/json/);
            
    
        });
    
    });
    
describe('Test POST launches',  ()=>{

    const completeLaunchData = 
        {

            "mission": "NAMEMISSION" ,
            "rocket": "ZTM Experimental IS1",
            "launchDate": "January 4, 2028",
            "target": "Kepler-62 f"
        
        }
    
        const launchDataWithoutDate = 
        {

            "mission": "NAMEMISSION" ,
            "rocket": "ZTM Experimental IS1",
            "target": "Kepler-188"
        
        }

    test('Dovrebbe rispondere con 201 created', async ()=>{

        const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)   
            .expect(201)
            .expect('Content-Type',/json/);

            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(responseDate).toBe(requestDate);

            expect(response.body).toMatchObject(launchDataWithoutDate)
    });

    test('Validazione dei dati in input', async ()=>{

        const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)   
        .expect(400) //bad reqeust
        .expect('Content-Type',/json/);

        expect(response.body).toStrictEqual(
            {
                error: "BAD REQUEST: Missing required launch property"
            }

        )
    });

    test('Validazione della data', async ()=>{

        const response = await request(app)
        .post('/v1/launches')
        .send({
            "mission": "NAMEMISSION" ,
            "rocket": "ZTM Experimental IS1",
            "launchDate": "una data sbagliata",
            "target": "Kepler-188"
        })   
        .expect(400) //bad reqeust
        .expect('Content-Type',/json/);

        expect(response.body).toStrictEqual(
            {
                error: "BAD REQUEST: Invalid launch date"
            }

        )
    });

});



})


