////////////////////////////////////////////////////////////////
package io.pliant.internship2022.service.locator;
////////////////////////////////////////////////////////////////
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import java.util.ArrayList;
////////////////////////////////////////////////// Test Services
interface Copy {}
class Amazon implements Copy {
    static int n_ = 0;
    public Amazon() {
        System.out.println( "Amazon, " + ++n_ + " books." );
    }
}
class Audio {
    public Audio() {
        System.out.println( "Audio" );
    }
}
class Dolby extends Audio {
    public Dolby() {
        super();
    }
}
////////////////////////////////////////////////////////////////
@SuppressWarnings("serial")
class ObjectRegisterException extends ServiceLocatorException { 
    public ObjectRegisterException( Object obj, String name ){
        super( "Service object <" + obj.toString() +
               "> can't be registered with name \"" + name +
               "\", already in use!" );
    }
}
@SuppressWarnings("serial")
class ClassRegisterException extends ServiceLocatorException { 
    public ClassRegisterException( Class<?> c, String name ){
        super( "Service class <" + c.getName() +
               "> can't be registered with name '" + name +
               "', already in use!" );
    }
}
////////////////////////////////////////////////////////////////
public class ServiceLocatorImpl implements ServiceLocator {
    HashMap<String, Object>   obj_;   // name -> srv obj mapping
    HashMap<String, Class<?>> class_; // name -> factory mapping
    ////////////////////////////////////////////////////////////
    /** {@link #toCamelCase(String)} helper function.
     * @param word Hm.., what ..
     */
    static String cap( String word ){
        return( word.substring( 0, 1 ).toUpperCase() +
                word.substring( 1    ).toLowerCase());
    }
    /** Convyort io.haha.boOm.SOME.stuff to ioHahaBoomSomeStuff
     * @param name .. is this?
     */
    static String toCamelCase( String name ){
        String[] words = name.split( "\\." );
        String camelCase = words[0].toLowerCase();
        for( int j = 1; j < words.length; j++ ){
            camelCase += cap( words[j]);
        }
        return camelCase;
    }
    ////////////////////////////////////////////////////////////
    void dmp() {
        System.out.println( Arrays.asList( obj_ ));
        System.out.println( Arrays.asList( class_ ));
    }
    ////////////////////////////////////////////////////////////
    /**
     * Registers object in the Service locator( obj_ ).
     * @param service the object to be registered
     * @param name the name to be associated with the object
     * @throws ServiceLocatorException when service with that
     * name was already registered or on exception during method
     * execution
     */
    ////////////////////////////////////////////////////////////
    public void register( Object service, String name ) throws
        ServiceLocatorException {
        // Check if object with that name is already
        // registered, in that case throw a volley,
        // otherwise register the object, and chill.
        if( obj_.containsKey( name )){
            throw new ObjectRegisterException( service, name );
        } else {
            obj_.put( name, service );
        }
    }
    ////////////////////////////////////////////////////////////
    /**
     * Registers object in the Service locator.         ( obj_ )
     * The name, associated with the object, is the camel case
     * representation of object's class name.
     * @param service the object to be registered
     * @throws ServiceLocatorException when service with the
     * associated name was already registered or on exception
     * during method execution
     */
    public void register( Object service ) throws
        ServiceLocatorException {
        // Get service's name, convert to Camel Case and
        // than use the above method.
        String name = service.getClass().getName();
        this.register( service, toCamelCase( name ));
    }
    ////////////////////////////////////////////////////////////
    /**                                               ( class_ )
     * Registers a class in the Service locator. This class is
     * used as a factory for lazily creating service instances,
     * when requested by {@link #get(String)}, {@link #get(Class)}
     * or {@link #getAll(Class)} methods.
     * @param serviceClass the class to be registered
     * @param name the name to be associated with the class
     * @throws ServiceLocatorException when service with that
     * name was already registered or on exception during method
     * execution
     */
    public void register( Class<?> serviceClass, String name ) throws
        ServiceLocatorException {
        // Check for duplicates, and than go!
        if( class_.containsKey( name )){
            throw new ClassRegisterException( serviceClass, name );
        } else {
            class_.put( name, serviceClass );
        }
    }
    ////////////////////////////////////////////////////////////
    /**
     * Registers a class in the Service locator.( class_ )
     * This class is used as a factory for lazily creating
     * service instances, when requested by {@link #get(String)},
     * {@link #get(Class)} or {@link #getAll(Class)} methods.
     * The name, associated with the class, is the camel case
     * representation of the class' name.
     * @param serviceClass the class to be registered
     * @throws ServiceLocatorException when service with the
     * associated name was already registered or on exception
     * during method execution
     */
    public void register( Class<?> serviceClass ) throws
        ServiceLocatorException {
        // Basically as above.
        String name = toCamelCase( serviceClass.getName() );
        this.register( serviceClass, name );
    }
    ////////////////////////////////////////////////////////////    
    /**
     * Looks up registration, associated with the specified
     * name. If name is associated with an object, returns the
     * object. If name is associated with a class then creates
     * instance of that class, registers it internally and
     * returns it. Subsequent calls with the same name must
     * return the same object.
     * @param name name for which object is to be retrieved
     * @return object, associated with the name
     * @throws ServiceLocatorException when no registration
     * satisfy the lookup or on exception during method
     * execution
     */
    public Object get( String name ) throws
        ServiceLocatorException {
        Object obj = null; // return nil if no match
        if( obj_.containsKey( name )){
            obj = obj_.get( name );
        } else if( class_.containsKey( name )){
            try {
                var c = class_.get( name );
                obj = c.getConstructor().newInstance();
                this.register( obj, name );
            } catch( Throwable t ){
                throw new ServiceLocatorException( t.getMessage());
            }
        }
        return obj;
    }
    ////////////////////////////////////////////////////////////    
    /**
     * Looks up registration that is instance or descendant of
     * the specified class. If a registration is associated
     * with an object, and that object is instance or descendant
     * of serviceClass, returns the object. If a registration
     * is associated with a class, and that class is
     * serviceClass or descendant of serviceClass, then creates
     * instance of that class, registers it internally and
     * returns it. Subsequent calls with the same serviceClass
     * must return the same object. If serviceClass represents
     * interface, then candidate registrations must implement
     * that interface.
     * @param serviceClass class for which object is to be
     * retrieved
     * @return object, associated with the class
     * @throws ServiceLocatorException when none or more than
     * one registration satisfy the lookup or on exception
     * during method execution
     */
    @SuppressWarnings("unchecked")
    public <T> T get( Class<T> serviceClass ) throws
        ServiceLocatorException {
        // fst loop over objects
        for( String key: obj_.keySet() ){
            T obj = (T)obj_.get( key );
            if( serviceClass.isAssignableFrom( obj.getClass() )){
                return obj;
            }
        }
        // if not found loop over classes
        for( String key: class_.keySet() ){
            Class<T> c = (Class<T>)class_.get( key );
            if( serviceClass.isAssignableFrom( c )){
                try {
                    var obj = c.getConstructor().newInstance();
                    this.register( obj );
                    return obj;
                } catch( Throwable t ){
                    throw new ServiceLocatorException( t.getMessage());
                }
            }
        }
        return null; // not found
    }
    /**
     * Looks up all registrations that are instances or
     * descendants of the specified class.  If a registration is
     * associated with an object, and that object is instance or
     * descendant of serviceClass, adds the object to the
     * result. If a registration is associated with a class,
     * and that class is serviceClass or descendant of
     * serviceClass, then creates instance of that class,
     * registers it internally and adds it to the result.
     * Subsequent calls with the same serviceClass must include
     * the same objects previously instantiated by the class
     * registrations. If serviceClass represents interface,
     * then candidate registrations must implement that
     * interface. If no registrations satisfy the lookup,
     * returns empty list.
     * @param serviceClass class for which objects are to be
     * retrieved
     * @return list of objects, associated with the class
     * @throws ServiceLocatorException on exception during
     * method execution
     */
    @SuppressWarnings("unchecked")
    public <T> List<T> getAll( Class<T> serviceClass ) throws
        ServiceLocatorException {
        List<T> list = new ArrayList<>();
        for( String key: obj_.keySet() ){
            T obj = (T)obj_.get( key );
            if( serviceClass.isAssignableFrom( obj.getClass() )){
                list.add( obj );
            }
        }
        if(! list.isEmpty() ) return list;
        try {
            for( String key: class_.keySet() ){
                Class<T> c = (Class<T>)class_.get( key );
                if( serviceClass.isAssignableFrom( c )){
                    var obj = c.getConstructor().newInstance();
                    this.register( obj );
                    list.add( obj );
                }
            }
        } catch( Throwable t ){
            throw new ServiceLocatorException( t.getMessage());
        }
        return list;
    }    
    ////////////////////////////////////////////////////////////
    public ServiceLocatorImpl() {
        obj_   = new HashMap<>();
        class_ = new HashMap<>();
    }
    ////////////////////////////////////////////////////////////
    public static void main( String[] args ){
        ServiceLocatorImpl loc = new ServiceLocatorImpl();
        Amazon amzn = new Amazon();
        Audio audio = new Audio();
        try {
            loc.register( amzn, "Bezos" );
            loc.register( amzn );
            loc.register( Amazon.class, "Copy" );
            loc.register( Audio.class );
            loc.register( Dolby.class, "Surround" );
            loc.dmp();
            var list = loc.getAll( Audio.class );
            System.out.println( list );
        } catch( ServiceLocatorException e ){
            System.out.println( e.getMessage() );
        }
        loc.dmp();
    }
}
////////////////////////////////////////////////////////////////

