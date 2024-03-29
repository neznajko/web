////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
'use strict'; // unfortunately there is no -pedantic
import { Barchart } from './barchart.js'; 
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
console.log( " .;'= avontage .=*-,_ " );
////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////// Api
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
class Api {
    constructor( obj ){
        let query = "query?";
        for( const key in obj ){
            const val = obj[ key ];
            this[ key ] = val;
            query += `${ key }=${ val }&`;
        }
        query += `apikey=${ this.apikey }`;
        this.query = () => {
            return query;
        }
    }
////////////////////////////////////////////////////////////////
    // Guess what?, used for api requests.
    ////////////////////////////////////////////////////////////    
    geturl() {
        let url = this.basurl + this.query();
        const proto = Object.getPrototypeOf( this );
        for( const key of Object.keys( proto )){
            const val = proto[ key ];
            url += `&${ key }=${ val }`;
        }
        return url;
    }
////////////////////////////////////////////////////////////////
    // This is used for object's key, in browser's localStorage.
    repr() { ///////////////////////////////////////////////////
        let str = "";
        ////////////////////////////////////////// instance keys
        for( const key of Object.keys( this )){
            const val = this[ key ];
            if( typeof( val ) != 'function' ){
                str += val + '/';
            }
        }
        //////////////////////////////////////////// static keys
        const proto = Object.getPrototypeOf( this );
        for( const key of Object.keys( proto )){
            const val = proto[ key ];
            str += val + '/';
        }
        return str;
    }
////////////////////////////////////////////////////////////////
    /////////////////////////////////// //////////////////
    /////////////////////////////////// //////////////////
//// [ r e q u e s t ] //////////////// ////////////////////////
    async mkrequest() {
        const key = this.repr();
        let apinfo;
        if( localStorage[ key ] !== undefined ){
            console.log( `..loading from localStorage[${ key }]`);
            apinfo = JSON.parse( localStorage[ key ]);
        } else {
            const url = this.geturl();
            this.dom.echo.innerHTML = "<p>Hold on, making a request ..</p>";
            console.log( "Hold on, making a request ..\n" + url );
            // The response is a Promise Object, and if I'm not
            // mistaken await marks the line as synchronous code.
            let response = await fetch( url );
            // .json() is also a Promise.
            apinfo = await response.json();
            localStorage[ key ] = JSON.stringify( apinfo );
            this.dom.echo.innerHTML = "";
        }
        this.avontage( apinfo );
    }
} //////////////////////////////////////////////////////////////
Api.prototype.basurl = "https://www.alphavantage.co/";
Api.prototype.apikey = "NVSL9QES3HCMSQV8";
///////////////////////////////////////// Time Series Stock APIs
////////////////////////////////////////////////////////////////
/////////////////////////////////////////// TIME_SERIES_INTRADAY
// symbol: The name of the equity of your choice. For example:
// symbol=IBM
// interval: Time interval between two consecutive data points
// in the time series. The following values are supported: 1min,
// 5min, 15min, 30min, 60min                 [ I n t r a d a y ]
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////// Intraday
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
Time.prototype.keys = [
    "year", "month", "day", "hour", "minutes", "seconds"
];
////////////////////////////////////////////////////////////////
function Time( str ){
    const m = str.match( /\d+/g );
    for( const[ j, key ] of this.keys.entries() ){
        this[ key ] = m[ j ];
    }
}
////////////////////////////////////////////////////////////////
Stock.prototype.keys = [
    "open", "high", "low", "close", "volume"
];
function Stock( stockObj ){
    if( typeof( stockObj ) == 'number' ){
        for( const key of this.keys ){
            this[ key ] = stockObj;
        }
    } else {
        for( let j = 0; j < this.keys.length; j++ ){
            const key = this.keys[ j ];
            const apikey = `${j + 1}. ${key}`;
            this[ key ] = +stockObj[ apikey ];
        }
    }
}
////////////////////////////////////////////////////////////////
class Intraday extends Api {
    constructor( symbol, intval ){
        super({
            "symbol":   symbol,
            "interval": intval
        }); //                        I N T R A D A Y
    }
    ////////////////////////////////////////////////////////////
    // Split in days and modify api information.
    avontage( apinfo ){
        const key = `Time Series (${this.interval})`;
        if( apinfo[ key ] === undefined ){
            delete localStorage[ key ];
            this.dom.echo.innerHTML = "<p>Grünfeld!</p>";
            console.log( apinfo );
            return;
        }
        apinfo = apinfo[ key ];
        let info = []; // default goal
        let tday = "";
        for( const key in apinfo ){
            const t = new Time( key );
            if( t.day != tday ){ // new day
                info.push({
                    day: [ t.year, t.month, t.day ],
                    dat: [],
                });
                tday = t.day; // update
            }
            const apiStock = apinfo[ key ];
            info[ info.length - 1 ].dat.push({
                // keep time integer
                time:  +t.minutes + t.hour*60,
                stock: new Stock( apinfo[ key ]),
            });
        }
        // Sort in increasing( a.k.a acceding )order.
        info.sort(( a, b ) => {
            return ( a.day < b.day ) ? -1 : 1;
        });
        for( const y of info ){
            y.dat.sort(( a, b ) => {
                return a.time - b.time;
            });
        }
        const ndays = info.length;
        console.log( "number of days:", ndays );
        for( let j = 0; j < ndays; j++ ){
            info[ j ].stat = getStat( info[ j ]);
        }
        this.dom.info = info;
        this.dom.initdays();
    }
}
Intraday.prototype[ "function" ] = "TIME_SERIES_INTRADAY";
Intraday.prototype[ "outputsize" ] = "full";
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////// Search
////////////////////////////////////////////////////////////////
class Search extends Api {
    constructor( keywords ){
        super({
            "keywords": keywords
        });
    }
    avontage( apinfo ){
        this.dom.auto( apinfo );
    }
}
////////////////////////////////////////////////////////////////
Search.prototype[ "function" ] = "SYMBOL_SEARCH";
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const DOM = {
    srch:     document.getElementById( "srch"      ),
    list:     document.getElementById( "list"      ),
    intval:   document.getElementById( "intval"    ),
    days:     document.getElementById( "days"      ),
    barchart: document.getElementById( "barchart"  ),
    timeaxis: document.getElementById( "timeaxis"  ),
    form:     document.getElementById( "form"      ),
    echo:     document.getElementById( "echo"      ),
    vaxis:    document.getElementsByClassName( "vaxis" ),
    info:      {},
    //
    autoclean: function( cont ) {
        // https://coderwall.com/
        // p/nygghw/don-t-use-innerhtml-to-empty-dom-elements
        while( cont.firstChild ){
            cont.removeChild( cont.firstChild );
        }
    },
    auto: function( res ){
        DOM.autoclean( DOM.list );
        const y = res.bestMatches;
        if(! y ) return;
        for( let j = 0; j < y.length; j++ ){
            const item = document.createElement( "div" );
            item.setAttribute( "class", "item" );
            item.innerText = y[ j ][ "1. symbol" ];
            console.log( y[ j ]);
            item.addEventListener( "click", selectItem );
            item.addEventListener( "mouseover", () => {
                DOM.echo.innerHTML = (`<p>
${y[ j ][ "1. symbol"     ]}<br>
${y[ j ][ "2. name"       ]}<br>
${y[ j ][ "3. type"       ]}<br>
${y[ j ][ "4. region"     ]}<br>
${y[ j ][ "5. marketOpen" ]}<br>
</p>`);
            });
            DOM.list.appendChild( item );
        }
    },
    initdays: function() {
        DOM.autoclean( DOM.days );
        const n = DOM.info.length;
        function timefomt( day ) {
            // day = [ year, month, day ]
            const month = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ];
            return( day[ 2 ] + " " +
                    month[ day[ 1 ] - 1 ] + " " + day[ 0 ]);
        }
        for( let j = 0; j < n; j++ ){
            const key = timefomt( DOM.info[ j ].day );
            const val = j;
            let day = document.createElement( "option" );
            day.value = val;
            day.innerText = key;
            DOM.days.appendChild( day );
        }
        DOM.days.value = n - 1;
        DOM.days.dispatchEvent( new Event( "change" ));
    },
    makeIntradayRequest: function() {
        const iday = new Intraday( DOM.srch.value, DOM.intval.value );
        iday.mkrequest();
    }
}
Barchart.prototype.dom = DOM;
////////////////////////////////////////////////////////////////////////
DOM.form.addEventListener( "submit", e => {
    e.preventDefault();
    const keywords = DOM.srch.value;
    const ctrl = new Search( keywords );
    ctrl.mkrequest();
});
const selectItem = e => { // item "click" event listener
    DOM.srch.value = e.target.innerText;
    DOM.autoclean( DOM.list );
    DOM.makeIntradayRequest();
};
////////////////////////////////////////////////////////////////////////
DOM.intval.addEventListener( "change", e => {
    DOM.makeIntradayRequest();
});
DOM.days.addEventListener( "change", e => {
    const dayinfo = DOM.info[ e.target.value ];
    let barchart = new Barchart( dayinfo, DOM.barchart );
    barchart.render();
    const n = barchart.bars.length;
    for( let j = 0; j < n; j++ ){
        const div = barchart.cont.children[ j ];
        div.addEventListener( "mouseenter", () => {
            const value = barchart.bars[ j ].value.toFixed( 1 );
            DOM.echo.innerHTML = `<p>${value}</p>`;
        });
        div.addEventListener( "mouseleave", () => {
            DOM.echo.innerHTML = "";
        });
    }
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
Api.prototype.dom = DOM;
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function clear() {
    const date = (new Date()).toLocaleDateString();
    if( localStorage[ "date" ] !== date ){
        console.log( "Clearing local storage .." );
        localStorage.clear();
    }
    localStorage[ "date" ] = date;
}
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
function boot( stock ){
    DOM.srch.value = stock;
    const opts = {
        "01 min":  "1min",
        "05 min":  "5min",
        "15 min": "15min",
        "30 min": "30min",
        "60 min": "60min",
    };
    for( let key in opts ){
        let opt = document.createElement( "option" );
        opt.innerText = key;
        opt.value = opts[ key ];
        DOM.intval.appendChild( opt );
    }
    DOM.intval.value = opts[ "15 min" ];
    // Create the controler in the MVC Pattern.
    const iday = new Intraday( DOM.srch.value,
                               DOM.intval.value );
    iday.mkrequest();
}
clear();
boot( 'IBM' );
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function getStat( dayinfo ){
    const n = dayinfo.dat.length; // number of measurements
    let ave = new Stock( 0 );
    let min = new Stock( Infinity );
    let max = new Stock(-Infinity );
    for( let j = 0; j < n; j++ ){
        const stock = dayinfo.dat[ j ].stock;
        for( const key in stock ){
            const val = stock[ key ];
            ave[ key ] += val;
            if( val < min[ key ]) min[ key ] = val;
            if( val > max[ key ]) max[ key ] = val;
        }
    }
    for( const key in ave ) ave[ key ] /= n;
    return {
        ave: ave,
        min: min,
        max: max
    };
}
////////////////////////////////////////////////////////////////////////
// next: - vhen making request dump it to echo area                  [v]
//       - add event listeners to bars here                          [v]
//       - try mousewheel changing days                              [ ]
//       - change day color to red                                   [ ]
