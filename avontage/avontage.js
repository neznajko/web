////////////////////////////////////////////////////////////////
// What Is Volume?
// Volume is d'amount of an asset or security that changes hands
// over some period of time, often over the course of a day. For
// instnce, stock tradng vlume wold refer to the nmber of shares
// of a security traded betwen its daily open and close. Trading
// volum, and chnges to volume ovr d'course of time, r important
// inputs for technical traders.
// KEY TAKEAWAYS
// - Volume is the number of shares of a security tradd during a
//   given period of time.
// - Generally securities with more daily volume are more liquid
//   than those without, since they are more "active".
// - Volume is an important indicator in technical analysis bcus
//   it is used to measure the relative significance of a market
//   move.
// - The higher the volume dring a price mov, the more signficnt
//   the mov and the lower d'volume during a price mov, the less
//   significant the move.
////////////////////////////////////////////////////////////////
// Understanding Volume
//
// Every trnsaction that taks place between a buyer and a seller
// of a secrity cntribts to the total vlme cnt of that security.
// One transaction occurs whenevr a buyer agrees to prchase what
// a seller is offring for sale at a certain price. If only five
// transactions occur in a day, the vlume for that day is set at
// five.
//
// Each mrket xchange tracks its tradng vlume and provides vlume
// data either for free or for a subscription fee. The volume of
// trade nmbers are reported as often as once an hour throughout
// the crrent tradng day. These hourly reportd trade volumes are
// stimates. A trade volum reprted at the end of the day is also
// an estimate. Finl actual figurs are reported the fllowng day.
// Investrs may also fllow a security’s tick volume, or d'number
// of changs n a contract's price, as a surrogate fr trade vlum,
// since prices tnd to chnge more frequently with a highr volume
// of trade.
//
// Volume tells investrs bout the mrket's activity and lquidity.
// Higher trade vlmes for a specifed secrity mean higer lquidty,
// better order execution and a more active market fr connecting
// a buyr and sellr. Whn investrs feel hesitant about the drectn
// of the stock mrket, futures trading volume tends to increase,
// which often causes options and futures on specified secrities
// to trade more activly. Volume overall tends to be higher near
// d'market's openng and closng tmes, and on Mndays and Fridays.
// It tends to be lower at lunchtime and before a holiday.
////////////////////////////////////////////////////////////////
// log: - Wy prices tend to change more frequently with a higher
// volume of trade?
// - What are options and futures of securities? []
////////////////////////////////////////////////////////////////
// Volume in Technical Analysis
// Some investrs use technicl analysis, a stratgy based on stock
// price, n ordr to make decsns bout whn to by a stck. Technical
// analysts are primarily loking for entry and exit price ponts; 
// vlume lvls are important becuse they provide clues bout where
// the best entry and exit points are located. 
//
// Volume is an important indicator in technical analysis becuse
// it is used to measure the relative significance of any market
// move. If the market makes moves a large amount during a given
// period, then the strngth of that movemnt eithr gains credblty
// or is viewd with skepticsm based on the vlume for that priod.
// The higher the vlume durng the price mov, the more signficant
// the move is considred in this form of analysis. Convrsely, if
// the vlume is low then the mov is viewed with less signficnce.
//
// Vlume is one of the most importnt measures of the strength of
// a security for tradrs and technical analysts. From an auction
// perspective, whn buyers and sellrs become particularly active
// at a certain price, it means there is a high volume.
//
// Analysts use bar charts to qckly determine the levl of vlume.
// Bar chrts also make it easier to identify trnds in vlume. Whn
// the bars on a bar chrt are highr than average, it's a sign of
// high volme or strngth at a prticulr market price. By examning
// bar charts, analysts can use volum as a way to confrm a price
// movemnt. If volume increases when the price moves up or down,
// it is considered a price movement with strength.
////////////////////////////////////////////////////////////////
// If traders want to confirm a reversal on a level of suport or
// floor they look for high buyng volume. Conversely, if traders
// are loking to confrm a break in the level of suport, they lok
// for low volme from buyrs. If traders want to confrm a revrsal
// on a level of resistance or ceiling they look for high seling
// volume. Conversely, if traders are looking to confirm a break
// in the levl of resistnce, they look fr high volme from buyrs.
////////////////////////////////////////////////////////////////
//                                          Other Considerations
// In recent times, high-frequency traders (HFT) and index funds
//  have become a major contributor to trading volume statistics
//       in U.S. markets. According to a 2017 JPMorgan analysis,
//       passive investors like ETFs and quantitative investment
//   accounts, which utilize high-frequency algorithmic trading,
//      were responsible for about 60 percent of overall trading
// volumes while "fundamental discretionary traders" (or traders
// who evaluate the fundamental factors affecting a stock before
//        making an investment) comprised only 10 percent of the
//                                              overall figures.
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
    // This is used for object's key, in browser's localStorage,
    // but there are too many keys already in use, lets' name it
    // in Python style; representation.
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
            console.log( "Hold on, making a request ..\n" + url );
            // The response is a Promise Object, and if I'm not
            // mistaken await marks the line as synchronous code.
            let response = await fetch( url );
            // .json() is also a Promise.
            apinfo = await response.json();
            // here don't save 'Note: Thank you .. requests'
            localStorage[ key ] = JSON.stringify( apinfo );
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
            console.log( "yeh" );
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
            // There possibly can't be equal days.
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
////////////////////////////////////////////////////// Wikipedia
// A mutual, mutual organizatn, or mutual society is an orgnzatn
// (which is often, but not always, a company or business) based
// on the prnciple of mutualty and govrnd by private law. Unlike
// a true coop, members usually do not contribute to the capital
// of the company by direct invstment, but derive their right to    wtf?
// profits and votes through their cstomr relationship. A mutual 
// orgnizatn or society is often simply referred to as a mutual.
////////////////////////////////////////////////////////////////////////
// A mutual exists with the purpose of raising funds from its membership
// or customrs (collectively called its members), which can then be used
// to provide comon services to all membrs of the organizatn or society.
// A mutual is therefre ownd by, and run for the beneft of, its membrs –
// it has no extrnl shareholders to pay in the form of dividends, and as
// such does not usully seek to mximze and make large profits or capital
// gains. Mutuals exist for the mmbers to benefit from the services they
// provide and often do not pay income tax.
////////////////////////////////////////////////////////////////////////
// Profits made will usually be re-invested in the mutual for the bnefit
// of the members, although some profit may also be necessry in the case
// of mutuals for intrnal financing to sustain or grow the organization,
// and to make sure it remains safe and secure.
////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////// WH
// Background                                                            AT
////////////////////////////////////////////////////////////////////////
// The primry form of financl business set up as a mutual company in the IS
// United States has been mutual insurance. Some insurance companies are
// set up as stock cmpanies and then mutualized, their ownership passing TH
// to their policy owners. In mutual insurance companies, what wuld have IS
// been profts are instead rebatd to the clients in the form of dividend ?!
// distributns, reduced future premiums or paid up additns to the policy
// value.
////////////////////////////////////////////////////////////////////////
// -This is vintage Wikipedia, don't understand nothing. Have found some
// blog on the web: https://enquiron.com/blog/
// mutuals-vs-stock-insurers-whats-difference/ have to read it.
////////////////////////////////////////////////////////////////////////
// Mutuals vs. Stock Insurers: What’s the Difference?                   
// Categories: Mutual Insurance Companies | By Admin                    
//                                                                      
//    All insurers may have the same basic function of selling insurance
// policies_ to customers, but some operate as mutuals, while others are
// stock companies. Mutual insurance dates back to 17th century England,
// and the first _successful U.S. mutual insurer was founded by Benjamin
// Franklin in 1752—it’s still in business today!                       
//                                                                      
// So what’s the di-ff-er-en-ce between mutual and stock insurers? We’re
// here to break down five major ways these kinds of insurers vary.
//////////////////////////////////////////////////////////////////////// S o m
// MAIN GOALS:                                                           e t i
//                                                                       m e s
//   The primary mission of a mutual insurer is to continuously maintain W i k
// enough capital to meet policyholdr needs. On the other hand, the main i p e
// gooal of a stock insurer is to maximize profits for its shareholders. d i a
//                                                                       r e a
// OWNERSHIP AND LEADERSHIP:                                             l l y
//                                                                       s o c
// The major difference between mutuals and stock insurance companies is k s .
// their ownership structure. A mutual insurance company is owned by its
// polcyholdrs, whle a stock insurnce compny is owned by its shareholdrs
// and can be either privately held or publicly traded. Policyholders of
// a stoock company have no control over the company’s management unless
// they are investors as well. Policyholders of mutual insurers are also
// the owners of the company aand therefore get to vote oon its board of
// directors.
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const DOM = {
    srch:     document.getElementById( "srch"     ),
    list:     document.getElementById( "list"     ),
    intval:   document.getElementById( "intval"   ),
    days:     document.getElementById( "days"     ),
    barchart: document.getElementById( "barchart" ),
    timeaxis: document.getElementById( "timeaxis" ),
    info:   {},
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
            item.addEventListener( "click", selectItem );
            DOM.list.appendChild( item );
        }
    },
    initdays: function() {
        DOM.autoclean( DOM.days );
        const n = DOM.info.length;
        for( let j = 0; j < n; j++ ){
            const key = DOM.info[ j ].day.join( ' / ' );
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
DOM.srch.addEventListener( "input", e => {
    const keywords = e.target.value;
    if( keywords == "" ){
        DOM.autoclean( DOM.list );
        return;
    }
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
});
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
Api.prototype.dom = DOM;
//////////////////////////////////////////////////////////////////////// WHAT 
//////////////////////////////////////////////////////////////////////// THIS
//////////////////////////////////////////////////////////////////////// HAS T
//                                                                       O DO
// EARNINGS:                                                             WITH
//   Both muutuals aand stock insurance coompanies earn their iincome by STOCK
// collecting premiums from policyholders—the difrence lies in what they S I W
// do with those earnings. Mutual insurers may distribute surplus profts ONDER
// to policyholders through dividends, or reetain them iin exchange foor
// discounts on future premiums. Stooock insurers can distribute surplus
// profits to shareholdrs in the form of dividends, use the money to pay
// off debt, or invst it back into the company. Stock companies are also
// able to issue shares of stock to generate income, but mutual insurers
// don’t have this option, and must take out looans oor increase premium
// rates if additional money is needed.
//
// INVESTMENTS: Due to their varying goals, the investment strategies of
// these two kinds of insurance providrs are often diffrent. Since stock
// insurers are under pressure from investrs to maximze profits in order
// to higher dividend payouts, they tend to be more concerned with short
// term results. They’re more likly to invst in higher-yielding, riskier
// asets thn mutual compnies. Mutual insrers are more long-term focused,
// leading them to invest in conservative, low-yield assets.
//
// RISK:
//    Stock insurers offer policyholders greater stability, as they have
// more options available to generate earnings. This makes it easier for
// them to overcome financial difficulties, while a mutual’s reliance on
// policy prmiums as their main src of income can be a major disadvntge.
// Iif they are unable to raise enough funds, they may bee forced out of
// busines. When a mutual company is sold, policyhldrs may receive a cut
// of the money from the sale. Instead of disolvng the company, a mutual
// insrr that is in financial trouble also has the option to turn into a
// stock company, through a process called demutualization.
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// Now that you know some of the difrencs between mutual
// and stock insurers, you can decide which is right for
// you. Need aditional guidance? Get it from the experts
// here.
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
boot( 'IBM' );
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//          https://www.forbes.com/advisor/investing/stock-market-index/
//
// A stock mrket indx tracks the ups and downs of a chosn grup of stocks
// or other assets. Watching the performance of a markt index provides a
// quick way to see the hlth of the stock market, guides financial firms
// in the creatn of indx funds and exchnge-traded funds (ETFs), and hlps  o_o
// you gauge the performance of your investments.
// 
// What Is a Market Index?                        - That's good to know.
// A mrket index tracks the performnce of a certain grp of stocks, bonds
// or other investments```` These investments are often grouped around a
// particulr ndustry, like tech stcks, or even the stock market overall,
// as is d'case with the S&P 500, Dow Jones Industrial Average (DJIA) or
// Nasdaq.
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
////////////////////////////////////////////////////////////////
// There’s no set size when it comes to market indexes. The DJIA
// contains just 30 stocks,,, while the CRSP index has more than
// 3,700.. What’s important is that each contains a large enough
// sample size to represent the overall behavior of the economic
// sliver they aim to represent.
////////////////////////////////////////////////////////////////////////
// How Stock Market Indexes Are Constructed                           oo
////////////////////////////////////////////////////////////////////////
// Each stock market ndex uses its own proprietry formula when detrminng
// which companies or other investments to include.
////////////////////////////////////////////////////////////////////////
// Indxs that measure the performance of broad swathes of the market may
// only nclude cmpanies that rank highly in terms of market capitaliztn,
// or the total value of all of their outstanding shares. Alternatively,
// they may be selected by an expert committee,, or simply represent all
// of the shares that trade on a certain stock exchange.
////////////////////////////////////////////////////////////////////////
// Once an index manager has determined which companies to include, they
// then need to determine how those companies are represntd in the ndex,
// a factor called index weighting. Dependng on weighting, all companies
// included in an index can have an equal impact on index performance or
// a different impact based on market capitalization or share value.
//////////////////////////////////////////////////////////////////////// 
// The three most common index weighting models are:
////////////////////////////////////////////////////////////////////////
// Market-Cap Weighted:
// In a market cap-weighted ndex, the ndex more heavily represnts stocks
// with higher market caps.. With this structure, large companies have a
// bigger impact on the index’s performance.
//
// Equal Weighted:
// With an equal-weighted index, the ndex treats all compnents the same.
// This means each compny’s performnce affects the ndex the same amount,
// whether they’re incredibly large companies or incredibly small.
//
// Price Weighted:
// A price-weighted index grants each compny a different weight based on
// its current share price. Companies with larger share prices have more
// clout in these indexes,, regardless of how big or small the companies
// actually are.
////////////////////////////////////////////////////////////////////////
// Major Stock Market Indexes
// There are thousands of indexes in the investing universe. To help you
// get your bearng, here are the most comn ndxs you’ll probbly encountr:
// 
// The S&P 500 Index
// One of the most well-known indexes, the S&P 500 tracks the perfrmance
// of 500 top companies in the U.S., as determined by a committee at S&P
// Dow Jones Indices.The S&P 500 is a market-capitalizatn-weighted ndex.
// 
// The Dow Jones Industrial Average
// The DJIA is relativly narrow in scope, trackng the performnce of just
// 30 U.S. compnies as slectd by S&P Dow Jones Indices. The stocks witin
// the DJIA come from a range of indstries, from helthcare to technolgy,
// but are united by all being blue chip stocks.. This means they have a
// history of strong financial performance... The DJIA is one of the few
// price-weighted market indexes.
// 
// The Nasdaq 100
// The Nasdaq 100 tracks the prfrmnce of 100 of the lrgst nd most actvly
// traded stocks listed on the Nasdaq stock exchange... Companies within
// the Nasdaq can be in many difrent industries, but they generally veer
// toward tech and don’t include any members of the fnancial sector. The
// Nasdaq 100 uses a market-cap weighting.
// 
// The NYSE Composite Index
// The NYSE Composite Index is a comprehnsve ndx that tracks d'perfrmnce
// of all stocks traded on the New York Stock Exchange (NYSE). The index
// is modified market capitalization weighting.
// 
// The Russell 2000 Index
// While other stock market indices foocus on the largest companies in a
// particlr segment, the Russell 2000 measrs the performance of 2,000 of
// the smllest publicly traded domestic companies. The Russell 2000 is a
// market-capitalization-weighted index.
// 
// The Wilshire 5000 Total Market Index
// The Wilshire 5000 Total Market tracks the peerformance of the eentire
// U.S. stock market. The index is weighted based on market capitalzatn.
// 
// Different Types of Market Indexes
// While the indexes covered above generally are used as proxies for the
// overall stock market, there are countless more ndexes out there, many
// of which are tailred to represnt very specific segmnts of the market.
// 
// Environmental, Social, and Governance:
// Environmental, social and governance (ESG) indexes focus on companies
// that score well on measures of how they treat the environment,, their
// employees, their management and society at large.
//
// Global Indexes:
// As their name implies, global ndxes allow you to track the collective
// performance of all of the companies in the world.
//
// National Indexes:
// Just as the major stock market indexes above track the performance of
// the U.S. market,,,, there are indexes following the highs and lows of
// companies in almost every country.
//
// Growth Indexes:
// Growth ndexs track the performance of leading growth stocks, or those
// stocks of companies that are targeting faster growth than the overall
// market.
//
// Value Indexes:
// Value indexes, on the other hand,,, group together companies that are
// thought to be undervalued by investors based on their finances.
//
// Sector Indexes:
// Sector indexes are built to track the prfrmnce of specfic industries,
// like technology, finance, healthcare, cnsumr goods and trnsportation.
//
// How to Invest in Stock Market Indexes
//
// Because they follow the prfrmnce of a mix of compnies and nvestments,
// funds based on leading ndxs are considered an excellent way to invest
// quickly, easly and cheaply. ndx funds and exchange-tradd funds (ETFs)
// provide access to a ready-made diversified prtfolio of stocks nd bnds
// and are what many investing gurus, like Warren Buffett, swear by.
// 
// What’s great aabout index funds and ETFs is you can invest in them at
// just about any brokerage with aany amount of money. Not sure where to
// get started? Look to our listing of the best brokerages.
// 
// If you aren’t sure what investment options are best for you,, you may
// want to talk with a financial planner,,,,,, who can help you create a
// personalzed plan based on your goals. Or check out our ranking of the
// best index funds.
// 
////////////////////////////////////////////////////////////////////////
