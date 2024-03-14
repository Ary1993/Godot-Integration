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
                'is_admin': self.is_active,
                'is_active': self.is_active}


class Products(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(120), unique=True, nullable=False)
    price = db.Column(db.Float, unique=False, nullable=False)
    actual_discount = db.Column(db.Float, unique=False, nullable=False)
    description = db.Column(db.String(120), unique=True, nullable=False)
    image_url = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f"<Products: {self.id}"
    
    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                 "product_name": self.product_name,
                 "price": self.price,
                 "description": self.description,
                 "image_url": self.image_url}




class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(80), unique=False, nullable=False)
    value = db.Column(db.String(120), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])

    def __repr__(self):
        return f'<Comments: {self.id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                 "user_id": self.user_id,
                 "product_id": self.product_id,
                 "comment": self.comment,
                 "value": self.value}


class WishList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])

    def __repr__(self):
        return f'<WishList {self.id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                 "user_id": self.user_id,
                 "product_id": self.product_id}


class History_sells(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])
    date_sold = db.Column(db.String(80), unique=False, nullable=False)
    total_price = db.Column(db.Integer, unique=False, nullable=False)
    product_ammount = db.Column(db.Integer, unique=False, nullable=False)

    def __repr__(self):
        return f'<History_sells {self.id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                 "user_id": self.user_id,
                 "product_id": self.product_id,
                 "date_sold": self.date_sold,
                 "total_price": self.total_price,
                 "product_ammount": self.product_ammount}


class Shopping_Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("Users", foreign_keys=[user_id])
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])
    ammount = db.Column(db.Integer, unique=False, nullable=False)
    price = db.Column(db.Integer, unique=False, nullable=False)
    product_ammount = db.Column(db.Integer, unique=False, nullable=False)

    def __repr__(self):
        return f'<Shopping_Cart {self.id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                 "user_id": self.user_id,
                 "product_id": self.product_id,
                 "ammount": self.ammount,
                 "price": self.price,
                 "product_ammount": self.product_ammount}


class Store(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    products = db.relationship("Products", foreign_keys=[product_id])
    code_key = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f'<Store {self.id}>'

    def serialize(self):
        # Do not serialize the password, its a security breach
        return {"id": self.id,
                 "product_id": self.product_id,
                 "code_key": self.code_key}
