const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
var assert = require('assert');

const faker = require('faker');
const BaseError = require('../error/baseError');
const userService = require('../services/userService');

describe('User service', () => {
  describe('When registering new user with wrong username', () => {
    it('Should return an array with one object with code 101', async () => {
      await expect(userService.registerUser(faker.internet.userName().substring(0, 4), faker.internet.email(), "StrongPassword#1"))
      .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
      .to.have.property(0).to.have.property('code', 101);
    });
  });
});