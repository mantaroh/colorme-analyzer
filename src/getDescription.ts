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

    // デバッグ用、ヘッドレスのコンソール出力
    // page
    // .on('console', message => {
    //     const stackTrace = message.stackTrace();
    //     if (stackTrace.length > 0) {
    //         console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()} ${message.stackTrace()[0].url}:${message.stackTrace()[0].lineNumber}:${message.stackTrace()[0].columnNumber}`);
    //     } else {
    //         console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
    //     }
    // })
    // .on('pageerror', ({ message }) => console.log(message))
    // .on('response', response =>
    //   console.log(`${response.status()} ${response.url()}`));

    let itemExplainContent = "";
    await page.exposeFunction('setColormeItemExplain', (msg: string) => {
        itemExplainContent = msg;
        return;
    });
    const result = await page.evaluate(() => {
        try {
            let explainContent = "";
            // デフォルトテーマでの商品説明
            const plainExplain = document.querySelectorAll('.p-product-explain__body');
            if (plainExplain.length > 0) {
                plainExplain.forEach((e) => {
                    if (e.innerHTML.length > explainContent.length) {
                        explainContent = e.innerHTML;
                    }
                });
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
            const alternativeExplain = document.querySelectorAll(generateClassList());
            if (alternativeExplain.length > 0) {
                alternativeExplain.forEach((e) => {
                    const content = e.innerHTML;
                    if (content.length > explainContent.length) {
                        explainContent = content;
                    }
                });
            }
            // @ts-ignore
            window.setColormeItemExplain(explainContent);
        } catch(e) {
            console.log(e);
        }
    });

    await browser.close();
    return itemExplainContent;
}

export default getPage;