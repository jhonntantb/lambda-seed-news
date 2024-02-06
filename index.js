require('dotenv').config();
const { DataSource } = require('typeorm');
const newsSourceEntity = require('./model/news-source.entity');
const assetEntity = require('./model/asset.entity');
const { getNews } = require('./utils');

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
    entities: [newsSourceEntity, assetEntity],
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
    const pulseRepository = AppDataSource.getRepository('news_source');
    const assetRepository = AppDataSource.getRepository('asset');

    const assets = await assetRepository.find();

    const assetsPromise = assets.map((asset) =>
      getNews(asset.symbol, asset.id)
    );
    const dataNews = await Promise.all(assetsPromise);
    const pulsesToSave = dataNews.flat().filter((e) => e.description !== null);
    console.log(pulsesToSave);
    const newsInstances = pulsesToSave.map((news) =>
      pulseRepository.create(news)
    );
    await pulseRepository.save(newsInstances);
    const endTime = new Date();

    console.log(endTime - startTime);
  } catch (error) {
    console.log(error.message);
  }
};

handler();
