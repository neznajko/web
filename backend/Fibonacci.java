////////////////////////////////////////////////////////////////////////
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.File;
import java.awt.Graphics2D;
import java.awt.Color;
////////////////////////////////////////////////////////////////////////
public class Fibonacci {
    /** Generate first n > 0  Fibonacci numbers. */
    static int[] genFibonacci( int n ){        
        int[] tab = new int[n + 1];
        tab[ 0 ] = 1;
        tab[ 1 ] = 1;
        for( int j = 2; j < n; j++ ){
            tab[ j ] = tab[ j - 1 ] + tab[ j - 2 ];
        }
        return tab;
    }
    static void doTheMath( String imagePath, int m, int n ) throws
    Exception {
        BufferedImage myPicture = ImageIO.read( new File( imagePath ));
        BufferedImage copy; // no need of deep copy
        // add Fibonacci title
        myPicture.getGraphics().drawString( "ФибоНачи", 100, 100 );
        int[] tab = genFibonacci( n );
        for( int j = m - 1; j < n; j++ ){
            int w = myPicture.getWidth();
            int h = myPicture.getHeight();
            copy = new BufferedImage( w, h + 50, myPicture.getType());
            Graphics2D g = (Graphics2D) copy.getGraphics();
            g.setFont( g.getFont().deriveFont( 30f ));
            g.setPaint( Color.BLUE ); // Microsoft screen
            g.fillRect( 0, 0, copy.getWidth(), copy.getHeight());
            g.drawImage( myPicture, 0, 0, null );
            g.setPaint( Color.WHITE );
            String msg = ("Като зема " + tab[j] +
                          " дърв"  + ((j < 2) ? "o" : "ета") + " ..." );
            g.drawString( msg, 50, copy.getHeight() - 15 );
            g.dispose();
            myPicture = copy;
        }
        ImageIO.write( myPicture, "png", new File( "img/testing.png" ));        
    }
    public static void main( String[] args ) throws Exception {
        String imagePath = "img/fibonacci.png";
        int m = 6;
        int n = 10;
        doTheMath( imagePath, m, n );
    }
}
////////////////////////////////////////////////////////////////////////
