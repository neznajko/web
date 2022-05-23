package io.pliant.internship2022.service.locator;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public interface ServiceLocator {

    /**
     * Registers object in the Service locator.
     * @param service the object to be registered
     * @param name the name to be associated with the object
     * @throws ServiceLocatorException when service with that name was already registered or on exception during method execution
     */
    void register(Object service, String name) throws ServiceLocatorException;

    /**
     * Registers object in the Service locator.
     * The name, associated with the object, is the camel case representation of object's class name.
     * @param service the object to be registered
     * @throws ServiceLocatorException when service with the associated name was already registered or on exception during method execution
     */
    void register(Object service) throws ServiceLocatorException;

    /**
     * Registers a class in the Service locator.
     * This class is used as a factory for lazily creating service instances, when requested by {@link #get(String)}, {@link #get(Class)} or {@link #getAll(Class)} methods.
     * The name, associated with the object, is the camel case representation of object's class name.
     * @param serviceClass the class to be registered
     * @param name the name to be associated with the class
     * @throws ServiceLocatorException when service with that name was already registered or on exception during method execution
     */
    void register(Class<?> serviceClass, String name) throws ServiceLocatorException;

    /**
     * Registers a class in the Service locator.
     * This class is used as a factory for lazily creating service instances, when requested by {@link #get(String)}, {@link #get(Class)} or {@link #getAll(Class)} methods.
     * The name, associated with the class, is the camel case representation of the class' name.
     * @param serviceClass the class to be registered
     * @throws ServiceLocatorException when service with the associated name was already registered or on exception during method execution
     */
    void register(Class<?> serviceClass) throws ServiceLocatorException;

    /**
     * Looks up registration, associated with the specified name. If name is associated with an object, returns the object.
     * If name is associated with a class then creates instance of that class, registers it internally and returns it.
     * Subsequent calls with the same name must return the same object.
     * @param name name for which object is to be retrieved
     * @return object, associated with the name
     * @throws ServiceLocatorException when no registration satisfy the lookup or on exception during method execution
     */
    Object get(String name) throws ServiceLocatorException;

    /**
     * Looks up registration that is instance or descendant of the specified class.
     * If a registration is associated with an object, and that object is instance or descendant of serviceClass, returns the object.
     * If a registration is associated with a class, and that class is serviceClass or descendant of serviceClass, then creates instance of that class, registers it internally and returns it.
     * Subsequent calls with the same serviceClass must return the same object.
     * If serviceClass represents interface, then candidate registrations must implement that interface.
     * @param serviceClass class for which object is to be retrieved
     * @return object, associated with the class
     * @throws ServiceLocatorException when none or more than one registration satisfy the lookup or on exception during method execution
     */
    <T> T get(Class<T> serviceClass) throws ServiceLocatorException;

    /**
     * Looks up all registrations that are instances or descendants of the specified class.
     * If a registration is associated with an object, and that object is instance or descendant of serviceClass, adds the object to the result.
     * If a registration is associated with a class, and that class is serviceClass or descendant of serviceClass, then creates instance of that class, registers it internally and adds it to the result.
     * Subsequent calls with the same serviceClass must include the same objects previously instantiated by the class registrations.
     * If serviceClass represents interface, then candidate registrations must implement that interface.
     * If no registrations satisfy the lookup, returns empty list.
     * @param serviceClass class for which objects are to be retrieved
     * @return list of objects, associated with the class
     * @throws ServiceLocatorException on exception during method execution
     */
    <T> List<T> getAll(Class<T> serviceClass) throws ServiceLocatorException;
    
}
