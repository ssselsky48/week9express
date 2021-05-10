import pug from 'pug';

export default (express, bodyParser, createReadStream, writeFileSync, crypto, http, m, User, puppeteer) => {
    const app = express();

    var urlencodedParser = bodyParser.urlencoded({ extended: false });

    var json_parser = bodyParser.json();

    app

    .use((req, res, next) => {
      res.append('Access-Control-Allow-Origin', ['*']);
      res.append('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
      res.append('Access-Control-Allow-Headers', '*');
      next();
  })

    .use(bodyParser.json())

    .all('/login/', (req, res) => {
        res.end("nikird");
    })

    .all('/code/', (req, res) => {
        res.set({ 'Content-Type': 'text/plain; charset=utf-8' });
        createReadStream(import.meta.url.substring(7)).pipe(res);
    })

    .get('/sha1/:input', r => {
        const shasum = crypto.createHash('sha1');
        shasum.update(r.params.input);
        r.res.send(shasum.digest('hex')); 
    })

    .get('/req/', (req, res) => {
        const url = req.query.addr;
        http.get(String(url), response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            })
            response.on('end', () => {
                res.end(data);
            })
        })
    })

    .get('/wordpress/*', (req, res) => {
        console.log('http://f0539855.xsph.ru/wordpress/'+req.params[0]);
        res.header('Content-Type', 'application/json');
        void http.get('http://f0539855.xsph.ru/wordpress/'+req.params[0], (r, buffer='') => {
            r
            .on('data', data => buffer += data)
            .on('end', () => res.send(buffer));
        });
    })

    .get('/test/', urlencodedParser, async (req, res) => {

        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto(req.query.URL);
        await page.click('#bt');
        const input = await page.$('#inp');
        let value = await page.evaluate(inp => inp.value, input);
        res.send(value);

        res.send(url);
        
    })

    .post('/req/', urlencodedParser, (req, res) => {
        const url = req.body.addr;
        http.get(String(url), response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            })
            response.on('end', () => {
                res.end(data);
            })
        })
    })

    .post('/insert/', urlencodedParser, async (req, res) => {
        const log = req.body.login;
        const pass = req.body.password;
        const url = req.body.URL;

        await m.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

        const newUser = new User({login: log, password: pass});
        try {
            await newUser.save();
            res.status(201);
        } catch (e) {
            res.status(400);
        }
        res.end();
    })

    .post('/render/', json_parser, urlencodedParser, (req, res) => {
      let addr = req.query.addr;
      console.log(addr, req.body.random2, req.body.random3);
      void http.get(addr, (r, buffer='') => {
            r
            .on('data', data => buffer += data)
            .on('end', () => writeFileSync('views/data.pug', buffer));
        });
        res.render('data.pug', {'random2': req.body.random2, 'random3': req.body.random3});
    })

    .all('/*', (req, res) => {
        res.end("nikird");
    })

    return app;
}