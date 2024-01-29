const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
const { default: axios } = require('axios');

const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // El mes es de 0 a 11, por lo que es necesario sumar 1
const day = String(currentDate.getDate()).padStart(2, '0');

const dateResult = `${year}-${month}-${day}`;

const getNews = async (symbol) => {
  const url1 = `${process.env.MARKET_AUX_URL}&symbol=${symbol}&published_on=${dateResult}`;
  const url2 = `${process.env.NEWS_API_URL}&q=${symbol}&to=${dateResult}&pageSize=5`;
  const response1 = await axios.get(url1);
  const response2 = await axios.get(url2);
  const news1 = response1.data.data.map((news) => {
    return {
      source: news.source,
      url: news.url,
      title: news.title,
      published_at: news.published_at,
      description: news.description,
    };
  });

  const news2 = response2.data.articles.map((news) => {
    return {
      source: news.source.name,
      url: news.url,
      title: news.title,
      published_at: news.publishedAt,
      description: news.description,
    };
  });
  return [...news1, ...news2];
};

const mapperNews = (newsArr, id) =>
  newsArr.map((el) => {
    return {
      source: el.source,
      asset_id: id,
      url: el.url,
      title: el.title,
      published_at: el.published_at,
      description: el.description,
    };
  });

module.exports = {
  dateResult,
  getNews,
  mapperNews,
};
