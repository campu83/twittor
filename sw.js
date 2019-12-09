//const PATH_BASE ='/pwa/06-twittor/';
const PATH_BASE ='';

//imports
importScripts(PATH_BASE+'js/sw-utils.js');

const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';



const APP_SHELL = [
    //PATH_BASE,
    PATH_BASE+'index.html',
    PATH_BASE+'css/style.css',
    PATH_BASE+'img/favicon.ico',
    PATH_BASE+'img/avatars/spiderman.jpg',
    PATH_BASE+'img/avatars/hulk.jpg',
    PATH_BASE+'img/avatars/ironman.jpg',
    PATH_BASE+'img/avatars/thor.jpg',
    PATH_BASE+'img/avatars/wolverine.jpg',
    PATH_BASE+'js/app.js',
    PATH_BASE+'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open( STATIC_CACHE ).then( cache =>{
        cache.addAll( APP_SHELL );
    });

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache =>{
        cache.addAll( APP_SHELL_INMUTABLE );
    });

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys =>{
        keys.forEach( key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil( respuesta );
    
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match( e.request ).then( res => {
        if ( res ) {
            return res;
        }else{
            return fetch( e.request).then (newRes =>{
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
            });
            console.log(e.request.url);
        }
    });

    e.respondWith(respuesta);
});