"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Products, Wishes, ShoppingCarts, ShoppingCartItems, Comments
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


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
       

@api.route('/wishes/<int:wishes_id>', methods=['DELETE'])
def delete_wished(wishes_id):
    #tengo que verificar con el token quien es el user que hace la peticion 
    response_body = {}
    data = request.json
    # toma una instancia del modelo: wishes
    #wish = Wishes(user_id = user_id, product_id = data["product_id"])
    wish = Wishes.query.filter_by(user_id=user_id, product_id=product_id).first()
    if wish:
        if request.method == 'GET':
            return response_body
        if request.method == 'DELETE':
            response_body["message"]= "Responde el Delete"
            response_body["result"]= wish.serialize()
            db.session.delete(wish)
            db.session.commit()
            return response_body
    else:
        response_body["message"] = "NONE"
        return response_body, 400


@api.route('/carts', methods=['GET', 'POST'])
@jwt_required()
def add_to_cart():
    response_body = {}
    current_user = get_jwt_identity()
    print(current_user) 
    if request.method == 'GET':
        if current_user["is_admin"]:
            # traer de la base todos los carritos (porque el admin puede ver todos los carritos)
            pass
        else:
            # traer el carrito del user con sus items 
            pass    
        carts = db.session.execute(db.select(ShoppingCarts)).scalars()  # de donde va a sacar el resultado
        response_body['results'] = [row.serialize() for row in carts]  # el resultado que va a mostrar en forma de lista
        response_body['message'] = 'Success'
        return response_body, 200
    if request.method == 'POST':
        if current_user["is_admin"]:
            response_body["message"] = "El administrador no puede comprar"
        return response_body, 403
    # Buscar si el usuario ya tiene un carrito
    existing_cart = db.session.query(ShoppingCarts).filter_by(user_id=current_user['user_id']).first()

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

        
       

@api.route('/carts/<int:user_id>/products/<int:product_id>', methods=['GET', 'DELETE'])
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
        return response_body, 400

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
