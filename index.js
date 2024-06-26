require('dotenv').config();
const { DataSource } = require('typeorm');
const newsSourceEntity = require('./model/news-source.entity');
const assetEntity = require('./model/asset.entity');
const assetType = require('./model/type.entity');
const { getNews, newsMapper, typeCryptocurrencyId } = require('./utils');

exports.handler = async (event) => {
  const id = event?.queryStringParameters
    ? event.queryStringParameters.id
    : null;
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [newsSourceEntity, assetEntity, assetType],
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await AppDataSource.initialize();

    const newsSourceRepository = AppDataSource.getRepository('news_source');
    const assetRepository = AppDataSource.getRepository('asset');
    let options;
    if (id) {
      options = { where: { id } };
    }
    const assets = await assetRepository.find({
      ...options,
      relations: ['assetType'],
    });

    const assetsPromise = assets.map((asset) => {
      const symbol =
        asset.assetType.id === typeCryptocurrencyId
          ? `CC:${asset.symbol.split('/')[0]}`
          : asset.symbol;
      return getNews(symbol, asset.id, id);
    });
    const dataNews = await Promise.all(assetsPromise);
    const newsToApi = dataNews.flat();
    const newsToSave = newsMapper(newsToApi);
    const newsInstances = newsToSave.map((news) =>
      newsSourceRepository.create(news)
    );
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(newsSourceEntity)
      .values(newsInstances)
      .orIgnore()
      .execute();
  } catch (error) {
    console.log(error.message);
  }
};
