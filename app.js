const puppeteer = require("puppeteer");
const fs = require("fs");
const Parser = require("rss-parser");
const parsers = require("rss-url-parser");
const parser = new Parser();
(async function main() {
  // const feed = await parser.parseURL(
  //   "https://rss.app/feeds/ncrSJ6Q02SJyTkXe.xml"
  // );
  const data = await parsers("https://cointelegraph.com/rss");
  data.forEach((item) => console.log(item));
  const feed = await parser
    .parseURL("https://www.reddit.com/.rss")
    .catch((e) => console.log(e));

  let items = [];

  const today = new Date().getTime();
  var date = new Date();
  const lastSeventhDate = date.setDate(date.getDate() - 1);

  // const fileName = `${feed.title
  //   .replace(/\s+/g, "-")
  //   .replace(/[/\\?%*:|"<>]/g, "")
  //   .toLowerCase()}${today}.json`;
  // const fileName = `${today}.json`;
  // console.log("FileName", fileName);

  // if (fs.existsSync(fileName)) {
  //   console.log(true);
  //   items = require(`./${fileName}`);
  // }

  // await Promise.all(
  //   feed.items.map(async (currentItem) => {
  //     if (items.filter((item) => isEquivalent(item, currentItem)).length <= 0) {
  //       const publicationDate = new Date(currentItem.pubDate);
  //       const publicationDateTimestamp = publicationDate.getTime();
  //       if (publicationDateTimestamp > lastSeventhDate) {
  //         items.push(currentItem);
  //       }
  //     }
  //   })
  // );

  // fs.writeFileSync(fileName, JSON.stringify(items));
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
