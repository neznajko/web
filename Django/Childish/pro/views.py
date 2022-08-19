################################################################
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework import status
################################################################
from .models import Order
from .serializers import OrderSerializer
################################################################
@api_view([ 'GET', 'POST' ])
def pro_view( request ):
    if request.method == 'GET': ################################
        pagination_class = api_settings.DEFAULT_PAGINATION_CLASS
        paginator = pagination_class()
        orders = Order.objects.all()
        page = paginator.paginate_queryset( orders, request  )
        serializer = OrderSerializer( page, many=True )
        return paginator.get_paginated_response( serializer.data )
    elif request.method == 'POST': #############################
        serializer = OrderSerializer( data=request.data )
        if serializer.is_valid():
            serializer.save()
            return Response( serializer.data,
                             status=status.HTTP_201_CREATED)
        return Response( serializer.errors,
                         status=status.HTTP_400_BAD_REQUEST )
################################################################
@api_view([ 'GET', 'PUT', 'DELETE' ])
def duct_view( request, pk ):
    """ RUD an order
    """
    try:
        order = Order.objects.get( pk=pk )
    except Order.DoesNotExist:
        return Response( status=status.HTTP_404_NOT_FOUND )
    if request.method == 'GET': ################################
        serializer = OrderSerializer( order )
        return Response( serializer.data )
    elif request.method == 'PUT': ##############################
        serializer = OrderSerializer( order, data=request.data )
        if serializer.is_valid():
            serializer.save()
            return Response( serializer.data )
        return Response( serializer.errors,
                         status=status.HTTP_400_BAD_REQUEST )
    elif request.method == 'DELETE': ###########################
        order.delete()
        return Response( status=status.HTTP_204_NO_CONTENT )
################################################################
# log: 1:13 - 1:24 = 10min
#      1:47 - 2:16 = 26min
#      2:41 - 3:12 = 31min
