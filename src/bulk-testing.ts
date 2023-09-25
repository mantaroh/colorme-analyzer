import fs from 'fs/promises';
import getPage from './getDescription.js'

// Get first argument
const fileName = process.argv[2];
const file = await fs.readFile(fileName, 'utf-8');
for ( const url of file.split('\n')) {
    console.log('-------------------');
    console.log(url);
    const resp = await fetch(url);
    if (resp.status !== 200) {
        console.log(`Failed to fetch ${url}`);
        break;
    }
    const html = await resp.text();
    // console.log(html);
    
    // get URL which has 'pid=' from html string
    const regex = /http[s]:\/\/.*pid=\d+/g;
    const urls = html.match(regex);
    if (!urls) {
        console.log(`Failed to get urls from ${url}`);
        // break;
    } else {
        // console.log(urls);

        console.log(`We are going to fetch to ${urls[0]}.`);
        const desc = await getPage(urls[0]);
        console.log(desc);
    }
    console.log('-------------------');
};
