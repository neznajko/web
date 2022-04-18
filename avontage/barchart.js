////////////////////////////////////////////////////////////////
class Bar {
    constructor( value, flag, cont ){
        this.value = value;
        this.flag  = flag;
        this.cont  = cont; // parent container
    }
    cmos( value ){ // Complimentary Metaoxide Semi-Conductor
        value = this.cont.scale*( value - this.cont.bas );
        value = this.cont.height - value;
        return value;
    }
    render() {
        let bar = document.createElement( "div" );
        if( this.flag ){
            bar.setAttribute( "class", "bar dark-green" );
        } else {
            bar.setAttribute( "class", "bar light-green" );
        }
        // value
        let value = document.createElement( "div" );
        value.setAttribute( "class", "value" );
        value.style.height = this.cmos( this.value ) + 'px';
        bar.appendChild( value );
        //
        return bar;
    }
}
////////////////////////////////////////////////////////////////
function fillgaps( hist ){
    hist.push( 0 ); // add Sentinel
    let f = 0; // front
    let r = f; // rear
    while( true ){
        // find front of the gap; fst f: hist[ f ] = 0
        for(; hist[ f ] > 0; f++ ){}
        if( f == hist.length - 1 ) break; // done
        // find rear; fst r > f: hist[ r ] > 0
        for( r = f + 1; hist[ r ] == 0; r++ ){}
        // get the average value
        const ave = (hist[ f - 1 ] + hist[ r ])/2;
        // fill the gap
        for(; f < r; f++ ){
            hist[ f ] = -ave; // mark as negative
        }
    }
    hist.pop(); // Discard guard
}
////////////////////////////////////////////////////////////////
export class Barchart {
    constructor( info, cont ){ //
        this.intval = +this.dom.intval.value.match(/\d+/g)[ 0 ];
        this.cont = cont;
        this.height = this.cont.offsetHeight; // pixels        
        this.bas = info.stat.min.low;
        this.cel = info.stat.max.high;
        this.scale = this.height/( this.cel - this.bas );
        // Get Histogram
        const n  = info.dat.length;
        const t1 = this.t1 = info.dat[ 0 ].time;
        const tf = info.dat[ n - 1 ].time;
        // expected number of entries
        const e = 1 + ( tf - t1 )/this.intval;
        let hist = Array( e ).fill( 0 );
        for( const val of info.dat ){
            const j = ( val.time - t1 )/this.intval;
            hist[ j ] = ( val.stock.low + val.stock.high )/2;
        }
        fillgaps( hist );
        this.bars = [];
        for( let j = 0; j < hist.length; j++ ){
            let value = hist[ j ];
            const flag = value < 0;
            if( flag ) value = -value;
            this.bars.push( new Bar( value, flag, this ));
        }
    }
    render() {
        const timeaxis = this.dom.timeaxis;
        this.dom.autoclean( timeaxis );
        this.dom.autoclean( this.cont );
        const markers = [
            [  8*60, "8a"  ],
            [ 11*60, "11a" ],
            [ 14*60, "2p"  ],
            [ 17*60, "17p" ],
            [ 0,      ""   ] // Guard
        ];
        let p = 0; // find first marker greater than this.t1
        for(; this.t1 > markers[ p ][ 0 ]; p++ ){}
        for( let j = 0; j < this.bars.length; j++ ){
            this.cont.appendChild( this.bars[j].render() );
            let tbar = document.createElement( "div" );
            tbar.setAttribute( "class", "tbar" );
            //
            let t = this.t1 + j*this.intval;
            if( t == markers[ p ][ 0 ] ){
                let tm = document.createElement( "p" );
                tm.innerText = markers[ p ][ 1 ];
                tbar.appendChild( tm );
                p++;
            }
            timeaxis.appendChild( tbar );
        }
    }
}
////////////////////////////////////////////////////////////////
// log:
////////////////////////////////////////////////////////////////
