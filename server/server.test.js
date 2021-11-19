import { assert } from 'console';
import app from './server'
import request from "supertest"
//import Restroom from "../models/restroom"
//import User from "../models/user"

var defaults = require('superagent-defaults')
//const request = require('supertest')

var responseToken;

const User = require('../models/user');
const UserData = require('../models/userData');
const Restroom = require('../models/restroom')
const Review = require('../models/review')

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
      });
    
    test('cant register with duplicate username', async() => {
        const user = {
            username: "tests",
            password: "testing"
        };
        const res = await request(app)
        .post('/api/register')
        .send(user)
        .expect(400)
            expect(res.body.message).toBe('Username already in use')
    });
    
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
    
    test('check that user cannot login with invalid credentials', async() => {
        const testUser = {
            username: 'bogus',
            password: 'bogus-password'
        }
        const res = await request(app).post('/api/login').send(testUser).expect(400)
    })

    test('creating restroom', async() => {
        const req = {
            name: "testroom", description: "this is a test", address: "1234 mound street", longitude: 44.2341,
		    lattitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], price: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0
        }

         await request(app).post('/api/new-RR').send(req).set({'x-access-token': responseToken}).expect(200) 
         let data = await Restroom.findOne({name: req.name}).lean()
            expect(data.name).toBe(req.name)
            expect(data.address).toBe(req.address)
            expect(data.description).toBe(req.description)
            expect(data.lattitude).toBe(req.lattitude)
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
            expect(data.price).toBe(req.price)
            expect(data.busyness).toBe(req.busyness)
            */
    })

    test('removing restroom', async() =>{
        let req = {name: "testroom"}
        const res = await request(app).delete('/api/rm-RR').send(req).set({'x-access-token': responseToken}).expect(200)
        const res2 = await Restroom.findOne(req).lean()
        expect(res.body.data.deletedCount).toBe(1)
        expect(res2).toBeFalsy()
    })

    test('removing restroom not present', async() => {
        let req = {name: "testroom"}
        res = await request(app).delete('/api/rm-RR').send(req).set({'x-access-token': responseToken}).expect(200)
        expect(res.body.data.deletedCount).toBe(0)
    })
    test('remove user', async() => {
        const res = await request(app).delete('/api/rm-user').send({}).set({'x-access-token': responseToken}).expect(200)
        const res2 = await User.findOne({name: "tests"}).lean()
        //expect(res.body.data.deletedCount).toBe(1)
        expect(res2).toBeFalsy()
    })

    test('get multiple restrooms', async() => {
        let req = {
            name: "testroomB", description: "this is a test", address: "12318 mound street", longitude: 44.2341,
		    lattitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
		    privacy: [0,0], busyness: [0,0], price: 0, handicap: 0, 
		    genderNeutral: 0, hygiene: 0, changingStation: 0
        }
        await Restroom.create(req)
        req.name = "testroomC"
        req.address = "1238979034"
        req.longitude = req.longitude+(1/75)
        req.lattitude = req.lattitude+(1/75)
        await Restroom.create(req)
        req.name = "testroomD"
        req.address = "123897s9034"
        req.longitude = req.longitude+1
        req.lattitude = req.lattitude+1
        await Restroom.create(req)

        let res = await request(app).get('/api/near-RR')
        .send({longitude: 44.2341, lattitude: 45.2213, radius: 3})
        .set({'x-access-token': responseToken})
        .expect(200)
        expect(res.body.data.length).toBe(2)

        await Restroom.deleteOne({name: 'testroomB'})
        await Restroom.deleteOne({name: 'testroomC'})
        await Restroom.deleteOne({name: 'testroomD'})
    })



