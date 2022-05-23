////////////////////////////////////////////////////////////////////////
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.Scanner;
import java.lang.Math;
////////////////////////////////////////////////////////////////////////
class Sprint {
    public int   n;
    public int[] pnt;
    public int[] pwe; // rpyna naBe
}
////////////////////////////////////////////////////////////////////////
public class MinDif {
    static String jsonError( String msg ){
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode error = mapper.createObjectNode();
        error.put( "error", msg );
        return error.toString();
    }
    static String doTheMath( Sprint sprint ){
        int n     = sprint.n;   // shortcuts
        int pnt[] = sprint.pnt;
        int pwe[] = sprint.pwe; 
        if( n < 2 ){
            return jsonError( "n < 2" );
        }
        if( pnt.length < n ){
            return jsonError( "pnt.length < n" );
        }
        if( pwe.length < n ){
            return jsonError( "pwe.length < n" );
        }
        int tEnd = pnt.length - n + 1;
        int wEnd = pwe.length - n + 1;
        int dMin = Integer.MAX_VALUE;
        int tMin = -1;
        int wMin = -1;
        // Classical brute force O(N^2)
        for( int t = 0; t < tEnd; t++ ){
            for( int w = 0; w < wEnd; w++ ){
                int d = 0;
                for( int j = 0; j < n; j++ ){
                    d += Math.abs( pnt[t + j] - pwe[w + j] );
                }
                if( d < dMin ){
                    dMin = d;
                    tMin = t;
                    wMin = w;
                }
            }
        }
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode output = mapper.createObjectNode();
        output.put( "d.min", dMin );
        output.put( "s.pnt", tMin );
        output.put( "s.pwe", wMin );
        return output.toString();
    }
    public static void main( String args[] ){
        try {
            Scanner scanner = new Scanner( System.in );
            String json = scanner.nextLine();
            ObjectMapper om = new ObjectMapper();
            Sprint sprint = om.readValue( json, Sprint.class );
            System.out.println( doTheMath( sprint ));
        } catch( Throwable t ){
            System.out.println( t.getMessage());
        }
    }
}
////////////////////////////////////////////////////////////////////////
