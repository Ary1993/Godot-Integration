"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, redirect
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Products, Wishes, ShoppingCarts, ShoppingCartItems, Comments, Stores
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import stripe
import os

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API
stripe.api_key = os.getenv("stripe.api_test")

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return response_body, 200


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    # Reemplazar por lógica consultando la DB.
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active == True)).scalar()
    if not user: 
        response_body["message"] = "Email o pasword incorrecto"
        return response_body, 401
    access_token = create_access_token(identity=user.serialize())  # Lo que el back quiere agregar en el token
    response_body['access_token'] = access_token
    response_body['message'] = "Usuario logeado con éxito"
    # agregar en el result el carrito del user y sus items
    # agregar en el result los wishes del user
    response_body['results'] = user.serialize()
    return response_body, 200


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@api.route('/users/<int:id>', methods=['GET'])
def handle_user_id(id):
    response_body = {} 
    # Buscar usuario por ID
    user = db.session.get(Users,id)
    response_body["results"] = user.serialize()
    response_body["message"] = "Usuario encontrado con éxito."
    return response_body, 200  # Código de estado para "Éxito"

@api.route("/signup", methods=["POST"])
def signup():
    response_body = {}
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    nick_name = request.json.get("nick_name", None)
    is_admin = request.json.get("is_admin", False)
    user_exists = db.session.execute(db.select(Users).where(Users.email == email)).scalar()
    print(user_exists)
    if user_exists:
        response_body["message"] = "El email ya esta registrado"
        return jsonify(response_body), 400
    new_user = Users(email=email,
                     password=password,
                     nick_name=nick_name,
                     is_active=True,
                     is_admin=is_admin)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user.serialize()) #preguntar al profe
    response_body["access_token"] = access_token #preguntar al profe
    response_body["message"] = "Usuario registrado con exito"
    response_body["user"] = new_user.serialize()
    return jsonify(response_body), 201
    

@api.route('/products', methods=['GET','POST'])  # comenzamos con el endpoints
def handle_products():  #definimos nuestro enpoints
    response_body = results = {}
    #  comprehension esta implementacion
    if request.method == 'GET':
        try:
        # logica para consultar la base de dato y devolver todos los usuarios
            products = db.session.execute(db.select(Products)).scalars()  # de donde va a sacar el resultado
            response_body['results'] = [product.serialize() for product in products]  # el resultado que va a mostrar en forma de lista
            response_body['message'] = 'Success'
            return jsonify(response_body), 200  # lo que exactamente nos mostrara
        except KeyError as e:
            response_body['message'] = f'Some Error {str(e)}'
            return jsonify(response_body), 400
    if request.method == 'POST':
        try:
            data = request.json # se pasan los datos del usuario desde la solicitud
            product = Products(name = data['name'], # los datos con los cual se crearan el usuario
                     price = data['price'],
                     discount = data['discount'],
                     description = data ['description'],
                     image_url = data ['image_url'])
            db.session.add(product) # para añadir a la session
            db.session.commit() # para confirmar el añadir al usuario
            response_body['results'] = product.serialize()
            response_body['message'] = 'product Created'
            return jsonify(response_body), 201 # 201 (creado)
        except KeyError as e:
            response_body['message'] = f'Some Error {str(e)}'
            return jsonify(response_body), 400


# TODO: hacer el endd point products/id para metodo get para ver los datos de un producto GET/PUT/DELETE

@api.route('/wishes', methods=['GET', 'POST'])
@jwt_required()
def add_to_wished():
    response_body = {}
    current_user = get_jwt_identity()
    if request.method == 'GET':
        if current_user["is_admin"]:
            wishes = db.session.execute(db.select(Wishes)).scalars()  # de donde va a sacar el resultado
            response_body['results'] = [row.serialize() for row in wishes]  # el resultado que va a mostrar en forma de lista
            response_body['message'] = 'Success'
            return response_body, 200
        #hacer el user comun
        #wishes = db.session.execute(db.select(Wishes, Users, Products)).where(Wishes.user_id==current_user["id"]).join(Users, Users.id==Wishes.users_id, isouter=True).all()
        wishes = db.session.query(Wishes, Users, Products).\
                            join(Users, Users.id==Wishes.user_id, isouter=True).\
                            join(Products, Products.id==Wishes.product_id, isouter=True).\
                            where(Wishes.user_id==current_user["id"]).all()
        print (wishes)
        response_body['results'] = [[row[0].serialize(), row[2].serialize()] for row in wishes]  # el resultado que va a mostrar en forma de lista
        response_body['message'] = 'Success User'    
        return response_body
    if request.method == 'POST':
        data = request.json
        wish = Wishes(user_id = user_id, product_id = data["product_id"])
        db.session.add(wish)
        db.session.commit()
        response_body["message"]= "Responde el POST"
        return response_body

@api.route('/wishes/<int:wish_id>', methods=['DELETE'])
@jwt_required()
def delete_wish(wish_id):
    response_body = {}
    current_user = get_jwt_identity()
    
    # Verificar si el usuario es un administrador
    if current_user["is_admin"]:
        return {"message": "Unauthorized"}, 401
    
    # Buscar el deseo a eliminar por su ID
    wish = Wishes.query.get(wish_id)
    
    # Verificar si el deseo existe
    if not wish:
        return {"message": "Wish not found"}, 404
    
    # Eliminar el deseo
    db.session.delete(wish)
    db.session.commit()
    
    response_body["message"] = "Wish deleted successfully"
    return response_body, 200

# hay que instalar stripe, importalo y usar la llave personalisada

@api.route('/checkout', methods=['POST'])
def checkout():
    try:
        json_data = request.get_json(force=True)
        email = json_data.get('email')
        product_ids = json_data.get('product_ids', [])

        if not email or not product_ids:
            return jsonify({'error': 'Email and product IDs are required'}), 400

        # Busca los Stripe price IDs en tu base de datos para cada producto ID recibido
        line_items = []
        for prod_id in product_ids:
            product = Products.query.filter_by(id=prod_id, is_active=True).first()
            if product:
                line_items.append({
                    'price': product.stripe_key,
                    'quantity': 1,
                })

        if not line_items:
            return jsonify({'error': 'No valid products found'}), 400

        # Crea una nueva sesión de checkout con Stripe
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer_email=email,
            line_items=line_items,
            mode='payment',
            success_url='https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://example.com/cancel',
        )

        # Retorna la URL de la sesión para redirigir al usuario
        return jsonify({'checkout_url': checkout_session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# @api.route('/checkout', methods=['GET'])   # revisar mas adelante si sobra tiempo para automatizar todo  a la hora de la creacion de producto se vincule con la api stripe
# def get_checkout():
#     try:
#         # Extrae el email del parámetro de consulta de la solicitud
#         email = request.args.get('email')
#         if not email:
#             return jsonify({'error': 'Email is required'}), 400

#         # Obtén los detalles del precio para extraer el ID del producto y el precio
#         price_id = 'price_1Oye4sCRvrCTFzksDaV5jHfX'
#         price = stripe.Price.retrieve(price_id)
#         product_id = price.product

#         # El precio en la moneda correcta (dividido por 100 para convertir a euros)
#         amount = float(price.unit_amount_decimal) / 100
#         currency = price.currency  # La moneda del precio

#         # Ahora, obtén los detalles del producto utilizando el product_id
#         product = stripe.Product.retrieve(product_id)
#         product_name = product.name  # Este es el nombre del producto
#         product_description = product.description  # Descripción del producto
#         # La URL de la imagen del producto; asumiendo que usas el primer elemento de images
#         product_image_url = product.images[0] if product.images else None

#         # Crea un nuevo intento de pago con Stripe
#         checkout_session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             customer_email=email,
#             line_items=[{
#                 'price': price_id,
#                 'quantity': 1,
#             }],
#             mode='payment',
#             success_url='https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
#             cancel_url='https://example.com/cancel',
#         )

#         # Retorna la URL de la sesión para redirigir al usuario, incluyendo el nombre, precio, descripción, y URL de la imagen del producto
#         return jsonify({
#             'checkout_url': checkout_session.url,
#             'product_name': product_name,
#             'price': f"{amount:.2f} {currency.upper()}",  # Formatea el precio para mostrarlo correctamente
#             'description': product_description,
#             'image_url': product_image_url
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400


# Ruta para manejar la creación de un nuevo carrito de compras
"""@api.route('/carts', methods=['POST'])
#@jwt_required()  # Requiere autenticación JWT
def add_cart():
    #current_user_id = get_jwt_identity()
    data = request.json
    user_id = data.get('user_id')

    #if current_user_id != user_id:
     #   return jsonify({'message': 'No tienes permiso para realizar esta acción'}), 403

    if user_id is None:
        return jsonify({'message': 'Se requiere el ID de usuario para crear un carrito'}), 400

    # Crear un nuevo carrito de compras
    add_cart = ShoppingCarts(user_id=user_id)
    db.session.add(add_cart)
    db.session.commit()

    return jsonify({'message': 'Carrito creado exitosamente', 'cart_id': add_cart.id}), 201"""

# Ruta para obtener un carrito de compras por su ID
@api.route('/carts/<int:cart_id>', methods=['GET','DELETE'])
@jwt_required()  # Requiere autenticación JWT
def hundle_cart(cart_id):
    current_user = get_jwt_identity()
    cart = ShoppingCarts.query.get(cart_id)
    if cart is None:
        return jsonify({'message': 'Carrito no encontrado'}), 404
    if  current_user["id"] != cart.user_id:
        return jsonify({'message': 'no autorizado'}), 404
    if request.method == 'GET': 
        # Obtener los ítems del carrito
        items = ShoppingCartItems.query.filter_by(shopping_cart_id=cart_id).all()
        serialized_items = [item.serialize() for item in items]
        # Serializar el carrito junto con los ítems
        cart_data = cart.serialize()
        cart_data['items'] = serialized_items
        return jsonify(cart_data), 200
    if request.method == 'DELETE': 
        # Borrar todos los ítems del carrito
        ShoppingCartItems.query.filter_by(shopping_cart_id=cart_id).delete()
        db.session.delete(cart)
        db.session.commit()
        return jsonify({'message': 'Todos los ítems del carrito han sido eliminados exitosamente'}), 200


# Ruta para obtener un carrito de compras por su ID
@api.route('/carts', methods=['GET'])
@jwt_required()  # Requiere autenticación JWT
def get_cart():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    #cart = ShoppingCarts.filter(user_id == current_user["id"])
    cart = db.session.execute(db.select(ShoppingCarts).where(ShoppingCarts.user_id == user_id)).scalar()
    if cart is None:
        #haacer el serialize de todos los items 

# Ruta para agregar un producto a un carrito de compras
@api.route('/cart-items', methods=['POST'])
@jwt_required()  # Requiere autenticación JWT
def agregar_producto():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    #cart = ShoppingCarts.filter(user_id == current_user["id"])
    cart = db.session.execute(db.select(ShoppingCarts).where(ShoppingCarts.user_id == user_id)).scalar()
    if cart is None:
        cart = ShoppingCarts(user_id=user_id)
        db.session.add(cart)
        db.session.commit()
    #if cart.user_id != current_user_id:
     #   return jsonify({'message': 'No tienes permiso para realizar esta acción'}), 403
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    product = db.session.execute(db.select(Products).where(Products.id == product_id)).scalar()
    if not all([product_id, quantity]):
        return jsonify({'message': 'Se requieren los campos product_id y quantity'}), 400
    if product is None:
        return jsonify({'message': 'el producto no existe'}), 400
    price = product.price
    # Crear un nuevo item en el carrito
    new_item = ShoppingCartItems(quantity=quantity,
                                 price=price,
                                 shopping_cart_id=cart.id,
                                 product_id=product_id)
    db.session.add(new_item)
    db.session.commit()
    return jsonify({'message': 'Producto agregado exitosamente al carrito', 'item_id': new_item.id}), 201

# Ruta para borrar un ítem específico del carrito
@api.route('/cart-items/<int:item_id>', methods=['DELETE'])
@jwt_required()  # Requiere autenticación JWT
def borrar_item_carrito(cart_id, item_id):
    current_user_id = get_jwt_identity()
    cart = ShoppingCarts.query.get(cart_id)
    if cart is None:
        return jsonify({'message': 'Carrito no encontrado'}), 404

    # Buscar el ítem en el carrito
    item = ShoppingCartItems.query.filter_by(id=item_id, shopping_cart_id=cart_id).first()
    if item is None:
        return jsonify({'message': 'Ítem no encontrado en el carrito'}), 404

    # Borrar el ítem del carrito
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'message': 'Ítem del carrito eliminado exitosamente'}), 200


"""@api.route('/carts', methods=['GET', 'POST'])
@jwt_required()
def add_to_cart():
    response_body = {}
    current_user = get_jwt_identity()
    print(current_user) 
    if request.method == 'GET':
        if current_user["is_admin"]:
            carts = db.session.execute(db.select(ShoppingCarts)).scalars()  # de donde va a sacar el resultado
            response_body['results'] = [row.serialize() for row in carts]  # el resultado que va a mostrar en forma de lista
            response_body['message'] = 'Success'
            return response_body, 200
        
        print (carts)
        response_body['results'] = [[row.serialize()] for row in carts]  # el resultado que va a mostrar en forma de lista
        response_body['message'] = 'Success User'
    if request.method == 'POST':
        if current_user["is_admin"]:
            response_body["message"] = "El administrador no puede comprar"
        return response_body, 403
    # Buscar si el usuario ya tiene un carrito
        data = request.json
        wish = ShoppingCartItems(user_id = user_id, product_id = data["product_id"])
        db.session.add(cart)
        db.session.commit()
        response_body["message"]= "Responde el POST"
        return response_body, 200

    if existing_cart is None:
        # Crear el carrito aquí si no existe
        cart = ShoppingCarts(user_id=current_user['user_id'])
        db.session.add(cart)
        db.session.commit()
        response_body["message"] = "Carrito creado exitosamente."
        return response_body, 200
    else:
        response_body["message"] = "Ya tienes un carrito."
        return response_body, 403  

@api.route('/carts/<int:product_id>', methods=['DELETE'])
def delete_cart(user_id, product_id):
    #tengo que verificar con el token quien es el user que hace la peticion 
    response_body = {}
    data = request.json
    # toma una instancia del modelo: wishes
    #wish = Wishes(user_id = user_id, product_id = data["product_id"])
    cart = ShoppingCarts.query.filter_by(user_id=user_id, product_id=product_id).first()
    if cart:
        if request.method == 'GET':
            return response_body
        if request.method == 'DELETE':
            response_body["message"]= "Responde el Delete"
            response_body["result"]= cart.serialize()
            db.session.delete(cart)
            db.session.commit()
            return response_body
    else:
        response_body["message"] = "NONE"
        return response_body, 400"""

@api.route('/products/<int:product_id>/comments', methods=['GET', 'POST'])
def comment(product_id):
    response_body = {}
    if request.method == 'GET':
        # el user ve los comentarios 
        comments = db.session.execute(db.select(Comments).where(Comments.product_id == product_id)).scalars()        
        response_body['results'] = [row.serialize() for row in comments]  # el resultado que va a mostrar en forma de lista
        response_body['message'] = 'Success'
        return response_body, 200
    if request.method == 'POST':
        data = request.json # se pasan los datos del usuario desde la solicitud
        comment = Comments(product_id = product_id,
                           user_id = data['user_id'],
                           comment = data['comment'], # los datos con los cual se crearan el usuario
                           value = data['value'])
        db.session.add(comment) # para añadir a la session
        db.session.commit() # para confirmar el añadir al usuario
        response_body['results'] = comment.serialize()
        response_body['message'] = 'Comment Created'
        return jsonify(response_body), 201 # 201 (creado)


# las ruta stores hay que preguntarle al profe si hay que hacer la store y como 

@api.route('/store', methods=['GET', 'POST'])
@jwt_required()
def store():
    if request.method == 'GET':
        # Aquí puedes implementar la lógica para obtener todos los productos disponibles en la tienda
        # junto con su información adicional desde la tabla Stores
        stores = Stores.query.all()
        serialized_products = [store.serialize() for store in stores]
        return jsonify({"stores": serialized_products}), 200

    elif request.method == 'POST':
        # Verificar si el usuario es un administrador
        current_user = get_jwt_identity()
        if not current_user["is_admin"]:
            return jsonify({"message": "Unauthorized"}), 401

        # Aquí puedes implementar la lógica para agregar un nuevo producto a la tienda
        data = request.json
        product_id = data.get('product_id')
        code_key = data.get('code_key')

        # Verificar si el producto existe
        product = Products.query.get(product_id)
        if not product:
            return jsonify({"message": "El producto no existe"}), 404

        # Crear un nuevo registro en la tabla Stores
        new_store = Stores(product_id=product_id, code_key=code_key)

        # Guardar el nuevo registro en la base de datos
        db.session.add(new_store)
        db.session.commit()

        return jsonify({"message": "Producto agregado exitosamente a la tienda"}), 201

@api.route('/store/<int:store_id>', methods=['DELETE'])
def delete_product_from_store(store_id):
    # Verificar si el usuario es un administrador
    current_user = get_jwt_identity()
    if not current_user["is_admin"]:
        return jsonify({"message": "Unauthorized"}), 401

    # Buscar el registro de la tienda por su ID
    store = Stores.query.get(store_id)

    if not store:
        return jsonify({"message": "El producto no está en la tienda"}), 404

    # Eliminar el producto de la tienda
    db.session.delete(store)
    db.session.commit()

    return jsonify({"message": "Producto eliminado exitosamente de la tienda"}), 200