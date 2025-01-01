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
from flask_mail import Mail, Message
import stripe
import os

api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API
stripe.api_key = os.getenv("stripe.api_test")
mail = Mail()

@api.route('/godotweb/<path:filename>', methods=['GET'])
def serve_godotweb_file(filename):
    """
    Serves static files like .wasm, .pck, or other game files from the godotweb directory under `/api`.
    """
    godotweb_directory = os.path.join(os.getcwd(), 'src', 'api', 'godotweb')  # Path to the godotweb files
    filepath = os.path.join(godotweb_directory, filename)  # Full path of the file

    # Debug: Print file being served
    print(f"Attempting to serve file: {filepath}")

    # Check if the file exists
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return jsonify({"error": f"File {filename} not found"}), 404

    # Determine MIME type based on file extension
    mimetype = None
    if filename.endswith('.js'):
        mimetype = 'application/javascript'
    elif filename.endswith('.wasm'):
        mimetype = 'application/wasm'
    elif filename.endswith('.pck'):
        mimetype = 'application/octet-stream'

    # Serve the file
    try:
        print(f"Serving file: {filepath} with MIME type: {mimetype}")
        return send_from_directory(godotweb_directory, filename, mimetype=mimetype)
    except Exception as e:
        print(f"Error while serving file {filepath}: {e}")
        return jsonify({"error": f"Error serving file: {str(e)}"}), 500

@api.route('/game-config', methods=['GET'])
def get_game_config():
    """Returns a sample game configuration"""
    game_config = {
        "args": [],
        "canvasResizePolicy": 2,
        "executable": "/api/godotweb/kkk",  # Include /api prefix
        "experimentalVK": False,
        "fileSizes": {
            "/api/godotweb/kkk.pck": 30784,  # Include /api prefix
            "/api/godotweb/kkk.wasm": 43016933,  # Include /api prefix
        },
        "focusCanvas": True,
        "gdextensionLibs": [],
    }
    return jsonify(game_config), 200

@api.route('/load-script', methods=['GET'])
def load_script():
    """Simulates loading a script"""
    return jsonify({"message": "Script loaded successfully"}), 200

@api.route('/game-progress', methods=['GET'])
def get_game_progress():
    """Returns game progress"""
    progress = {
        "current": 50,
        "total": 100,
    }
    return jsonify(progress), 200

@api.route('/validate-engine', methods=['GET'])
def validate_engine():
    """Validates the game engine"""
    engine_loaded = True
    return jsonify({"engineLoaded": engine_loaded}), 200

@api.route('/start-game', methods=['POST'])
def start_game():
    """Starts the game with provided input data"""
    data = request.json
    if not data:
        return jsonify({"error": "Invalid data format"}), 400

    # Logic to start the game (example: validate inputs and simulate game start)
    print(f"Starting game with data: {data}")
    return jsonify({"status": "Game started successfully!"}), 200

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
    user = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active == True)).scalar()
    if not user:
        response_body["message"] = "Email o password incorrecto"
        return response_body, 401
    access_token = create_access_token(identity=user.serialize())
    response_body['access_token'] = access_token
    response_body['message'] = "Usuario logeado con éxito"
    user_info = user.serialize()
    cart = db.session.query(ShoppingCarts).filter_by(user_id=user.id).first()
    if not cart:
        # Si no existe un carrito, crear uno nuevo
        cart = ShoppingCarts(user_id=user.id)
        db.session.add(cart)
        db.session.commit()
    # Incluir el ID del carrito existente o nuevo en la respuesta
    user_info['cartId'] = cart.id
    response_body['results'] = user_info
    response_body['user'] = user.serialize()
    # agregar en el result el carrito del user y sus items
    cart = db.session.execute(db.select(ShoppingCarts).where(ShoppingCarts.user_id == user.id)).scalar()
    cart_items = []
    if cart:
        # Realizar la consulta para obtener los ítems del carrito y los nombres de los productos asociados
        items = db.session.query(ShoppingCartItems).\
                                 join(Products, Products.id == ShoppingCartItems.product_id).\
                                 add_columns(Products.name.label("product_name")).\
                                 filter(ShoppingCartItems.shopping_cart_id == cart.id).all()
        # Serializar los ítems del carrito incluyendo el nombre del producto
        serialized_items = [
            {
                "id": item.ShoppingCartItems.id,  # Acceder a los atributos del modelo ShoppingCartItems
                "name": item.product_name,  # Acceder al nombre del producto directamente
                "price": item.ShoppingCartItems.price,
                "quantity": item.ShoppingCartItems.quantity
            } for item in items
        ]
        response_body['cart'] =  {
                    "id": cart.id if cart else None,
                    "user_id": cart.user_id if cart else None,
                    "items": serialized_items
                }
    else:
        response_body['cart'] = {}
    # agregar en el result los wishes del user
    wishes = db.session.query(Wishes, Products.name.label("product_name"), Products.image_url.label("image_url")).\
        join(Products, Products.id == Wishes.product_id).\
        filter(Wishes.user_id == user.id).all()
    if wishes:
        # Serializar los deseos incluyendo el nombre del producto y la URL de la imagen
        wishes_data = [
            {
                "id": wish.id,  # Acceder directamente a los atributos del modelo Wishes
                "name": product_name,  # 'product_name' es el nombre del producto, obtenido directamente de la consulta
                "product_id": wish.product_id,
                "image_url": image_url  # 'image_url' es la URL de la imagen del producto
            } for wish, product_name, image_url in wishes
        ]
        # Agrega los deseos serializados al cuerpo de la respuesta
        response_body['wishes'] = wishes_data
    else:
        response_body['wishes'] = []
    # Crear un token de acceso utilizando la información serializada del usuario
    access_token = create_access_token(identity=user.serialize())
    response_body['access_token'] = access_token
    response_body['message'] = "Usuario logeado con éxito"
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
            wishes = db.session.execute(db.select(Wishes)).scalars()
            response_body['results'] = [row.serialize() for row in wishes]
            response_body['message'] = 'Success'
            return response_body, 200
        wishes = db.session.query(Wishes, Users, Products).\
                            join(Users, Users.id==Wishes.user_id, isouter=True).\
                            join(Products, Products.id==Wishes.product_id, isouter=True).\
                            where(Wishes.user_id==current_user["id"]).all()
        response_body['results'] = [{
            "wish_id": wish.id,
            "user_id": wish.user_id,
            "product": {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "description": product.description,
                "image_url": product.image_url
            }
        } for wish, user, product in wishes]
        response_body['message'] = 'Success User'
        return response_body, 200
    if request.method == 'POST':
        data = request.json
        user_id = current_user["id"]
        wish = Wishes(user_id=user_id, product_id=data["product_id"])
        db.session.add(wish)
        db.session.commit()
        response_body["message"] = "Responde el POST"
        response_body["results"] = wish.serialize()
        return response_body, 201

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
        products = json_data.get('products', []) # Ajuste para recibir 'products'

        if not email or not products:
            return jsonify({'error': 'Email and product details are required'}), 400

        line_items = []
        for prod in products:
            product_id = prod.get('product_id')
            quantity = prod.get('quantity', 1) # Asegúrate de manejar un valor predeterminado
            product = Products.query.filter_by(id=product_id, is_active=True).first()
            if product:
                line_items.append({
                    'price': product.stripe_key,
                    'quantity': quantity,
                })

        if not line_items:
            return jsonify({'error': 'No valid products found'}), 400

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer_email=email,
            line_items=line_items,
            mode='payment',
            success_url='https://sample-service-name-ak1a.onrender.com/success',
            cancel_url='https://sample-service-name-ak1a.onrender.com/failed',
        )

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
        # Obtener los ítems del carrito, asegurando que el producto esté cargado
        items = ShoppingCartItems.query.filter_by(shopping_cart_id=cart_id).all()
        serialized_items = []
        for item in items:
            serialized_item = {
                'id': item.id,
                'price': item.price,
                'product_id': item.product_id,
                'quantity': item.quantity,
                'shopping_cart_id': item.shopping_cart_id,
                'product_name': item.products.name,
                "image_url": item.products.image_url  # Accede a la imagen a través de la relación products
            }
            serialized_items.append(serialized_item)
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
        return jsonify({'message': 'no tienes items en el carrito'}), 400

# Ruta para agregar un producto a un carrito de compras
@api.route('/cart-items', methods=['POST'])
@jwt_required()  # Requiere autenticación JWT
def agregar_producto():
    # Obtener identidad del usuario autenticado
    current_user = get_jwt_identity()
    user_id = current_user["id"]

    # Obtener o crear el carrito para el usuario
    cart = db.session.execute(
        db.select(ShoppingCarts).where(ShoppingCarts.user_id == user_id)
    ).scalar()

    if cart is None:
        cart = ShoppingCarts(user_id=user_id)
        db.session.add(cart)
        db.session.commit()
        print(f"Nuevo carrito creado para el usuario {user_id} con ID: {cart.id}")
    else:
        print(f"Carrito encontrado para el usuario {user_id} con ID: {cart.id}")

    # Obtener datos del producto desde el request
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity')

    if not all([product_id, quantity]):
        return jsonify({'message': 'Se requieren los campos product_id y quantity'}), 400

    # Verificar que el producto exista
    product = db.session.execute(
        db.select(Products).where(Products.id == product_id)
    ).scalar()

    if product is None:
        return jsonify({'message': 'El producto no existe'}), 400

    print(f"Producto encontrado con ID: {product.id} y precio {product.price}")

    # Crear un nuevo ítem en el carrito
    new_item = ShoppingCartItems(
        quantity=quantity,
        price=product.price,
        shopping_cart_id=cart.id,
        product_id=product.id
    )
    db.session.add(new_item)
    db.session.commit()
    
    return jsonify({
        'message': 'Producto agregado exitosamente al carrito',
        'item_id': new_item.id,
        'cart_id': cart.id,
        'product_id': product.id,
        'quantity': quantity,
        'price': product.price
    }), 201

@api.route('/carts/<int:cart_id>/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def borrar_item_carrito(cart_id, item_id):
    current_user_id = get_jwt_identity()
    user_id = current_user_id['id']  # Extraer el ID del usuario desde el diccionario
    print(f"Cart ID: {cart_id}, Current User ID: {current_user_id}")
    
    cart = ShoppingCarts.query.get(cart_id)
    print(f"Cart retrieved: {cart}")
    if cart is None or cart.user_id != user_id:  # Usar user_id para la comparación
        return jsonify({'message': 'Carrito no encontrado o acceso no autorizado'}), 404
    
    item = ShoppingCartItems.query.filter_by(id=item_id, shopping_cart_id=cart_id).first()
    if item is None:
        return jsonify({'message': 'Ítem no encontrado en el carrito'}), 404

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


@api.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.json.get('email')
    if not email:
        return jsonify({"message": "Por favor, envía un email"}), 400
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suscripción Exitosa</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
                color: #333;
                text-align: center;
            }
            .container {
                background-color: #fff;
                margin: auto;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
            }
            h1 {
                color: #0066cc;
            }
            p {
                margin: 20px 0;
            }
            .btn {
                display: inline-block;
                background-color: #0066cc;
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
            }
            .btn:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Suscripción Exitosa</h1>
            <p>¡Gracias por suscribirte a nuestro boletín! Pronto empezarás a recibir actualizaciones exclusivas y contenido de calidad directamente en tu bandeja de entrada.</p>
            <a href="https://sample-service-name-ak1a.onrender.com/" class="btn">Visitar Sitio</a>
        </div>
    </body>
    </html>
    """
    msg = Message("Suscripción Exitosa",
                  sender="pppmfg@gmail.com",
                  recipients=[email])
    msg.body = "Este es un mensaje de texto para clientes de correo que no soportan HTML."
    msg.html = html_content  
    mail.send(msg)
    return jsonify({"message": "¡Suscripción exitosa!"}), 200



@api.route('/clear-cart', methods=['POST'])
@jwt_required()
def clear_cart():
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity['id']  # Obteniendo el ID del usuario del token JWT

        # Encuentra el carrito del usuario basado en user_id
        cart = ShoppingCarts.query.filter_by(user_id=user_id).first()
        if cart:
            # Elimina todos los ítems del carrito basados en shopping_cart_id
            ShoppingCartItems.query.filter_by(shopping_cart_id=cart.id).delete()
            db.session.commit()
            return jsonify({'message': 'Cart cleared successfully'}), 200
        else:
            return jsonify({'error': 'Cart not found'}), 404
    except KeyError:
        return jsonify({'error': "User ID not found in token"}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500