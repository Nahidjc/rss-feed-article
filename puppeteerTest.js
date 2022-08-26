const puppeteer = require("puppeteer");
const rssUrlParser = require("rss-url-parser");

// (async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     const url =
//       "https://cointelegraph.com/news/ethereum-dev-addresses-node-centralization-concerns-in-runup-to-the-merge";
//     console.log(url);
//     await page.goto(`${url}`);
//     await page.waitForNavigation({ waitUntil: "networkidle2" });
//     let data = await page.evaluate(() => {
//       let views = document.querySelector(
//         'span[class="post-actions__item-count"]'
//       ).innerText;
//       return {
//         views,
//       };
//     });
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// })();

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const urls = [
    "https://cointelegraph.com/news/ethereum-dev-addresses-node-centralization-concerns-in-runup-to-the-merge",
    "https://cointelegraph.com/news/bitcoin-price-taps-21-3k-ahead-of-fed-chair-powell-jackson-hole-speech",
    "https://cointelegraph.com/news/cardano-hard-fork-ever-closer-as-upgraded-spos-account-for-42-of-blocks",
  ];
  for (let i = 0; i < urls.length; i++) {
    try {
      await page.goto(urls[i]);
      const data = await page.evaluate(() => {
        const items = document.querySelector(
          'span[class="post-actions__item-count"]'
        ).innerText;
        return items;
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
})();
