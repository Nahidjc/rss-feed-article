const fs = require("fs");
const Parser = require("rss-parser");

(async function main() {
  const parser = new Parser();

  const feed = await parser.parseURL(
    "http://www.espncricinfo.com/rss/livescores.xml"
  );
  console.log(feed);

  let items = [];

  const today = new Date().getTime();
  var date = new Date();
  const lastSeventhDate = date.setDate(date.getDate() - 10);

  const fileName = `${feed.title
    .replace(/\s+/g, "-")
    .replace(/[/\\?%*:|"<>]/g, "")
    .toLowerCase()}${today}.json`;

  if (fs.existsSync(fileName)) {
    items = require(`./${fileName}`);
  }

  await Promise.all(
    feed.items.map(async (currentItem) => {
      if (items.filter((item) => isEquivalent(item, currentItem)).length <= 0) {
        const publicationDate = new Date(currentItem.pubDate);
        const publicationDateTimestamp = publicationDate.getTime();
        items.push(currentItem);
        // if (publicationDateTimestamp > lastSeventhDate) {
        //   items.push(currentItem);
        // }
      }
    })
  );

  fs.writeFileSync(fileName, JSON.stringify(items));
})();

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
