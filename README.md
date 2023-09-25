# How to run?

## 1サイトごと

```bash
> yarn install
> yarn start https://www.xxxxxx.co.jp/?pid=12345678

<output here>
```
## クローリング

トップページを指定したテキストを用意して、そのページに含まれる `pid` のアドレスを探して、最初に見つかったページを商品サイトとして説明文が取れるか試します。

```bash
> yarn build
> node/dist/bulk-testing.js test-site.txt
```

※トップページから商品ページに辿れないケースだと、NG になる

## バルクサーチ

テキストに記載された商品ページURLから、説明文が取れるか試します。

```bash
> yarn build
> node dist/bulk-search.js test-product-urls.txt
```
