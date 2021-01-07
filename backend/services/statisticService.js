const Statistic = require('../model/statistic'); 
// Error handling
const BaseError = require('../errors/baseError');
const errorTypes = require('../errors/errorTypes');
const httpStatusCodes = require('../errors/httpStatusCodes');

class StatisticService {
    async getAllStatistics() {
        return await Statistic.find();
    }

    async createStatistic(referer, language, linkCode) {
        await Statistic.create({
            referer,
            language,
            linkCode
        });
    }
}

module.exports = new StatisticService();