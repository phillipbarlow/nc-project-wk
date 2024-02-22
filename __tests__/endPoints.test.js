const superTest = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("should return status 200", () => {
    return superTest(app)
      .get("/api/topics")
      .expect(200)
      .then((items) => {
        expect(items.body.length).toBe(3);
        return items;
      })
      .then((result) => {
        result.body.forEach((obj) => {
          expect(obj).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("Should return an array of all slugs & descriptions", () => {
    expect(Object.keys(data.topicData[0]).length).toBe(2);
    expect(data.topicData).toEqual([
      {
        description: "The man, the Mitch, the legend",
        slug: "mitch",
      },
      {
        description: "Not dogs",
        slug: "cats",
      },
      {
        description: "what books are made of",
        slug: "paper",
      },
    ]);
  });
  test("Test for 404 error response", () => {
    return superTest(app)
      .get("/api/none-existing-page")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("404 error");
      });
  });
});
describe("GET /api", () => {
  test("Test for status 200", () => {
    return superTest(app)
      .get("/api")
      .expect(200)
      .then((file) => {
        const apiDescription = file.body["GET /api"];
        expect(typeof file.body).toBe("object");
        expect(Object.keys(apiDescription)).toEqual(["description"]);
        expect(Object.values(file.body["GET /api"])).toEqual([
          "serves up a json representation of all the available endpoints of the api",
        ]);
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("Should test for 200 status", () => {
    return superTest(app).get("/api/articles/2")
    .expect(200)
  });
  test('Should respond with object containing author title, article_id,body,topic,created_at,votes,article_img_url', () => {
    return superTest(app).get("/api/articles/2")
    .then((result)=>{
      const objectKeys = Object.keys(result.body[0])
      const expectedValues = ['article_id','title','topic','author','body','created_at','votes','article_img_url']
      expect(objectKeys).toEqual(expectedValues)
      expect(objectKeys.length).toBe(8)
    })
  })
  test('Test for 400 error when /api/articles/forklift', () => {
    return superTest(app).get("/api/articles/forklift")
    .expect(400)
    .then((result)=>{
      expect(JSON.parse(result.text)).toEqual({"msg":"Bad request"})
    })
  });
  test('Test for 404 error when /api/articles/9999', () => {
    return superTest(app).get("/api/articles/9999")
    .expect(404)
    .then((result)=>{
      expect(JSON.parse(result.text)).toEqual({"msg":"Article not found"})
    })
  });
})
describe('GET /api/articles',()=>{
  test('Should return 200',()=>{
    return superTest(app).get("/api/articles")
    .expect(200)
  })
  test('Should return object containing array of following properties ,author,title,article_id,topic,created_at,votes,article_img_urlcomment', () => {
    return superTest(app).get("/api/articles")
    .then((data)=>{
      expect(data.body.length).not.toBe(0)
      data.body.forEach(obj=>{
        expect(obj).toMatchObject({
          article_id:expect.any(Number),
          title:expect.any(String),
          topic:expect.any(String),
          author:expect.any(String),
          created_at:expect.any(String),
          votes:expect.any(Number),
          article_img_url:expect.any(String),
          comment_count:expect.any(Number)
        })
      })
    })
  });
  test('The articles should be sorted by date in descending order.',()=>{
    return superTest(app).get("/api/articles")
    .then((data)=>{
      // expect(data.body.treasures.created_at).toBeSortedBy({ descending: true })
      expect(data.body).toBeSortedBy('created_at',{descending: true });
      console.log(data.body)
    })
    
  })
})