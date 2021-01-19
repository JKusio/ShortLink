const errorHandler = require('../error');

class LinkService {
    constructor(LinkModel, LinksCounterModel) {
        this.LinkModel = LinkModel;
        this.LinksCounterModel = LinksCounterModel;

        this.characters =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
    }

    #checkIfURLIsCorrect = (URL) => {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' +
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
                '(\\?[;&a-z\\d%_.~+=-]*)?' +
                '(\\#[-a-z\\d_]*)?$',
            'i'
        );
        return pattern.test(URL);
    };

    #generateShortCode = (id) => {
        const shortURL = [];

        while (id) {
            shortURL.push(this.characters[id % this.characters.length]);
            id = parseInt(id / this.characters.length, 10);
        }

        shortURL.reverse();

        return shortURL.join('');
    };

    #checkIfCustomCodeIsCorrect = (code) => {
        for (let i = 0; i < code.length; i += 1) {
            if (!this.characters.includes(code[i])) return false;
        }
        return true;
    };

    async getAllLinks() {
        return this.LinkModel.find();
    }

    async createLink(
        URL,
        host,
        userID = undefined,
        customCode = undefined,
        linkExpirationDate = undefined
    ) {
        if (!this.#checkIfURLIsCorrect(URL))
            throw errorHandler.createBaseError(
                errorHandler.errorTypes.linkErrors.wrongURL,
                errorHandler.httpStatusCodes.BAD_REQUEST,
                true
            );

        const linksCounter = await this.LinksCounterModel.findOne();
        if (!linksCounter)
            throw errorHandler.createBaseError(
                errorHandler.errorTypes.serverErrors.linksCounterError,
                errorHandler.httpStatusCodes.INTERNAL_SERVER,
                false
            );

        if (customCode) {
            if (await this.LinkModel.exists({ code: customCode })) {
                throw errorHandler.createBaseError(
                    errorHandler.errorTypes.linkErrors.customURLTaken,
                    errorHandler.httpStatusCodes.BAD_REQUEST,
                    true
                );
            } else if (!this.#checkIfCustomCodeIsCorrect(customCode)) {
                throw errorHandler.createBaseError(
                    errorHandler.errorTypes.linkErrors.wrongCustomURL,
                    errorHandler.httpStatusCodes.BAD_REQUEST,
                    true
                );
            }
        }

        const linkCode =
            customCode || this.#generateShortCode(linksCounter.currentID);

        const link = new this.LinkModel({
            code: linkCode,
            originalURL: URL
        });

        if (linkExpirationDate) {
            const expDate = Date.parse(linkExpirationDate);
            if (Number.isNaN(expDate)) 
                throw errorHandler.createBaseError(
                    errorHandler.errorTypes.linkErrors.wrongExpirationDateFormat,
                    errorHandler.httpStatusCodes.BAD_REQUEST,
                    true
                );
            if (Date.now() >= expDate)
                throw errorHandler.createBaseError(
                    errorHandler.errorTypes.linkErrors.expirationDatePassed,
                    errorHandler.httpStatusCodes.BAD_REQUEST,
                    true
                );
            link.expirationDate = expDate;
        }

        if (userID) {
            link.userID = userID;
        }

        try {
            await link.save();

            if (!customCode) {
                linksCounter.currentID += 1;
                await linksCounter.save();
            }

            const { code, originalURL, creationDate, expirationDate } = link;

            return {
                code,
                originalURL,
                creationDate,
                expirationDate,
                completeURL: `${host}/${code}`
            };
        } catch (err) {
            link.remove();
            throw err;
        }
    }

    async getOriginalURL(code) {
        const link = await this.LinkModel.findOne({ code });

        if (!link)
            throw errorHandler.createBaseError(
                errorHandler.errorTypes.linkErrors.linkNotExisting,
                errorHandler.httpStatusCodes.BAD_REQUEST,
                true
            );

        if (Date.now() >= link.expirationDate)
            throw errorHandler.createBaseError(
                errorHandler.errorTypes.linkErrors.linkExpired,
                errorHandler.httpStatusCodes.BAD_REQUEST,
                true
            );

        return link.originalURL;
    }
}

module.exports = LinkService;
