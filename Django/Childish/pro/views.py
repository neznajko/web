################################################################
import json
from datetime import datetime
################################################################
from django.http import HttpResponse
from django.db.models import Sum
################################################################
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework import status
################################################################
from .models import Order
from .serializers import OrderSerializer
################################################################
FOMAT = '%Y-%m-%d'
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
@api_view([ 'GET' ])
def stat_view( request ):
    """
/api/stats/?date_start=2022-07-01&date_end=2022-10-28&metric=count
    """
    start  = request.query_params.get( 'date_start' )
    end    = request.query_params.get( 'date_end' )
    metric = request.query_params.get( 'metric' )
    ok = start and end and metric
    if not ok: return Response( "Ok" )
    #
    start = datetime.strptime( start, FOMAT )
    end = datetime.strptime( end, FOMAT )
    orders = Order.objects.all().filter(
        date__year__gte  = start.year,
        date__month__gte = start.month,
        date__year__lte  = end.year,
        date__month__lte = end.month
    )
    ls = []
    for item in orders:
        products = item.products.all()
        count = len( products )
        total = products.aggregate( Sum( 'price' ))['price__sum']
        date = item.date.strftime( FOMAT )
        if metric == "count":
            ls.append({ date: count })
        else:
            ls.append({ date: '{0:.2f}'.format( total )})
    return HttpResponse( json.dumps( ls ))
################################################################
# log:
