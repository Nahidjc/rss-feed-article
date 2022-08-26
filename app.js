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
      if (articleViews) {
        filteredItemsFields[i].views = articleViews;
      }
    } catch (error) {
      console.error(error);
    }
  }
  await browser.close();
  fs.writeFileSync(fileName, JSON.stringify(filteredItemsFields));
})();

// const getArticleView = async (url) => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.goto(url);
//   await page.waitForNavigation({ waitUntil: "networkidle2" });
//   let data = await page.evaluate(() => {
//     let name = document.querySelector('span[class="post-actions__item-count"]').innerText;
//     return {
//       name,
//     };
//   });
//   console.log(data);
//   await browser.close();
// };

function isEquivalent(a, b) {
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
}
