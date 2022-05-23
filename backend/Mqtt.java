////////////////////////////////////////////////////////////////////////
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
////////////////////////////////////////////////////////////////////////
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
////////////////////////////////////////////////////////////////////////
import java.nio.charset.StandardCharsets;
////////////////////////////////////////////////////////////////////////
class Input {
    public int    n;
    public int[]  pnt;
    public int[]  pwe;
    public String testId;
    public String replyTopic;
}
////////////////////////////////////////////////////////////////////////
public class Mqtt {
    static String jsonError( String msg ){
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode error = mapper.createObjectNode();
        error.put( "error", msg );
        return error.toString();
    }
    static String doTheMath( Input input ) throws Throwable {
        int n     = input.n;   // shortcuts
        int pnt[] = input.pnt;
        int pwe[] = input.pwe; 
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
        output.put( "d.min",  dMin );
        output.put( "s.pnt",  tMin );
        output.put( "s.pwe",  wMin );
        output.put( "testId", input.testId );
        output.put( "me",     "Dimitar Panayotov" );
        output.put( "email",  "neznajko@yahoo.com" );
        return output.toString();
    }
    public static void main( String args[] ) throws Exception {
        MqttClient client = new MqttClient(
            "tcp://broker.hivemq.com:1883", // URI 
            MqttClient.generateClientId(),  // ClientId 
            new MemoryPersistence());       // Persistence
        client.setCallback( new MqttCallback() {
                // Called when the client lost the connection to the broker 
                @Override
                public void connectionLost( Throwable cause ){
                    System.out.println( "client lost connection " + cause );
                }
                @Override
                public void messageArrived( String topic, MqttMessage message ) throws
                    Exception {
                    System.out.println( topic + ": " + message + "\n" );
                    if( topic.equals( "pliant.io/internship/2020/backend/a2/input" )){
                        try {
                            ObjectMapper om = new ObjectMapper();
                            String json = new String( message.getPayload());
                            Input input = om.readValue( json, Input.class );
                            String output = doTheMath( input );
                            System.out.println( "reply:   " + input.replyTopic );
                            System.out.println( "payload: " + output );
                            //
                            client.publish( 
                                input.replyTopic,       // topic 
                                output.getBytes( StandardCharsets.UTF_8 ), // payload 
                                0,                      // QoS 
                                false);                 // retained?
                        } catch( Throwable t ) {
                            System.out.println( t.getMessage());
                        }
                    }
                }
                // Called when a outgoing publish is complete 
                @Override
                public void deliveryComplete( IMqttDeliveryToken token ){
                    System.out.println( "delivery complete " + token );
                }
            });
        client.connect();
        client.subscribe( "pliant.io/#", 1 );
    }
}
////////////////////////////////////////////////////////////////////////
// https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-eclipse-paho-java/
