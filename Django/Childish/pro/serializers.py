################################################################
from rest_framework import serializers
################################################################
from .models import Product, Order
################################################################
class ProductSerializer( serializers.ModelSerializer ):
    class Meta:
        model = Product
        fields = '__all__'
################################################################
def add_products( products_data, order ):
    for product in products_data:
        qset = Product.objects.filter( **product )
        if len( qset ):
            order.products.add( qset[0] )
        else:
            order.products.add( Product.objects.create( **product ))
################################################################
class OrderSerializer( serializers.ModelSerializer ):
    products = ProductSerializer( many=True )
    class Meta: ################################################
        model = Order
        fields = '__all__'
    def create( self, validated_data ): ########################
        products_data = validated_data.pop( 'products' )
        order = Order.objects.create( **validated_data )
        add_products( products_data, order )
        return order
    def update( self, instance, validated_data ): ##############
        instance.date = validated_data.get( 'date', instance.date )
        instance.products.clear();
        products_data = validated_data.pop( 'products' );
        for product in products_data:
            qset = Product.objects.filter( **product )
            if len( qset ):
                instance.products.add( qset[0] )
            else:
                instance.products.add( Product.objects.create( **product ))
        instance.save()
        return instance
################################################################
