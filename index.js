require('dotenv').config();
const express = require('express');
const { DataSource, QueryBuilder } = require('typeorm');
const pulseEntity = require('./model/pulse.entity');
const assetEntity = require('./model/asset.entity');
const { getNews, mapperNews } = require('./utils');

const app = express();

async function initData() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [pulseEntity, assetEntity],
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
  const pulseRepository = AppDataSource.getRepository('pulse');
  const asstRespository = AppDataSource.getRepository('asset');

  const assets = await asstRespository.find();

  for (const asset of assets) {
    const data = await getNews(asset.symbol);
    const newData = mapperNews(data, asset.id);
    const newsInstances = newData.map((news) => pulseRepository.create(news));
    for (const instance of newsInstances) {
      await pulseRepository.save(instance);
    }
  }
}
initData();
app.use(express.json());

app.listen(8081, () => {
  console.log('listing');
});
