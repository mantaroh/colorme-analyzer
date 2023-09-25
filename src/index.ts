import getPage from './getDescription.js';

const url = process.argv[2];
if (!url) {
    console.log("URL is required!");
    process.exit(1);
}

console.log(`We are going to fetch to ${url}.`);
const ret = await getPage(url);
console.log(ret);
