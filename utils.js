const { default: axios } = require('axios');
const currentDate = new Date();
currentDate.setDate(currentDate.getDate());

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

const dateResult = `${year}-${month}-${day}`;

const getNews = async (symbol, id) => {
  const url1 = `${process.env.MARKET_AUX_URL}?api_token=${process.env.MARKET_AUX_API}&symbols=${symbol}&published_on=${dateResult}&language=en&filter_entities=true`;
  const response1 = await axios.get(url1);
  const news1 = response1.data.data.map((news) => {
    return {
      source: news.source,
      url: news.url,
      asset_id: id,
      title: news.title,
      published_at: news.published_at,
      description: news.description,
      status: 'created',
    };
  });
  return news1;
};

const newsMapper = (arr) => {
  const urlUnique = {};
  const arrFiltering = arr.filter((el) => {
    if (!urlUnique[el.url]) {
      urlUnique[el.url] = true;
      return true;
    }
    return false;
  });
  return arrFiltering;
};

module.exports = {
  dateResult,
  getNews,
  newsMapper,
};
