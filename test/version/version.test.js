let chai = require('chai');
let chaiHttp = require('chai-http')
let server = require('../../server');
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);
let server = 'http://185.181.10.185:9090';

let appCode = {
  'appCode': 'SLC'
}
let currentVersionDetails = {
  'version': '1.0.1',
  'appCode': 'SLC'
}
let correctDetails = {
  'version': '0.1',
  'fileUrl': 'ironman0x7b2/versions.git',
  'appCode': 'SLC'
}
let emptyDetails = {
  'version': '',
  'fileUrl': '',
  'appCode': ''
}
let alreadyExists = {
  'version': '0.1',
  'fileUrl': 'ironman0x7b2/versions.git',
  'appCode': 'SNC'
}
//routes
let listUpdatedVersionsRoute = '/version/updated';
let listAllVersionsRoute = '/version/list';
let latestVersionRoute = '/version/latest';
let addVersionRoute = '/version';
//list all updated versions
describe('Route to list all versions ' + listUpdatedVersionsRoute, () => {
  it('should return all available versions', (done) => {
    chai.request(server)
      .get(listUpdatedVersionsRoute)
      .query(currentVersionDetails)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
//list all versions route
describe('Route to list all versions ' + listAllVersionsRoute, () => {
  it('should return all available versions', (done) => {
    chai.request(server)
      .get(listAllVersionsRoute)
      .query(appCode)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
//latest version route
describe('Route to check latest version' + latestVersionRoute, () => {
  it('should return latest version', (done) => {
    chai.request(server)
      .get(latestVersionRoute)
      .query(appCode)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
});
//add version details //
describe('Route to add version data' + addVersionRoute, () => {
  it('With empty or invalid version details should return error', (done) => {
    chai.request(server)
      .post(addVersionRoute)
      .send(emptyDetails)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With correct details should save data to database', (done) => {
    chai.request(server)
      .post(addVersionRoute)
      .send(correctDetails)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
  });
  it('With existing version details should return error', (done) => {
    chai.request(server)
      .post(addVersionRoute)
      .send(alreadyExists)
      .end((err, res) => {
        console.log(res.text);
        res.should.have.status(400);
        res.body.should.be.a('object');
        done();
      });
  });
});