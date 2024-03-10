const superTest = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");
const supertest = require("supertest");

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
      const response = data.body;
      expect(response.length).not.toBe(0)
      response.forEach(obj=>{
        expect(obj).toMatchObject({
          author:expect.any(String),
          title:expect.any(String),
          article_id:expect.any(Number),
          topic:expect.any(String),
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
      expect(data.body).toBeSortedBy('created_at',{descending: true });
    })
  })
  test('Testing for object with topic of cats',()=>{
    return superTest(app).get("/api/articles?topic=cats")
    .expect(200)
    .then((data)=>{
      const response = data.body[0].topic
      expect(response).toBe('cats')
    })
  })
  test('Testing for object with topic of mitch',()=>{
    return superTest(app).get("/api/articles?topic=mitch")
    .expect(200)
    .then((data)=>{
      expect(data.body.length).not.toBe(0);
      data.body.forEach(comment=>{
        expect(comment).toMatchObject({
          title: expect.any(String),
          topic: 'mitch',
          author: expect.any(String),
          created_at: expect.any(String),
          article_img_url:expect.any(String),
        })
      })
    })
  })
  test('Return status 200 and empty array for a topic which exist with no articles',()=>{
    return superTest(app).get("/api/articles?topic=paper")
    .expect(200)
    .then((data)=>{
      const response = data.body;
      expect(response.length).toBe(0)
    })
  })
  test('Should return a 404 when does not exist in database',()=>{
    return superTest(app).get("/api/articles?topic=1")
    .expect(404)
    .then((data)=>{
      // console.log(data.body,'--from test')
      const response = data.body;
      expect(response.msg).toBe("Article not found")
    })
  })
  test('topic should return all topics',()=>{
    return superTest(app).get("/api/articles?topic=mitch")
    .expect(200)
  })
})
describe('api/articles/:article_id/comments', () => {
  test('returns 200', () => {
    return superTest(app).get("/api/articles/1/comments")
    .expect(200)
  });
  test('should return allproperties associated with comments', () => {
    return superTest(app).get("/api/articles/1/comments")
    .expect(200)
    .then((data)=>{
      expect(data.body.length).not.toBe(0)
      data.body.forEach(obj=>{
        expect(obj).toMatchObject({
          comment_id:expect.any(Number),
          body:expect.any(String),
          article_id:expect.any(Number),
          author:expect.any(String),
          author:expect.any(String),
          votes:expect.any(Number),
          created_at:expect.any(String)
        })
      })
    })
  });
  test('Should return all articles associated with :article_id of 1',()=>{
    return superTest(app).get("/api/articles/5/comments")
    .expect(200)
  })
  test('Comments should be served with the most recent comments first.', () => {
    return superTest(app).get("/api/articles/5/comments")
    .then((data)=>{
      expect(data.body).toBeSortedBy('created_at',{descending: true });
    })
  });
  test('should return 400 when id is not a number', () => {
    return superTest(app).get("/api/articles/forklift/comments")
    .expect(400)
  });
  test('Should return 404 when id does not exist',()=>{
    return superTest(app).get("/api/articles/55/comments")
    .expect(404)
  })
  test('Should return status 200 and empty array when id does exist', () => {
    return superTest(app).get("/api/articles/2/comments")
    .expect(200)
    .then((data)=>{
      expect(data.body.length).toBe(0)
    })
  });
});
describe('POST /api/articles/:article_id/comments', () => {
  test('should return 201 when successfully posted', () => {
    return superTest(app).post("/api/articles/1/comments").send({username:'icellusedkars',body:' testing bla bla bla'})
    .expect(201)
    .then((result)=>{
      expect(result.body.length).not.toBe(0);
      result.body.forEach(comment=>{
        expect(comment).toMatchObject({
          comment_id:19,
          body:' testing bla bla bla',
          article_id:1,
          author:'icellusedkars',
          votes:0,
          created_at:expect.any(String)
        })
      })
    })
  });
  test('Testing for incorrect author should return 404 not found', () => {
    return superTest(app).post("/api/articles/1/comments").send({username:'phil',body:' testing bla bla bla'})
    .expect(404)
    .then((result)=>{
      expect(result.body.msg).toBe('Invalid input')
    });
  })
  test('testing for bad request 400 status', () => {
    return superTest(app).post("/api/articles/forklift/comments").send({username:'icellusedkars',body:' testing bla bla bla'})
    .expect(400)
    .then((result)=>{
      expect(result.body.msg).toBe('Bad request')
    })
  });
})
describe('PATCH /api/articles/:article_id',()=>{
  test('should update the votes by adding votes on the selected article', () => {
    const updateVotes = { inc_votes: 123 };
    return superTest(app).patch('/api/articles/1')
    .send(updateVotes)
    .expect(200)
    .then((response)=>{
      expect(response.body.length).not.toBe(0);
      response.body.forEach(comment=>{
        expect(comment).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 223,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      })
    })
  });
  test('should update the votes by subtracting negative votes on the selected article', () => {
    const updateVotes = { inc_votes: -50 };
    return superTest(app).patch('/api/articles/1')
    .send(updateVotes)
    .expect(200)
    .then((response)=>{
      expect(response.body.length).not.toBe(0);
      response.body.forEach(comment=>{
        expect(comment).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 50,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        })
      })
    })
  });
  test('should return a 400 status if passed no votes to update', () => {
    const updateVotes = { inc_votes: 0 };
    return superTest(app)
      .patch('/api/articles/2')
      .send()
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      })
  });
  test('should return a 400 error if the article_id is invalid', () => {
    const updateVotes = { inc_votes: 123 };
    return supertest(app)
      .patch('/api/articles/invalidArticleID')
      .send(updateVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad request');
      });
  });
  test('should return a 404 error if the article_id is', () => {
    const updateVotes = { inc_votes: 123 };
    return superTest(app)
      .patch('/api/articles/999')
      .send(updateVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
})
describe('DELETE /api/comments/:comment_id',()=>{
  test('should return 204 for deleted comment', () => {
    return superTest(app)
    .delete('/api/comments/1')
    .send()
    .expect(204);
  });
  test('should return 404 if comment does not exist', () => {
    return superTest(app)
    .delete('/api/comments/999')
    .send()
    .expect(404)
    .then((response)=>{
      expect(response.body.msg).toBe("Article not found");
    })
  });
  test('should return 400 if comment does not exist', () => {
    return superTest(app)
    .delete('/api/comments/invalidArticleID')
    .send()
    .expect(400)
    .then((response)=>{
      expect(response.body.msg).toBe("Bad request");
    })
  });
})

describe('GET /api/users',()=>{
  test('should return 200', () => {
    return superTest(app).get('/api/users')
    .expect(200)
  });
  test('Should return object with given properties',()=>{
    return superTest(app).get('/api/users')
    .expect(200)
    .then((data)=>{
      expect(data.body.length).not.toBe(0);
      expect(data.body.length).toBe(4)
      data.body.forEach(user=>{
        expect(user).toMatchObject({
          username:expect.any(String),
          name:expect.any(String),
          avatar_url:expect.any(String)
        })
      })
    })
  })
  test('should return 404 when not found', () => {
    return superTest(app).get('/api/forklift')
    .expect(404)
    .then((result)=>{
      expect(result.body.msg).toBe("404 error")
    })
  });
})









