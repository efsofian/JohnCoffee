ztm Next.js

nextjs framework built on top of react // scalable, react for production
full stack

different rendering techniques:
-static site gen // build time
-server side rendering // gen on the server, runtime
-incremental site regeneration // build in advance + server runtime

performance
-code splitting // automatic when build via routing
-minifying files
-images optimization // service best image for device size and load image only when its on the viewport
-prefetching

file base routing // opiniated, no need external router

seo

serverless functions // api folder

npx create-next-app name
yarn create next-app name

npm run dev // dev mode server
npm run build // build app for prod
npm start // run the built app for prod

npm install react@latest react-dom@latest // for update react & react-dom packages
npm install next@latest // for update next and all its packages
npm audit --fix // auto update packages wich need update

since next12
swc replacing babel // faster
swc replace terser for minification
better styled jsx css parsing
next/image // wrapping in span instead div
hmr use websocket // need some cfg
webpack 5 used
target option deprecated
middleware // _middleware.js
import from web // like deno
edge function // cdn best location automatically when bootup


next app structure
packages.json
node_modules
pages // default routing // faut export default les composants
	index.js // default route
	_app.js // entry point // wrapper for all components
	/api // backend api
public // all static assets, fonts images etc...
styles
	global.css // global css
	Home.module.css // css module, scoped for Home in this case


=> fast refresh, show error on browser
=> next return by default a 404 if no page found

css module:
componentName.module.css // du css, scoped que pour componentName
dans le component // import styles from '.../nameMode.module.css'
style est un objet // class = key
ca filera un nom de class unique: "nomducomp_nomdlaclass_randomstring"

meshgradiant // website to create cool gradiant

import Head from "next/head";
head for meta data
example: 
<Head>
				<title>John Coffe</title>
				<meta name="description" content="Coffee land" />
				<link rel="icon" href="/favicon.ico" />
</Head>
cette partie ne sera pas display

Next.js Routing:
-index routes // default root page route, default route => need to return a jsx component => component is exported by default
-nested routes // nested files /coffee-store // need an index.js on the folder for /coffee-store/
-dynamic routes // /coffee-store/[id] .js

dynamic routes:
import { useRouter } from "next/router"
const router = useRouter();
const { pid } = router.query

Link:
import  Link  from "next/link"
<Link href="/">Back to home</Link> // ca va pa reload la page, juste mettre a jour l'History. for refresh or external link, use <a href>
// many props, like scroll, prefetch..
// prefetch => predownload the content of the page where the link is pointing to

hero image // genre de main image
icon8.com // free assets
megacreator // to create custom hero image with some assets

Image:
import Image from "next/image"
// auto resize and optimize them, and serve the optimized image
// auto lazy loading of image not in the viewport

_document.js // acces to the window.document, <head>
_app.js // acces to the <body>


_document.js:
import Document, { Html, Head, Main, NextScript } from "next/document";
class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head> // head
					<link 
					rel="preload" 
					href="/fonts/IBMPPlexSans-Bold.ttef"
					as="font"
					crossOrigin="anonymous"
				</Head> 
				<body>
					<Main></Main> // body div next
					<NextScript /> // body scripts
				</body>
			</Html>
		);
	}
}
export default MyDocument;

on peut aussi preload fonts pour le build:
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<style data-href="https://fonts.googleapis.com/css2?family=Inter&display=optional">
	@font-face{font-family:'Inter';font-style:normal...
</style>




SEO
semantics
meta tags
image alt tag
-click rate / user click on the page
-bounce rate / user to leave the website
-time spend
=> google analytics, ptit .js qui calcule tout ca et envoi a google for better seo

pre rendering // whats happen before js loading
hydration // js load and update the html state

diff next / plain react // we got content prerender, in react we dont

Rendering Techniques in Next JS:
-static site generation: SSG // pre render //  html at build time, content at build time (full build time server), and can get external data during build time to get a static rendered html
	without external data: default
	with external data: getStaticProps // will be done at build steps


-incremental site regeneration: ISR // pre render // html at build time, and when a request coming, or every XX secs, get fresh data and start over the build process on cdn
	getStaticProps with { revalidate: 10 }
	// site built at build time, and if user ask a path not prerender, it will rebuild and cache the new version and send it for new clients
	// by default, revalidate: false, need to set a number
	// Middleware won't be executed for On-Demand ISR requests. Instead, call revalidate()
-server side rendering // pre render // html and content generated at each request (full runtime client) // cant cache data on cdn // a bit slower
	getServersideProps

-client side rendering // post render // use swr
-hydrating // prerender basic html, and client side fetching/rendering new data (useEffect or swr)

glassmorphizing.com // css tool effect

npm install classnames
cls("class1", "class2") // return "class1 class2"

grid remembers:
media queries:
grid-template-columns: repeat(1, minmax(0, 1fr));
column-gap: 1.5rem;
row-gap: 1.5 rem;


SSG
external data:
getStaticProps // pre render static content
-can only be exported from page files
-meant for all routes
-only run at build time
-only run on server side
-wont be included in client bundle
-on dev mode, run on client and server side
export async function getStaticProps(context) {
	return {
		props: xxx
	}
}


getStaticPaths // pre render dynamic routes content
-can only be exported from page files
-meant for dynamics routes
-page also must implement getStaticProps
-only run at build time
-only run on server side
-wont be included in client bundle
-on dev mode, run on client and server side

fallback:
false // next return 404 if not preloaded in getStaticPath()
true  // next return the page even if not preloaded in getStaticPath(), so careful, props will be undefined
	  // so show loading state protetction via if (router.isFallback) { return jsxloading }
	  //

reminders:
getStaticPaths // lid qu on return doit etre une string  (.toString())

var envs:
.env.local // DB=XX // NEXT_PUBLIC_KEY=xx for public env send to client
next.config.js // env: { key: 'val' } // accessible via process.env.key