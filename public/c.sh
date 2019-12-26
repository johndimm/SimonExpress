cp src/app.jsx ../../react/t.jsx
cd ../../react
./node_modules/.bin/babel t.jsx > t.js
mv t.js ../express_hbs/public/js/app.js
