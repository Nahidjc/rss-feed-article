const puppeteer = require("puppeteer");
const fs = require("fs");
const parser = require("rss-url-parser");

(async function main() {
  const feed = await parser("https://cointelegraph.com/rss");
  let items = [];
  const today = new Date().getTime();
  var date = new Date();
  const lastSeventhDate = date.setDate(date.getDate() - 7);

  const fileName = `${today}.json`;
  if (fs.existsSync(fileName)) {
    items = require(`./${fileName}`);
  }

  feed.forEach(async (item) => {
    const publicationDate = new Date(item.pubDate);
    const publicationDateTimestamp = publicationDate.getTime();
    if (publicationDateTimestamp > lastSeventhDate) {
      items.push(item);
    }
  });

  let filteredItemsFields = items.map((item) => {
    return {
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: item.pubDate,
      author: item.author,
    };
  });

  let articles = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let i = 0; i < filteredItemsFields.length; i++) {
    try {
      await page.goto(filteredItemsFields[i].link);
      const articleViews = await page.evaluate(() => {
        const view = document.querySelector(
          'span[class="post-actions__item-count"]'
        ).innerText;
        return view;
      });
      console.log(articleViews ? true : false);
      if (articleViews) {
        filteredItemsFields[i].views = articleViews;
        articles.push(filteredItemsFields[i]);
      }
    } catch (error) {
      console.error(error);
    }
  }
  await browser.close();
  articles.sort((a, b) => {
    return b.views - a.views;
  });
  console.log(filteredItemsFields.length);
  console.log(articles.length);
  fs.writeFileSync(fileName, JSON.stringify(articles.slice(0, 20)));
})();
