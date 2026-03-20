from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import F

from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, CartSerializer, OrderSerializer


# 🛍️ GET /products/
@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    products = Product.objects.all().order_by('-id')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# 🛒 helper: get/create user's cart
def get_user_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


# 🛒 GET /cart/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart = get_user_cart(request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)


# ➕ POST /cart/add/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))

    product = get_object_or_404(Product, id=product_id)

    if quantity < 1:
        return Response({"error": "Quantity must be at least 1"}, status=400)

    if product.stock < quantity:
        return Response({"error": "Not enough stock"}, status=400)

    cart = get_user_cart(user)

    # 🔥 FIX HERE (add defaults)
    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )

    if not created:
        new_qty = item.quantity + quantity

        if product.stock < new_qty:
            return Response({"error": "Not enough stock"}, status=400)

        item.quantity = new_qty
        item.save()

    return Response({"message": "Added to cart"})

# ✏️ PATCH /cart/update/
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_cart_item(request):
    user = request.user
    item_id = request.data.get('item_id')
    quantity = int(request.data.get('quantity', 1))

    item = get_object_or_404(CartItem, id=item_id, cart__user=user)

    if quantity < 1:
        return Response({"error": "Quantity must be at least 1"}, status=400)

    if item.product.stock < quantity:
        return Response({"error": "Not enough stock"}, status=400)

    item.quantity = quantity
    item.save()

    return Response({"message": "Cart updated"})


# ❌ DELETE /cart/remove/
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request):
    user = request.user
    item_id = request.data.get('item_id')

    item = get_object_or_404(CartItem, id=item_id, cart__user=user)
    item.delete()

    return Response({"message": "Item removed"})


# 💳 POST /orders/create/
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    cart = get_user_cart(user)
    items = cart.items.all()

    if not items.exists():
        return Response({"error": "Cart is empty"}, status=400)

    order = Order.objects.create(user=user)

    total_price = 0

    for item in items:
        product = item.product

        if product.stock < item.quantity:
            return Response({"error": f"Not enough stock for {product.name}"}, status=400)

        # decrease stock
        product.stock = F('stock') - item.quantity
        product.save()

        price = product.price

        OrderItem.objects.create(
            order=order,
            product=product,
            quantity=item.quantity,
            price=price
        )

        total_price += price * item.quantity

    order.total_price = total_price
    order.save()

    # clear cart
    items.delete()

    return Response({"message": "Order created"})


# 📦 GET /orders/
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-id')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)