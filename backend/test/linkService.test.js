const chai = require('chai');
chai.use(require('chai-as-promised'));
const faker = require('faker');
const BaseError = require('../error/baseError');
const LinkService = require('../service/linkService');
const LinkModel = require('../model/link');
const LinksCounterModel = require('../model/linksCounter');
const { connect, clearDatabase, closeDatabase } = require('./dbHandler');
const mongoose = require('mongoose');

const expect = chai.expect;

describe('Link service tests', () => {
    beforeEach(async () => await connect());
    afterEach(async() => await clearDatabase());
    after(async() => await closeDatabase());

    describe('When creating link with bad URL', () => {
        it('Should return an BaseError with code 301', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);

            await expect(linkService.createLink("bad-url"))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 301);
        });
    });

    describe('When there is no LinksCounter object in database', () => {
        it('Should return an BaseError with code 402', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel)

            await expect(linkService.createLink(faker.internet.url()))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 402);
        });
    });

    describe('When creating link with bad custom code', () => {
        it('Should return an BaseError with code 303', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            const linksCounter = new LinksCounterModel({
                currentID: 4096
            });
            await linksCounter.save();

            const host = `${faker.internet.protocol()}://${faker.internet.domainName()}`;

            await expect(linkService.createLink(faker.internet.url(), host, null, '``````'))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 303);
        });
    });

    describe('When creating link with bad expiration date format', () => {
        it('Should return an BaseError with code 304', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            const linksCounter = new LinksCounterModel({
                currentID: 4096
            });
            await linksCounter.save();

            const host = `${faker.internet.protocol()}://${faker.internet.domainName()}`;

            await expect(linkService.createLink(faker.internet.url(), host, null, null, faker.lorem.paragraph(3)))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 304);
        });
    });

    describe('When creating link with expiration date that already passed', () => {
        it('Should return an BaseError with code 305', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            const linksCounter = new LinksCounterModel({
                currentID: 4096
            });
            await linksCounter.save();

            const host = `${faker.internet.protocol()}://${faker.internet.domainName()}`;

            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            await expect(linkService.createLink(faker.internet.url(), host, null, null, yesterday.toDateString()))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 305);
        });
    });

    describe('When creating link with custom code that is already taken', () => {
        it('Should return an BaseError with code 302', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            const linksCounter = new LinksCounterModel({
                currentID: 4096
            });
            await linksCounter.save();
        
            const host = `${faker.internet.protocol()}://${faker.internet.domainName()}`;

            const randomCode = faker.random.alphaNumeric();

            await linkService.createLink(faker.internet.url(), host, null, randomCode);

            await expect(linkService.createLink(faker.internet.url(), host, null, randomCode))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 302);
        });
    });

    describe('When creating link with userID, asking for this link should have user attached', () => {
        it('Should return a link with userID attached', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            const linksCounter = new LinksCounterModel({
                currentID: 4096
            });
            await linksCounter.save();
        
            const host = `${faker.internet.protocol()}://${faker.internet.domainName()}`;
            const userID = mongoose.Types.ObjectId();

            await linkService.createLink(faker.internet.url(), host, userID);
            const createdLink = await LinkModel.findOne();

            expect(`${userID}` === `${createdLink.userID}`).to.eql(true);
        });
    });

    describe('When creating new link, linksCounter currentID should change', () => {
        it('Should return linksCounter currentID bigger by one', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            let linksCounter = new LinksCounterModel({
                currentID: 4096
            });
            await linksCounter.save();
        
            const host = `${faker.internet.protocol()}://${faker.internet.domainName()}`;

            const before = linksCounter.currentID;
            await linkService.createLink(faker.internet.url(), host);
            linksCounter = await LinksCounterModel.findOne();
            const after = linksCounter.currentID;
            expect(after - before).to.eql(1);
        });
    });

    describe('When creating new link, getAllLinks should return an array bigger than before adding', () => {
        it('Should return an array of links bigger by one', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            let linksCounter = new LinksCounterModel({
                currentID: 4096
            });
            await linksCounter.save();
        
            const host = `${faker.internet.protocol()}://${faker.internet.domainName()}`;
            const before = await linkService.getAllLinks();
            await linkService.createLink(faker.internet.url(), host);
            linksCounter = await LinksCounterModel.findOne();
            const after =  await linkService.getAllLinks()

            expect(after.length - before.length).to.eql(1);
        });
    });

    describe('When trying to get original URL from link code that does not exist', () => {
        it('Should return an BaseError with code 306', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            const randomCode = faker.random.alphaNumeric(32);
            
            await expect(linkService.getOriginalURL(randomCode))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 306);
        });
    });

    describe('When trying to get original URL with expired link', () => {
        it('Should return an BaseError with code 307', async () => {
            const linkService = new LinkService(LinkModel, LinksCounterModel);
            const randomCode = faker.random.alphaNumeric(32);
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const originalURL = `${faker.internet.protocol()}://${faker.internet.domainName()}`;

            const link = new LinkModel({
                code: randomCode,
                expirationDate: yesterday,
                originalURL
            });

            await link.save();

            await expect(linkService.getOriginalURL(randomCode))
            .to.be.eventually.rejectedWith(BaseError).with.property("errorTypes")
            .to.have.property(0).to.have.property('code', 307);
        });
    });
});