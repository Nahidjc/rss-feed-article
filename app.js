const puppeteer = require("puppeteer");
const fs = require("fs");
const parser = require("rss-url-parser");

(async function main() {
  const feed = await parser("https://cointelegraph.com/rss");
  let items = [];
  var date = new Date();
  const lastSeventhDate = date.setDate(date.getDate() - 7);

  const fileName = `cointelegraph.json`;
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

  let filterArticleFields = items.map((item) => {
    return {
      title: item.title,
      description: item.description,
      link: item.link,
      pubDate: item.pubDate,
      author: item.author,
    };
  });
  var flags = [],
    output = [],
    l = filterArticleFields.length,
    i;
  for (i = 0; i < l; i++) {
    if (flags[filterArticleFields[i].link]) {
      continue;
    }
    flags[filterArticleFields[i].link] = true;
    output.push(filterArticleFields[i]);
  }
  filterArticleFields = output;

  let articles = [];
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let i = 0; i < filterArticleFields.length; i++) {
    try {
      await page.goto(filterArticleFields[i].link);
      const articleViews = await page.evaluate(() => {
        const view = document.querySelector(
          'span[class="post-actions__item-count"]'
        ).innerText;
        return view;
      });
      if (articleViews) {
        filterArticleFields[i].views = articleViews;
        articles.push(filterArticleFields[i]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  await browser.close();
  articles.sort((a, b) => {
    return b.views - a.views;
  });

  fs.writeFileSync(fileName, JSON.stringify(articles.slice(0, 20)));
})();
