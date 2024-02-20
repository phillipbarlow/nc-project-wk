const superTest = require('supertest');
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index');
const db = require('../db/connection');
const app = require('../app')

beforeEach(()=>{
    return seed(data);
})

afterAll(()=>{
    return db.end()
})

describe('GET /api/topics', () => {
    test('should return status 200', () => {
       return superTest(app).get('/api/topics')
       .expect(200)
       .then((items)=>{
        expect(items.body.length).toBe(3);
        return items
       })
        .then((result)=>{
            result.body.forEach(obj => {
                expect(obj).toMatchObject({
                    slug:expect.any(String),
                    description:expect.any(String)
                })
            });
        })
    });
    test('Should return an array of all slugs & descriptions', () => {
        expect(Object.keys(data.topicData[0]).length).toBe(2)
        expect(data.topicData).toEqual([{
            description: 'The man, the Mitch, the legend',
            slug: 'mitch'
          },
          {
            description: 'Not dogs',
            slug: 'cats'
          },
          {
            description: 'what books are made of',
            slug: 'paper'
          }])
    });
    test('Test for 400 error response', () => {
        return superTest(app)
        .get('/api/none-existing-page')
        .expect(404)
        .then((result)=>{
            expect(result.body.msg).toBe("404 error")
        })
    });
});





