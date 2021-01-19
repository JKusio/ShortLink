class StatisticService {
    constructor(StatisticModel) {
        this.StatisticModel = StatisticModel;
    }

    async getAllStatistics() {
        return this.StatisticModel.find();
    }

    async createStatistic(referer, language, linkCode) {
        await this.StatisticModel.create({
            referer,
            language,
            linkCode
        });
    }
}

module.exports = StatisticService;
