const { default: axios } = require('axios');
const currentDate = new Date();
currentDate.setDate(currentDate.getDate());

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

const dateResult = `${year}-${month}-${day}`;

const typeCryptocurrencyId = 3;

const getPreviousHour = () => {
  const now = new Date();
  const prevHour = new Date(now.getTime() - 60 * 60 * 1000);
  const formatDate = (date) => {
    const twoDigits = (num) => (num < 10 ? '0' : '') + num;
    return (
      date.getFullYear() +
      '-' +
      twoDigits(date.getMonth() + 1) +
      '-' +
      twoDigits(date.getDate()) +
      'T' +
      twoDigits(date.getHours())
    );
  };
  return formatDate(prevHour);
};
const getNews = async (symbol, id, isNewAsset) => {
  const publishedAfter = getPreviousHour();
  const marketauxUrl =
    `${process.env.MARKET_AUX_URL}?api_token=${process.env.MARKET_AUX_TOKEN}&symbols=${symbol}&language=en&filter_entities=true&` +
    (isNewAsset
      ? `published_on=${dateResult}`
      : `pusblished_after=${publishedAfter}`);
  const allNews = await axios.get(marketauxUrl);
  const news = allNews.data.data.map((news) => {
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
  return news;
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
  typeCryptocurrencyId,
};
