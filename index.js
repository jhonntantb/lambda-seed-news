require('dotenv').config();
const { DataSource } = require('typeorm');
const newsSourceEntity = require('./model/news-source.entity');
const assetEntity = require('./model/asset.entity');
const assetType = require('./model/type.entity');
const { getNews, newsMapper } = require('./utils');

console.log('app', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const handler = async () => {
  const startTime = new Date();
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [newsSourceEntity, assetEntity, assetType],
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  });

  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
  try {
    const newsSourceRepository = AppDataSource.getRepository('news_source');
    const assetRepository = AppDataSource.getRepository('asset');

    const assets = await assetRepository.find({
      relations: ['assetType'],
    });
    const assetsPromise = assets.map((asset) => {
      const symbol =
        asset.assetType.id === 3 ? `CC:${asset.symbol}` : asset.symbol;
      return getNews(symbol, asset.id);
    });
    const dataNews = await Promise.all(assetsPromise);
    const newsToApi = dataNews.flat();
    const newsToSave = newsMapper(newsToApi);

    const newsInstances = newsToSave.map((news) =>
      newsSourceRepository.create(news)
    );
    await newsSourceRepository.save(newsInstances);
    const endTime = new Date();

    console.log(endTime - startTime);
  } catch (error) {
    console.log(error.message);
  }
};

handler();
