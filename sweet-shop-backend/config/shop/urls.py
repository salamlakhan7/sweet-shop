from django.urls import path
from . import views
from .auth_views import register, login

urlpatterns = [
    path('auth/register/', register),
    path('auth/login/', login),

    path('products/', views.product_list),

    path('cart/', views.get_cart),
    path('cart/add/', views.add_to_cart),
    path('cart/update/', views.update_cart_item),
    path('cart/remove/', views.remove_cart_item),

    path('orders/create/', views.create_order),
    path('orders/', views.list_orders),
]