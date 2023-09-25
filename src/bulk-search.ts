import fs from 'fs/promises';
import getPage from './getDescription.js'

// Get first argument
const fileName = process.argv[2];
const file = await fs.readFile(fileName, 'utf-8');
for ( const url of file.split('\n')) {
    console.log('-------------------');
    console.log(`We are going to fetch to ${url}.`);
    const desc = await getPage(url);
    if (desc.length > 0) {
        console.log(`OK. length: ${desc.length}`);
    } else {
        console.log(`NG.`);
    }
    console.log('-------------------');
};
