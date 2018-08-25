let chai = require('chai');
let chaiHttp = require('chai-http')
let server = require('../../server');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);
//Routes
let messageRoute = '/message';
 
//Test Data
let updatedData ={
    'message' : 'hello world',
    'updatedMessage':'hello hello'
}
let invalidMessage = {
    'message': 121
}
let emptyDetails = {
    'message':'',
}
let correctDetails = {
    'message' : 'Hello world..!'
} 

//getMessage endpoint
describe('Route to get all messages ' + messageRoute, () => {
  it('should return all messages', (done) => {
    chai.request(server)
      .get(messageRoute)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});

//updateMessage endpoint
describe('Route to update message' + messageRoute, () => {
  it('with correct details should update message', (done) => {
    chai.request(server)
      .put(messageRoute)
      .send(updatedData)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('with non string data of message should return validation error',(done)=>{
      chai.request(server)
        .put(messageRoute)
        .send(invalidMessage)
        .end((err,res)=>{
            console.log(res.text);
            res.should.have.status(422);
            done();
        });
  });
});


//addMessage endpoint
describe('Route to add message' + messageRoute, () => {
  it('With empty or invalid details should return error', (done) => {
    chai.request(server)
      .post(messageRoute)
      .send(emptyDetails)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(422);
        done();
      });
  });
  it('With correct details should save data to database', (done) => {
    chai.request(server)
      .post(messageRoute)
      .send(correctDetails)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});