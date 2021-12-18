import { assert } from 'console';
import request from "supertest"
import { markAsUntransferable } from 'worker_threads';
//import Restroom from "../models/restroom"
//import User from "../models/user"

var defaults = require('superagent-defaults')
//const request = require('supertest')

var responseToken;

const User = require('../models/user')
const UserData = require('../models/userData')
const Restroom = require('../models/restroom')
const Review = require('../models/review')
const mongoose = require('mongoose')
const createServer = require("./server")
const app = createServer()
const ObjectId = require("mongodb").ObjectId

beforeAll((done) => {
    mongoose.connect(
		"mongodb+srv://dcphillips99:00805061Dp!@ratemyrestroom.tobsj.mongodb.net/RateMyTestroom?retryWrites=true&w=majority",
		{ useNewUrlParser: true },
		() => done()
	)
})

afterAll((done => {
    mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done())
	})
}))

afterEach((done => {
    Restroom.deleteMany({}, (err,doc) => {
        Review.deleteMany({}, (err,doc) =>{
            done()
        })
    })
}))
    //registration tests
    test('user creation', async() => {
        const user = {
            username: "tests",
            password: "testing"
        };
            let res = await request(app)
            .post('/api/register')
            .send(user)
            .expect(200)
            
            //check that the information was stored on server properly
            const userver = await User.findOne({username: user.username}).lean()
            expect(userver.username).toBe(user.username)
            expect(userver.password).toBeTruthy()
            expect(userver.password).not.toBe(user.password)
            UserData.findOne({username: user.username}, (err,doc) => {
                expect(err).toBeFalsy()
                expect(doc.favorites).toMatchObject([])
            })
      });
   
    test('cant register with duplicate username', async() => {
        const user = {
            username: "tests",
            password: "testing"
        };
        const res = await request(app).post('/api/register').send(user).expect(400)
        expect(res.body.message).toBe('Username already in use')
    });

    test('user data already exists when registering', async() => {
        await UserData.create({
            username: "test",
            favorites: []
        })
        const user = {
            username: "test",
            password: "testing"
        };
        const res = await request(app).post('/api/register').send(user).expect(400)
        let res2 = await UserData.findOneAndDelete({username: "test"})
        expect(res.body.message).toBe('User Data already exists')
        expect(res2).toBeTruthy()
    })

    test('registering with null credentials', async() => {
        const user = {test: "est", password: "test"}
        const res = await request(app).post('/api/register').send(user).expect(400)
        expect(res.body.data).toBe('ValidationError')
    });
    
    //login tests
    test('Check that user can login', async() => {
        const testUser = {
            username: "tests",
            password: "testing"
        };
            const res = await request(app).post('/api/login').send(testUser).expect(200)
            responseToken = res.body.data
            const userID = await User.findOne({username: testUser.username}).lean()
            expect(userID._id).toBeTruthy();
      });
  
    test('check that user cannot login with invalid user-pass combo', async() => {
        const testUser = {
            username: 'bogus',
            password: 'bogus-password'
        }
        const res = await request(app).post('/api/login').send(testUser).expect(400)
    })

    test('check that user cannot login with invalid password', async() => {
        const testUser = {
            username: 'tests',
            password: 'bogus-password'
        }
        const res = await request(app).post('/api/login').send(testUser).expect(400)
    })

    //user Data tests
   
    test('test getting user data', async() => {
        const res = await request(app).get('/api/userData').set({'x-access-token': responseToken}).expect(200)
        expect(res.body.data.username).toBe("tests")
    })

    test('test getting user data that doesnt exist', async() => {
        let copy = await UserData.findOneAndDelete({username:"tests"})
        const res = await request(app).get('/api/userData').set({'x-access-token': responseToken}).expect(400)
        expect(res.body.message).toBe("user data not found in database")
        const res2 = await UserData.insertMany(copy)
        expect(res2).toBeTruthy()
    })

    test('updating user data sucessfully', async() => {
        UserData.findOne({username: "tests"}, async(err, doc)=>{
            expect(err).toBeFalsy()
            doc.favorites = ["testroom", "testroom2"]
            const res = await request(app).post('/api/update-userData').send(doc._doc).set({'x-access-token': responseToken}).expect(200)
            UserData.findOne({username: "tests"}, (err,doc) => {
                expect(doc.favorites).toMatchObject(["testroom", "testroom2"])
            }).clone()
            res2 = await UserData.findOneAndUpdate({username: "tests"}, {favorites:[]})
            expect(res2).toBeTruthy()
        }).clone()     
    })

    test("updating user data that isn't the logged in user's", async() => {
        await UserData.create({
            username: "nacho",
            favorites: []
        })
        await UserData.findOne({username: "nacho"}, async(err, doc)=>{
            expect(err).toBeFalsy()
            doc.favorites = ["testroom", "testroom2"]
            const res = await request(app).post('/api/update-userData').send(doc._doc).set({'x-access-token': responseToken}).expect(400)
            doc.favorites = []
        }).clone()     
    })

    //authentication tests
    test('bad authentication check', async() => {
        const req = {
            name: "testroom1", address: "12345 mound street", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0
        }

         let res = await request(app).post('/api/new-RR').send(req).set({'x-access-token': "bad-Token"}).expect(401)
         let data = await Restroom.findOne({name: req.name})
         expect(data).toBeFalsy()
         expect(res.body.message).toBe("jwt malformed")
    })

    test('authentication without token', async() => {
        const req = {
            name: "testroom1", address: "12345 mound street", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0
        }

         let res = await request(app).post('/api/new-RR').send(req).expect(401)
         let data = await Restroom.findOne({name: req.name})
         expect(data).toBeFalsy()
         expect(res.body.message).toBe("No Token Given")
    })

    //restroom tests
    test('no restrooms nearby', async() => {
        let res = await request(app).get('/api/near-RR')
        .query({longitude: 44.2341, latitude: 45.2213, radius: 3})
        .set({'x-access-token': responseToken})
        .expect(200)

        expect(res.body.data.length).toBe(0)
    })

    test('creating restroom', async() => {
        const req = {
            name: "testroom", description: "this is a test", address: "1234 mound street", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy: []
        }

         await request(app).post('/api/new-RR').send(req).set({'x-access-token': responseToken}).expect(200) 
         let data = await Restroom.findOne({name: req.name}).lean()
            expect(data.name).toBe(req.name)
            expect(data.address).toBe(req.address)
            expect(data.description).toBe(req.description)
            expect(data.latitude).toBe(req.latitude)
            expect(data.longitude).toBe(req.longitude)
            expect(data.handicap).toBe(req.handicap)
            expect(data.genderNeutral).toBe(req.genderNeutral)
            expect(data.hygiene).toBe(req.hygiene)
            expect(data.changingStation).toBe(req.changingStation)
            /* for later
            expect(data.clean).toBe(req.clean)
            expect(data.smell).toBe(req.smell)
            expect(data.TP).toBe(req.TP)
            expect(data.safety).toBe(req.safety)
            expect(data.privacy).toBe(req.privacy)
            expect(data.pay).toBe(req.pay)
            expect(data.busyness).toBe(req.busyness)
            */
        })

    test("creating null restroom", async() =>{
        try{
            let res = await request(app).post('/api/new-RR').send({}).set({'x-access-token': responseToken}).expect(400)
            expect(res.body.data).toBe("ValidationError")
        } catch(err){
            expect(err).toBeFalsy()
        }
    })

    test('creating restroom with partial fields', async() => {
        const req = {
            name: "testroom1", address: "12345 mound street", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags:0, flaggedBy:[]
        }

         let res = await request(app).post('/api/new-RR').send(req).set({'x-access-token': responseToken}).expect(200) 
         let data = await Restroom.findOne({name: req.name}).lean()
            expect(data.name).toBe(req.name)
            expect(data.address).toBe(req.address)
            expect(data.latitude).toBe(req.latitude)
            expect(data.longitude).toBe(req.longitude)
            expect(data.handicap).toBe(req.handicap)
            expect(data.genderNeutral).toBe(req.genderNeutral)
            expect(data.hygiene).toBe(req.hygiene)
            expect(data.changingStation).toBe(req.changingStation)
    })

    test('creating duplicate restroom', async() => {
        const req = {
            name: "testroom1", address: "12345 mound street", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy: []
        }
        let res0 = await Restroom.create(req)
        expect(res0).toBeTruthy()
        
        req.latitude = 0
        let res = await request(app).post('/api/new-RR').send(req).set({'x-access-token': responseToken}).expect(400)
        expect(res.body.message).toBe("Restroom already exists") 
        let data = await Restroom.findOne({name: req.name}).lean()
        expect(data.latitude).toBe(45.2213)
    })

    test('removing restroom by name', async() =>{
        await Restroom.create({
            name: "testroom", description: "this is a test", address: "1234 mound street", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags:0, flaggedBy: []
        })
        let req = {name: "testroom"}
        const res = await request(app).delete('/api/rm-RR').send(req).set({'x-access-token': responseToken}).expect(200)
        const res2 = await Restroom.findOne(req).lean()
        expect(res.body.data.deletedCount).toBe(1)
        expect(res2).toBeFalsy()
    })

    test('removing restroom by address', async() =>{
        await Restroom.create({
            name: "testroom1", address: "1234moundstreet", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy:[]
        })
        let req = {address: "1234moundstreet"}
        const res = await request(app).delete('/api/rm-RR').send(req).set({'x-access-token': responseToken}).expect(200)
        const res2 = await Restroom.findOneAndDelete(req).lean()
        expect(res.body.data.deletedCount).toBe(1)
        expect(res2).toBeFalsy()
    })

    test('removing restroom not present', async() => {
        let req = {name: "testroom"}
        res = await request(app).delete('/api/rm-RR').send(req).set({'x-access-token': responseToken}).expect(200)
        expect(res.body.data.deletedCount).toBe(0)
    })

    test('get multiple restrooms', async() => {
        let req = {
            name: "testroomB", description: "this is a test", address: "12318 mound street", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy:[]
        }
        await Restroom.create(req)
        req.name = "testroomC"
        req.address = "1238979034"
        req.longitude = req.longitude+(1/75)
        req.latitude = req.latitude+(1/75)
        await Restroom.create(req)
        req.name = "testroomD"
        req.address = "123897s9034"
        req.longitude = req.longitude+1
        req.latitude = req.latitude+1
        await Restroom.create(req)
        req.name = "testroomE"
        req.address = "asdfasgsdf"
        req.longitude = req.longitude+15
        req.latitude = req.latitude+15
        await Restroom.create(req)

        let res = await request(app).get('/api/near-RR')
        .query({longitude: 44.2341, latitude: 45.2213, radius: 3})
        .set({'x-access-token': responseToken})
        .expect(200)
        expect(res.body.data.length).toBe(2)  
    })

    //favorites tests
    test('update favorites when restroom is removed', async() => {
        await Restroom.create({
            name: "testroom", address: "1234moundstreet", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy:[]
        })
        await UserData.findOneAndUpdate({username: 'tests'}, {favorites: ["testroom"]})
        await request(app).delete('/api/rm-RR', async (res) => {
            let room = await UserData.findOne({username: "tests"})
            expect(room.favorites).toMatchObject([])
        }).send({name: "testroom"}).set({'x-access-token': responseToken}).expect(200)
    })

    // review tests

    //post a review for restroom not in server
    test('review restroom that doesnt exists', async()=>{
        let req = {restroomName: "bogus", username: "tests",
			time: "1", clean: 3, smell: 3,
			TP: 3, safety: 3, privacy: 3,
			busyness: 3, pay: 3, handicap: 0,
			genderNeutral: 0, hygiene: 0, changingStation: 0}
        let res = await request(app).post('/api/new-review').send(req).set({'x-access-token': responseToken}).expect(400)
        expect(res.body.message).toBe("restroom not found")
    })

    //post a review for a username/restroom combo that already exists
    test('duplicate review', async() => {
        await Restroom.create({
            name: "testroom1", address: "1234moundstreet", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy:[]
        })

        let req = {restroomName: "testroom1", username: "tests",
        time: "1", clean: 3, smell: 3,
        TP: 3, safety: 3, privacy: 3,
        busyness: 3, pay: 3, handicap: 0,
        genderNeutral: 0, hygiene: 0, changingStation: 0}
        await Review.create(req)
        let res = await request(app).post('/api/new-review').send(req).set({'x-access-token': responseToken}).expect(400)
        expect(res.body.message).toBe("User has already reviewed this restroom")
       })
    //post a valid review
    test('successful review', async() => {
        await Restroom.create({
            name: "testroom1", address: "1234moundstreet", longitude: 44.2341,
		    latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], pay: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy:[]
        })
        let req = {restroomName: "testroom1", username: "tests",
        time: "1", clean: 1, smell: 2,
        TP: 3, safety: 4, privacy: 5,
        busyness: 3, pay: 1, handicap: -1,
        genderNeutral: 1, hygiene: 1, changingStation: 0}
        let res = await request(app).post('/api/new-review').send(req).set({'x-access-token': responseToken}).expect(200)
        let rev = await Review.findOne({restroomName:"testroom1", username:"tests"})
        expect(rev.clean).toBe(1)
        expect(rev.smell).toBe(2)
        expect(rev.TP).toBe(3)
        expect(rev.safety).toBe(4)
        expect(rev.privacy).toBe(5)
        expect(rev.busyness).toBe(3)
        expect(rev.pay).toBe(1)
        expect(rev.handicap).toBe(-1)
        expect(rev.genderNeutral).toBe(1)
        expect(rev.hygiene).toBe(1)
        expect(rev.changingStation).toBe(0)

        let rest = await Restroom.findOne({name: "testroom1"})
        expect(rest.clean[0]).toBe(1)
        expect(rest.clean[1]).toBe(1)
        expect(rest.smell[0]).toBe(2)
        expect(rest.smell[1]).toBe(1)
        expect(rest.TP[0]).toBe(3)
        expect(rest.TP[1]).toBe(1)
        expect(rest.safety[0]).toBe(4)
        expect(rest.safety[1]).toBe(1)
        expect(rest.privacy[0]).toBe(5)
        expect(rest.privacy[1]).toBe(1)
        expect(rest.busyness[0]).toBe(3)
        expect(rest.busyness[1]).toBe(1)

        expect(rest.pay).toBe(1)
        expect(rest.handicap).toBe(-1)
        expect(rest.genderNeutral).toBe(1)
        expect(rest.hygiene).toBe(1)
        expect(rest.changingStation).toBe(0)
    })

    //user tests
    test('remove user', async() => {
        const res = await request(app).delete('/api/rm-user').send({}).set({'x-access-token': responseToken}).expect(200)
        const res2 = await User.findOne({username: "tests"}).lean()
        expect(res.body.data.deletedCount).toBe(1)
        expect(res2).toBeFalsy()
    })

    test('remove user no longer present', async() => {
        const res = await request(app).delete('/api/rm-user').send({}).set({'x-access-token': responseToken}).expect(200)
        const res2 = await User.findOne({username: "tests"}).lean()
        expect(res.body.data.deletedCount).toBe(0)
        expect(res2).toBeFalsy()
    })


    //unauthenticated route tests
    


   


    



