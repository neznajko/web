################################################################
from django.db import models
################################################################
# +----------------------+-------------------------------------+
# | Product              | Order                               |
# +-------+--------------+----------+--------------------------+
# | Title | CharField    | Date     | DateField                |
# +-------+--------------+----------+--------------------------+
# | Price | DecimalField | Products | ManyToManyField(Product) |
# +-------+--------------+----------+--------------------------+
################################################################
class Product( models.Model ):
    title = models.CharField( max_length=50 )
    price = models.DecimalField( max_digits=6, decimal_places=2 )
    #
    class Meta:
        ordering = [ 'price' ]
    def __str__( self ):
        return self.title
################################################################
class Order( models.Model ):
    date = models.DateField()
    products = models.ManyToManyField( Product )
    #
    class Meta:
        ordering = [ 'date' ]
    def __str__( self ):
        year = self.date.year
        month = self.date.month
        day = self.date.day
        return f"{year}-{month}-{day}"
################################################################
# log:
################################################################
# 1. Coffee,     25.00 #### 1. 1, 1 #### 1. 2022-8-17
# 2. Nintendo,  726.00 #### 2. 2, 1 #### 2. 2022-7-1
# 3. Seiko,     224.99 #### 3. 3, 2
