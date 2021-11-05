import app from './server'
const supertest = require('supertest')
const request = supertest(app) 

test('Check that user is being created', async(done) => {
    const user = {
        username: "tests",
        password: "testing"
    };
  
    try {
        const count = await User.count();

        await request(app).post('/api/register').send(service)
        const newCount = await Service.count()
        expect(newCount).toBe(count + 1)
        done()

    }  catch (err) {

        console.log('Error')
    }
  });