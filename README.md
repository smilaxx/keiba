# 環境構築メモ

windowsでwslをinstall

```
# power shell
wsl --install
```

user名とpwを入力する

wslはpower shell から `wsl` と入力すればubuntu環境にはいれる

npmも何もない環境だったので、package.jsonを作成することができず、そこもdocker環境で構築することにした

```
docker compose run --rm frontend npx create-vite . --template react --force
```

選択肢が表示される場合は
remove exists ... を選択

Use rolldown-vite ... が表示される場合は
NO

その後 `docekr compose up --build` して、問題なければよい

# ngrokのinstall
公式サイトからmicrosoft appなどからinstallできると書いてあったが、ウイルスソフトなどの影響かexeファイルが動作しなかったので、wsl内部にinstallすることにした

公式サイトのLinux installの部分から、コマンドをコピーして、実行
認証も登録して終わり

## ngrokの利用
wsl 内で、

```
ngrok http port_num
```
で利用可能

# スマホなどで開くために

viteのconfigにallowhostの設定があるので、そこを true にして、すべてを許可にした
ベストプラクティスとしては、特定のhostにするべきだが、開発中専用なのでいったん

あとはdockerコンテナを立ち上げて、URLにアクセスすればよい

# 構成メモ
- frontend

react

- backend

python

画像保存はminioを使ってs3っぽく利用できるように
DBは今のところ考えてない。スプシとかを利用してもよさそう
