from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    nick_name = db.Column(db.String(120), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean(), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User: {self.id} - {self.email}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {'id': self.id,
                'email': self.email,
                'nick_name': self.nick_name,
                'is_admin': self.is_active,
                'is_active': self.is_active}


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    price = db.Column(db.Float, unique=False, nullable=False)
    discount = db.Column(db.Float, unique=False, nullable=False)
    description = db.Column(db.String(120), unique=True, nullable=False)
    image_url = db.Column(db.String(1000), unique=True, nullable=False)

    def __repr__(self):
        return f"<Product: {self.id} - {self.name}"
    
    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                "name": self.name,
                "price": self.price,
                "discount": self.discount,
                "description": self.description,
                "image_url": self.image_url}


class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(80), unique=False, nullable=False)
    #Verificar si hay un campo tipo range 1-5
    value = db.Column(db.Integer, unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])

    def __repr__(self):
        return f'<Comment: {self.id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                "user_id": self.user_id,
                "product_id": self.product_id,
                "comment": self.comment,
                "value": self.value}


class Wishes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])

    def __repr__(self):
        return f'<Wish {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "user_id": self.user_id,
                "product_id": self.product_id}


class Sales(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])
    date_sold = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Integer, unique=False, nullable=False)
    quantity = db.Column(db.Integer, unique=False, nullable=False)

    def __repr__(self):
        return f'<sale: {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "user_id": self.user_id,
                "product_id": self.product_id,
                "date_sold": self.date_sold,
                "total_price": self.total_price,
                "quantity": self.quantity}


class ShoppingCarts(db.Model):
    __tablename__ = "shopping_carts"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])
    quantity = db.Column(db.Integer, unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)
 
    def __repr__(self):
        return f'<Shopping_Cart: {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "user_id": self.user_id,
                "product_id": self.product_id,
                "quantity": self.quantity,
                "price": self.price}


class Stores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])
    code_key = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<Stores {self.id}>'

    def serialize(self):
        return {"id": self.id,
                "product_id": self.product_id,
                "code_key": self.code_key}
