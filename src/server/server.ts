import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import express from 'express';
import ace from 'atlassian-connect-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import nocache from 'nocache';
import { createProxyMiddleware }  from "http-proxy-middleware"

const port = parseInt(process.env.PORT || '3000', 10)
const nodePort = parseInt(process.env.NODE_PORT || '3001', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
import routes from './routes';

const handle = app.getRequestHandler()

app.prepare().then(() => {

  const server = express();

  const addon = ace(server);
  const devEnv = server.get('env') === 'development';

  server.use(morgan(devEnv ? 'dev' : 'combined'));

  server.set('view engine', 'ejs')

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(cookieParser());


  server.use(compression());

  server.use(addon.middleware());

  server.use(nocache());

  if (devEnv) server.use(errorHandler());

  routes(server, addon)


  const proxyMiddleware = createProxyMiddleware({
    target: 'http://localhost:3000',
    pathRewrite: { '^/app': '/' },
    changeOrigin: true,
  });

  const proxyMiddlewareB = createProxyMiddleware({
    target: 'http://localhost:3000/_next',
    pathRewrite: { '^/_next': '/' },
    changeOrigin: true,
  });


  const proxyMiddlewareC = createProxyMiddleware({
    target: 'http://localhost:3000/__nextjs_source-map',
    pathRewrite: { '^/__nextjs_source-map': '/' },
    changeOrigin: true,
  });

  const proxyMiddlewareD = createProxyMiddleware({
    target: 'http://localhost:3000',
    pathRewrite: { '^/': '/' },
    pathFilter: (pathname) => {
      // proxy images and static files based one extension
      return !!pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js)$/)?.length

    },
    changeOrigin: true,
  });



  server.use('/app', proxyMiddleware);
  server.use('/_next', proxyMiddlewareB);
  server.use('/__nextjs_source-map', proxyMiddlewareC);
  server.use('/', proxyMiddlewareD);

  server.listen("3001", err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${nodePort}`);
  });

  
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
