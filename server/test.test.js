
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

test('asdf', async() =>{
    let req = {
        name: "testroomB", description: "this is a test", address: "12318 mound street", longitude: 44.2341,
        latitude: 45.2213, clean: [0,0], smell: [0,0], TP: [0,0], safety: [0,0], 
        privacy: [0,0], busyness: [0,0], price: 0, handicap: 0, 
        genderNeutral: 0, hygiene: 0, changingStation: 0, flags: 0, flaggedBy:[]
    }
    await Restroom.create(req)
})