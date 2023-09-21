import puppeteer from 'puppeteer-core';


const getPage = async (url: string) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        // args: ['--no-sandbox', '--disable-setuid-sandbox', '--auto-open-devtools-for-tabs' ]
    });
    const page = await browser.newPage();
    // goto specific url
    await page.goto(url, {
        waitUntil: 'load',
    });
    // await page.screenshot({ path: 'screenshot.png'});

    page
    .on('console', message => {
        const stackTrace = message.stackTrace();
        if (stackTrace.length > 0) {
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()} ${message.stackTrace()[0].url}:${message.stackTrace()[0].lineNumber}:${message.stackTrace()[0].columnNumber}`);
        } else {
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
        }
    })
    .on('pageerror', ({ message }) => console.log(message))
    .on('response', response =>
      console.log(`${response.status()} ${response.url()}`));

    let itemExplainContent = "";
    await page.exposeFunction('setColormeItemExplainer', (msg: string) => {
        itemExplainContent = msg;
        return;
    });
    await page.evaluate(() => {
        try {
            console.log("HEEEELLLLO1");
            // デフォルトテーマでの商品説明
            const plainExplain = document.querySelectorAll('.p-product-explain__body');
            if (plainExplain.length > 0) {
                // @ts-ignore
                window.setColormeItemExplainer(plainExplain[0].innerHTML);
                return;
            }
    
            // カスタムテーマの場合、商品説明のHTMLを取得するため総当りで探してみる        
            const generateClassList = () => {
                // WILDCARD
                const PATTERN_LIST = [
                    'exp',
                    'Exp',
                    'explain',
                    'Explain',
                    'description',
                    'Description',
                    'desc',
                    'Desc',
                    'entry-content',
                ]
                const classList = [];
                for (const pattern of PATTERN_LIST) {
                    classList.push(`[class*="${pattern}"]`);
                }

                // EXACTLLY MATCH (2文字以下、比較的他のクラスと区別がつかなそうなものはこちら)
                const PATTERN_LIST2 = [
                    'ex',
                    'txt',
                    'text',
                ];
                for (const pattern of PATTERN_LIST2) {
                    classList.push(`.${pattern}`);
                }
                return classList.join(', ');
            };
            const alternativeExplain2 = document.querySelectorAll(generateClassList());
            if (alternativeExplain2.length > 0) {
                // @ts-ignore
                window.setColormeItemExplainer(alternativeExplain2[0].innerHTML);
                return;
            }
    
            // @ts-ignore
            window.setColormeItemExplainer("Nothing....");
        } catch(e) {
            console.log(e);
        }
    });

    console.log(`itemExplainContent: ${itemExplainContent}`);

    await browser.close();
    return "OK";
}


const url = process.argv[2];
if (!url) {
    console.log("URL is required!");
    process.exit(1);
}

console.log(`We are going to fetch to ${url}.`);
const ret = await getPage(url);
console.log(ret);

