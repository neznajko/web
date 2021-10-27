                                      ////                                      
////////////////////////////////////////////////////////////////////////////////
/*
 * The task:
 * Create a single page application and host it on GitHub Pages or wherever you
 * prefer - jsfiddle, codepen, jsbin, plunker, etc.
 * The library that you can use for this application is jQuery. Using jQuery is
 * not mandatory so you can just use "Vanilla JavaScript" if you prefer.
 *
 * The functionality of the app:
 * The UI of the app should consist of a dropdown prepopulated with the 
 * following currencies:
 * USD, EUR, AUD, CAD, CHF, NZD, BGN
 * The default selected currency should be: USD
 * Upon loading, the app should make requests to a service and get the exchange
 * rates between all possible pairs of the above-mentioned currencies.
 *
 * The service is:
 * https://github.com/fawazahmed0/currency-api
 *
 * Sample requests:
 * https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/usd.json
 * https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/eur.json
 * https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/bgn.json
 * ...
 *
 * When all the exchange rates are loaded the page should display a list of the
 * exchange rates for the currently selected currency (e.g. USD).
 * The rates should be visually split in 3 groups:
 * Group 1 - all exchange rates that are < 1
 * Group 2 - all exchange rates that are >= 1 and < 1.5
 * Group 3 - all exchange rates that are >= 1.5
 *
 * Each group should be sorted by the value of the exchange rate and there 
 * should be a row showing the number of items in this group.
 * E.g.
 * Group1
 * EUR-USD: 0.7
 * USD-BGN: 0.8
 * USD-CAD: 0.9
 * Count: 3
 *
 * When the user selects another currency (from the dropdown), the app should
 * clear the currently displayed exchange rates and show the exchange rates for
 * the newly selected currency.
 *
 * Task bonus 1 (you can skip this feature if you want):
 *
 * When all the exchange rates are loaded the page should also show a number
 * that is the length of the longest array that meets the following conditions:
 *
 * for elements of the array should be considered only exchange rates for the
 * currently selected currency (for example if USD is selected: USD-EUR, EUR-USD,
 * USD-BGN, BGN-USD, etc.)
 * the absolute difference between any two elements of the array is <= 0.5
 *
 * For example let’s say that all the USD exchange rates are:
 * USD-EUR 1.3
 * EUR-USD 2.1
 * USD-CAD 2.0
 * CAD-USD 1.4
 * USD-BGN 1.5
 * BGN-USD 1.2
 *
 * The output should be: 4
 * Because the longest array we’ve found is: USD-EUR (1.3), CAD-USD (1.4),
 * USD-BGN (1.5), BGN-USD (1.2)
 *
 * Task bonus 2 (you can skip this feature if you want):
 * Implement caching in the browser, so that if the user opens the app again in
 * the same day, the exchange rates are read from the cache and no requests are
 * made.
 */
////////////////////////////////////////////////////////////////////////////////
// Ok fst load the cures
const cure = [ "usd", "eur", "aud", "cad", "chf", "nzd", "bgn"];
var n = cure.length;
var mat = Array.from({ length: n}, () => Array( n).fill( 0)); // 2d
// url structure:
// https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@{apiVersion}/{date}/{endpoint}
// Get the currency value for EUR to JPY:
// https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/jpy.json
const base = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/";
function geturl( i, j) {
    return base + "currencies/" + cure[ i] + "/" + cure[ j] + ".json";
}
function req( i, j) {
    return new Promise(( resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener( "load", e => {
            const res = JSON.parse( xhr.response);
            mat[ i][ j] = res[ cure[ j]];
            resolve();
        });
        xhr.open( "GET", geturl( i, j));
        xhr.send();
    });
}
// Ck if same day, if so load mat from local storage otherwise
// make a request to the server. 
function getdate() { // "Tue Oct 26 2021"
    return Date().split( " ").slice( 0, 4).join( " ");
}
const today = getdate();
if( localStorage.date == today) {
    console.log( "Caching");
    mat = JSON.parse( localStorage.mat);
    bld();
} else {
    console.log( "Loading from the server...");
    var ls = [];
    for( let i = 0; i < n; i++) {
        for( let j = 0; j < n; j++) {
            if( i != j) ls.push( req( i, j));
        }
    }
    Promise.all( ls).then().then(() => {
        localStorage.mat = JSON.stringify( mat);
        localStorage.date = today;
        bld();
    });
}
function bld() {
    // Add currency options to the select lmnt
    var slct = document.getElementById( "slct");
    cure.forEach(( item, pos) => {
        var opt = document.createElement( "option");
        opt.value = pos;
        opt.innerText = item.toUpperCase();
        slct.appendChild( opt);
    });
}
////////////////////////////////////////////////////////////////////////////////
// To dump EUR-USD: 0.987 or whatever we need three numbers i, j, mat[ i][ j]
// so that cure[ i] = EUR, cure[ j] = USD and mat[ i][ j] = 0.987. This info is
// packed into an array, and these units are lmnts of a bucket for a given 
// currency of interest. There are 3 buckets for the coresponding bounderies,
// [0, 1), [1, 1.5), [1.5, inf) respectivly. 
const nofBuckets = 3;
function dmpBucket( bucket, j)
{
    var tab = document.getElementById( `tab${j}`);
    tab.innerHTML = ""; // clear
    for( let i = 0; i < bucket.length; i++) {
        var tr = document.createElement( "tr");
        const src  = cure[ bucket[ i][ 0]].toUpperCase();
        const dst  = cure[ bucket[ i][ 1]].toUpperCase();
        const rate = bucket[ i][ 2];
        tr.innerHTML = `<td>${src}-${dst}: ${rate}</td>`
        tab.appendChild( tr);
    }
    var tr = document.createElement( "tr");
    tr.innerHTML = `<td>Count: ${bucket.length}</td>`;
    tab.appendChild( tr);
}
// Add event listener if selected value is changed
slct.addEventListener( "change", e => {
    if(! slct.value) return;
    const i = parseInt( slct.value);
    const buckets = getBuckets( i);
    for( let j = 0; j < nofBuckets; j++) {
        dmpBucket( buckets[ j], j + 1);
    }
    const m = getMaxlen( buckets);
    var p = document.getElementById( "maxlen");
    p.innerText = `maxlen: ${m}`;
});
////////////////////////////////////////////////////////////////////////////////
// sorting function fst, sec are bucket lmnts: [ i, j, mat[ i][ j]], where
// [ 2] is the actual exchange rate.
function cmp( fst, sec) {
    return fst[ 2] > sec[ 2];
}
function getGroup( rate) {
    if( rate < 1.0) return 0;
    if( rate < 1.5) return 1;
    return 2;    
}
function getBuckets( j) {
    var buckets = [[], [], []];
    for( let i = 0; i < n; i++) {
        if( i != j) {
            buckets[ getGroup( mat[ i][ j])].push([ i, j, mat[ i][ j]]);
            buckets[ getGroup( mat[ j][ i])].push([ j, i, mat[ j][ i]]);
        }
    }
    // sort buckets in place here
    for( let i = 0; i < nofBuckets; i++) {
        buckets[ i].sort( cmp);
    }
    return buckets;
}
////////////////////////////////////////////////////////////////////////////////
function getMaxlen( buckets) {
    // put all sorted three buckets into a single array of xchg rates.
    var a = [];
    buckets.forEach( bucket => {
        for( const lmnt of bucket) {
            a.push( lmnt[ 2]);
        }
    });
    const k = 0.5; // difference upper limit
    // Put remaining stuff into separate function for debugging.
    return maxlen( a, k);
}
function maxlen( a, k) {
    // [ Ok] a has to be sorted.
    const g = a.length; // guardian position
    // [ Ok] let's make it clear!
    a.push( Infinity);
    // The following algorithm should run in O( g),.
    //_-`,
    //    i = 0
    //    j = 1
    //    m = 0 # maximum length
    // 0: nop
    // 1: a[ j] - a[ i] > k?
    //    n) j++
    //       jmp 1
    //    m = max( m, j - i)
    //    j = g?
    //    y) jmp 2
    //    i++
    //    jmp 0
    // 2: ret m
    var m = 0;
    for( let i = 0, j = 1; j < g; i++) {
        while( a[ j] - a[ i] <= k) j++;
        m = Math.max( m, j - i);
    }
    a.pop(); // restore
    return m;
}
////////////////////////////////////////////////////////////////////////////////
// log: 
////////////////////////////////////////////////////////////////////////////////
    ////                                                                \\\\    
