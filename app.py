from flask import Flask, redirect, url_for, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, UserMixin, login_user, current_user, logout_user
from flask_admin.actions import action

app = Flask(__name__)
app.config['SECRET_KEY'] = 'devkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
admin = Admin(app, name='Dashboard', template_mode='bootstrap3')

class Organization(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    users = db.relationship('User', backref='organization', lazy=True)
    properties = db.relationship('Property', backref='organization', lazy=True)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='manager')
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(50), default='active')
    organization_id = db.Column(db.Integer, db.ForeignKey('organization.id'))
    units = db.relationship('Unit', backref='property', lazy=True)

class Unit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    identifier = db.Column(db.String(120), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('property.id'))
    leases = db.relationship('Lease', backref='unit', lazy=True)

class Lease(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenant = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(50), default='active')
    late_fee_policy = db.Column(db.String(120), default='None')
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class ManagerModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.role == 'manager'
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login', next=request.url))

class PropertyAdmin(ManagerModelView):
    column_filters = ['status', 'organization']
    column_searchable_list = ['name']

    def get_query(self):
        query = super().get_query()
        if current_user.is_authenticated and current_user.organization_id:
            return query.filter(Property.organization_id == current_user.organization_id)
        return query

    def get_count_query(self):
        query = super().get_count_query()
        if current_user.is_authenticated and current_user.organization_id:
            return query.filter(Property.organization_id == current_user.organization_id)
        return query

class UnitAdmin(ManagerModelView):
    column_filters = ['property']
    column_searchable_list = ['identifier']

    def get_query(self):
        query = super().get_query()
        if current_user.is_authenticated and current_user.organization_id:
            return query.join(Property).filter(Property.organization_id == current_user.organization_id)
        return query

    def get_count_query(self):
        query = super().get_count_query()
        if current_user.is_authenticated and current_user.organization_id:
            return query.join(Property).filter(Property.organization_id == current_user.organization_id)
        return query

class LeaseAdmin(ManagerModelView):
    column_filters = ['status', 'unit']
    column_searchable_list = ['tenant']

    @action('set_standard_late_fee', 'Set standard late fee', 'Are you sure you want to apply standard late fee?')
    def action_set_standard_late_fee(self, ids):
        for lease in Lease.query.filter(Lease.id.in_(ids)).all():
            lease.late_fee_policy = 'Standard'
        db.session.commit()

    def get_query(self):
        query = super().get_query()
        if current_user.is_authenticated and current_user.organization_id:
            return query.join(Unit).join(Property).filter(Property.organization_id == current_user.organization_id)
        return query

    def get_count_query(self):
        query = super().get_count_query()
        if current_user.is_authenticated and current_user.organization_id:
            return query.join(Unit).join(Property).filter(Property.organization_id == current_user.organization_id)
        return query

admin.add_view(PropertyAdmin(Property, db.session))
admin.add_view(UnitAdmin(Unit, db.session))
admin.add_view(LeaseAdmin(Lease, db.session))

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect('/admin')
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and user.password == request.form['password']:
            login_user(user)
            return redirect('/admin')
    return render_template('login.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
