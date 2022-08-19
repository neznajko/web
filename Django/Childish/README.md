The virtual environment was created with:
```bash
python3 -m venv env
```
All installed programs are in ``requirements.txt``.

There is an admin/ page:
```
user: admin
mail: admin@admin.com
pass: password123
```

at api/ there is a *pagination*, and ONE CAN SIMPLY POST an
order as well, for example in a *json* format with something
like:
```
{
    "products": [
        {
            "title": "Logitech G435 Lightspeed",
            "price": "123.98"
        },
        {
            "title": "Garnier Botanic Therapy",
            "price": "6.99"
        },
        {
            "title": "DJI Mavic Air 2S",
            "price": "1949.99"
        },
        {
            "title": "Wok Tefal Unlimited",
            "price": "71.00"
        }
    ],
    "date": "2022-08-19"
}
```
if there is no such product it will be created here.

To make ***RUD*** request the *primary key* is used, for
example ``http://127.0.0.1:8000/api/3``

For the statistics a *json* ***HttpResponse*** is returned, for example at:
```
/api/stats/?date_start=2022-07-01&date_end=2022-10-28&metric=count
```

# The End
