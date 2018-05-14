import json

from django.test import TestCase, Client

from SNULAR.models import *


class SNULARModelTest(TestCase):
    def setUp(self):
        user_manu = User.objects.create_user(email='manu@snu.ac.kr', username='manu', password='manupw')
        user_cust = User.objects.create_user(email='cust@snu.ac.kr', username='cust', password='custpw')

        profile_manu = Profile.objects.create(user=user_manu, phone_number='010-1111-2222', type='Manufacturer')
        profile_cust = Profile.objects.create(user=user_cust, phone_number='010-3333-4444', type='Customer')

        article_manu = Article.objects.create(author=profile_manu, title='New panel is now available', content='Great advancing')
        panel_manu = SolarPanel.objects.create(manufacturer=profile_manu, name='New Sol', company='Manu Panel', price=100000, power=100, width=2, length=2)
        gprec_manu = GPRecruitment.objects.create(manufacturer=profile_manu, solar_panel=panel_manu, min_panel=10, discounted_price=80000)

        Comment.objects.create(author=profile_cust, article=article_manu, content='Wow')
        GPRegister.objects.create(customer=profile_cust, num_panel=5, gp_recruitment=gprec_manu)

    def test_profile_model(self):
        profile_manu = Profile.objects.get(id=1)
        self.assertEqual(str(profile_manu), 'manu')

    def test_article_model(self):
        article_manu = Article.objects.get(id=1)
        self.assertEqual(str(article_manu), 'New panel is now available')

    def test_comment_model(self):
        comment_cust = Comment.objects.get(id=1)
        self.assertEqual(str(comment_cust), 'Wow')

    def test_solar_panel_model(self):
        solar_panel_manu = SolarPanel.objects.get(id=1)
        self.assertEqual(str(solar_panel_manu), 'New Sol')

    def test_gp_recruitment_model(self):
        gp_recruitment = GPRecruitment.objects.get(id=1)
        self.assertEqual(str(gp_recruitment), 'Recruiting 10 New Sol by manu')

    def test_gp_register_model(self):
        gp_register = GPRegister.objects.get(id=1)
        self.assertEqual(str(gp_register), 'cust registered 5 New Sol')


class SNULARVeiwTestWithExistData(TestCase):
    def setUp(self):
        self.client = Client()

        user_manu = User.objects.create_user(email='manu@snu.ac.kr', username='manu', password='manupw')
        user_cust = User.objects.create_user(email='cust@snu.ac.kr', username='cust', password='custpw')

        profile_manu = Profile.objects.create(user=user_manu, phone_number='010-1111-2222', type='1')
        profile_cust = Profile.objects.create(user=user_cust, phone_number='010-3333-4444', type='0')

        article_manu = Article.objects.create(author=profile_manu, title='New panel is now available', content='Great advancing')
        panel_manu = SolarPanel.objects.create(manufacturer=profile_manu, name='New Sol', company='Manu Panel', price=100000, power=100, width=2, length=2)
        gprec_manu = GPRecruitment.objects.create(manufacturer=profile_manu, solar_panel=panel_manu, min_panel=10, discounted_price=80000)

        Comment.objects.create(author=profile_cust, article=article_manu, content='Wow')
        GPRegister.objects.create(customer=profile_cust, num_panel=5, gp_recruitment=gprec_manu)

    def test_sign_up_post_create_user(self):
        response = self.client.post(
            '/api/signup/',
            json.dumps({
                'email': 'test@snu.ac.kr',
                'username': 'test',
                'password': 'testpw',
                'phone_number': '010-1111-2222',
                'type': '0'
            }),
            content_type='application/json'
        )
        user_test = User.objects.get(username='test')
        profile_test = Profile.objects.get(user=user_test)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(str(profile_test), 'test')
        self.assertEqual(profile_test.type, '0')

    def test_sign_up_post_create_superuser(self):
        response = self.client.post(
            '/api/signup/',
            json.dumps({
                'email': 'test@snu.ac.kr',
                'username': 'test',
                'password': 'testpw',
                'phone_number': '010-1111-2222',
                'type': '2'
            }),
            content_type='application/json'
        )
        user_test = User.objects.get(username='test')
        profile_test = Profile.objects.get(user=user_test)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(str(profile_test), 'test')
        self.assertEqual(profile_test.type, '2')

    def test_sign_up_with_invalid_data(self):
        response = self.client.post(
            '/api/signup/',
            json.dumps({'dummy': 'data'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 406)

    def test_sign_up_not_allowed_method(self):
        response = self.client.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

    def test_sign_in_post_with_exist_user(self):
        response = self.client.post(
            '/api/signin/',
            json.dumps({'username': 'cust', 'password': 'custpw'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 202)

    def test_sign_in_post_with_not_exist_user(self):
        response = self.client.post(
            '/api/signin/',
            json.dumps({'username': 'damn', 'password': 'damnpw'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)

    def test_sign_in_with_invalid_data(self):
        response = self.client.post(
            '/api/signin/',
            json.dumps({'dummy': 'data'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 406)

    def test_sign_in_not_allowed_method(self):
        response = self.client.get('/api/signin/')
        self.assertEqual(response.status_code, 405)

    def test_sign_out_get_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/signout/')
        self.assertEqual(response.status_code, 202)

    def test_sign_out_get_with_anonymous_user(self):
        response = self.client.get('/api/signout/')
        self.assertEqual(response.status_code, 403)

    def test_profile_list_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/profile/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/profile/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)
        self.assertEqual(response.status_code, 200)

    def test_profile_list_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post('/api/profile/')
        self.assertEqual(response.status_code, 405)

    def test_profile_detail_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/profile/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['username'], 'manu')
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/profile/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['username'], 'manu')
        self.assertEqual(response.status_code, 200)

    def test_profile_detail_delete_self(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/profile/2/')
        profiles = Profile.objects.all()
        self.assertEqual(response.status_code, 204)
        self.assertEqual(len(profiles), 1)

    def test_profile_detail_delete_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/profile/1/')
        profiles = Profile.objects.all()
        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(profiles), 2)

    def test_profile_detail_put_self(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put(
            '/api/profile/2/',
            json.dumps({
                'email': 'test@snu.ac.kr',
                'username': 'test',
                'password': 'testpw',
                'phone_number': '010-1111-2222',
                'type': '1'
            }),
            content_type='application/json'
        )
        user_test = User.objects.get(id=2)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(str(user_test), 'test')

    def test_profile_detail_put_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put(
            '/api/profile/1/',
            json.dumps({
                'email': 'test@snu.ac.kr',
                'username': 'test',
                'password': 'testpw',
                'phone_number': '010-1111-2222',
                'type': '1'
            }),
            content_type='application/json'
        )
        user_test = User.objects.get(id=2)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(str(user_test), 'cust')

    def test_profile_detail_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post('/api/profile/1/')
        self.assertEqual(response.status_code, 405)

    def test_article_list_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/article/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/article/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

    def test_article_list_post_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post(
            '/api/article/',
            json.dumps({
                'title': 'Test Title',
                'content': 'Test Content',
                'type': '0'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        article_new_panel = Article.objects.get(id=2)
        self.assertEqual(article_new_panel.title, 'Test Title')
        self.assertEqual(article_new_panel.author.user.username, 'cust')

    def test_article_list_post_with_anonymous_user(self):
        response = self.client.post(
            '/api/article/',
            json.dumps({
                'title': 'Test Title',
                'content': 'Test Content',
                'type': '0'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_article_list_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/article/')
        self.assertEqual(response.status_code, 405)

    def test_article_detail_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/article/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['title'], 'New panel is now available')
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/article/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['title'], 'New panel is now available')
        self.assertEqual(response.status_code, 200)

    def test_article_detail_put_self(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.put(
            '/api/article/1/',
            json.dumps({
                'title': 'Test Title',
                'content': 'Test Content',
                'type': '0'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

        article_edit = Article.objects.get(id=1)
        self.assertEqual(article_edit.title, 'Test Title')

    def test_article_detail_put_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put(
            '/api/article/1/',
            json.dumps({
                'title': 'Test Title',
                'content': 'Test Content',
                'type': '0'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_article_detail_delete_self(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.delete('/api/article/1/')
        self.assertEqual(response.status_code, 204)

        articles = Article.objects.all()
        self.assertEqual(len(articles), 0)

    def test_article_detail_delete_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/article/1/')
        self.assertEqual(response.status_code, 403)

    def test_article_detail_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post(
            '/api/article/1/',
            json.dumps({'dummy': 'data'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 405)

    def test_article_comment_list_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/article/1/comment/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/article/1/comment/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

    def test_article_comment_list_post_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post(
            '/api/article/1/comment/',
            json.dumps({'content': 'Test Comment'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        comment_new = Comment.objects.get(id=2)
        self.assertEqual(comment_new.content, 'Test Comment')
        self.assertEqual(comment_new.author.user.username, 'cust')

    def test_article_comment_list_post_with_anonymous_user(self):
        response = self.client.post(
            '/api/article/1/comment/',
            json.dumps({'content': 'Test Comment'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_article_comment_list_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/article/1/comment/')
        self.assertEqual(response.status_code, 405)

    def test_article_comment_detail_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/article/1/comment/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['content'], 'Wow')
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/article/1/comment/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['content'], 'Wow')
        self.assertEqual(response.status_code, 200)

    def test_article_comment_detail_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/article/1/comment/1/')
        self.assertEqual(response.status_code, 405)

    def test_comment_list_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/comment/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/comment/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

    def test_comment_list_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/comment/')
        self.assertEqual(response.status_code, 405)

    def test_comment_detail_get_with_login_or_anonymous_user(self):
        response = self.client.get('/api/comment/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['content'], 'Wow')
        self.assertEqual(response.status_code, 200)

        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/comment/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['content'], 'Wow')
        self.assertEqual(response.status_code, 200)

    def test_comment_detail_put_self(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put(
            '/api/comment/1/',
            json.dumps({'content': 'Test Comment'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

        comment_edit = Comment.objects.get(id=1)
        self.assertEqual(comment_edit.content, 'Test Comment')

    def test_comment_detail_put_other(self):
        self.client.login(username='manu', password='manu')
        response = self.client.put(
            '/api/comment/1/',
            json.dumps({'content': 'Test Comment'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_comment_detail_delete_self(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/comment/1/')
        self.assertEqual(response.status_code, 204)

        comments = Comment.objects.all()
        self.assertEqual(len(comments), 0)

    def test_comment_detail_delete_other(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.delete('/api/comment/1/')
        self.assertEqual(response.status_code, 403)

    def test_comment_detail_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post(
            '/api/comment/1/',
            json.dumps({'dummy': 'data'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 405)

    def test_panel_list_get_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/panel/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

    def test_panel_list_get_with_anonymous_user(self):
        response = self.client.get('/api/panel/')
        self.assertEqual(response.status_code, 403)

    def test_panel_list_post_with_manufacturer(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.post(
            '/api/panel/',
            json.dumps({
                'name': 'Test Sol',
                'company': 'Test Sol',
                'price': 10000,
                'power': 100,
                'width': 10,
                'length': 10,
                'image': None
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        new_panel = SolarPanel.objects.get(id=2)
        self.assertEqual(new_panel.name, 'Test Sol')
        self.assertEqual(new_panel.manufacturer.user.username, 'manu')

    def test_panel_list_post_with_customer(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post(
            '/api/panel/',
            json.dumps({
                'name': 'Test Sol',
                'company': 'Test Sol',
                'price': 10000,
                'power': 100,
                'width': 10,
                'length': 10,
                'image': None
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_panel_list_not_allowed_method(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put('/api/panel/')
        self.assertEqual(response.status_code, 403)

    def test_panel_detail_get_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/panel/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['name'], 'New Sol')
        self.assertEqual(response.status_code, 200)

    def test_panel_detail_get_with_anonymous_user(self):
        response = self.client.get('/api/panel/1/')
        self.assertEqual(response.status_code, 403)

    def test_panel_detail_put_self(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.put(
            '/api/panel/1/',
            json.dumps({
                'name': 'Test Sol',
                'company': 'Test Sol',
                'price': 10000,
                'power': 100,
                'width': 10,
                'length': 10
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

        panel_edit = SolarPanel.objects.get(id=1)
        self.assertEqual(panel_edit.name, 'Test Sol')

    def test_panel_detail_put_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put(
            '/api/panel/1/',
            json.dumps({
                'name': 'Test SOL',
                'company': 'Test SOL',
                'price': 10000,
                'power': 100,
                'width': 10,
                'length': 10
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_panel_detail_delete_self(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.delete('/api/panel/1/')
        self.assertEqual(response.status_code, 204)

        panels = SolarPanel.objects.all()
        self.assertEqual(len(panels), 0)

    def test_panel_detail_delete_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/panel/1/')
        self.assertEqual(response.status_code, 403)

    def test_panel_detail_not_allowed_method(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.post(
            '/api/panel/1/',
            json.dumps({'dummy': 'data'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 405)

    def test_gp_recruitment_list_get_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/gp_recruitment/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

    def test_gp_recruitment_list_get_with_anonymous_user(self):
        response = self.client.get('/api/gp_recruitment/')
        self.assertEqual(response.status_code, 403)

    def test_gp_recruitment_list_post_with_manufacturer(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.post(
            '/api/gp_recruitment/',
            json.dumps({
                'solar_panel': 1,
                'min_panel': 10,
                'discounted_price': 8000
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        new_gp_recruitment = GPRecruitment.objects.get(id=2)
        self.assertEqual(new_gp_recruitment.min_panel, 10)

    def test_gp_recruitment_list_post_with_customer(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.post(
            '/api/gp_recruitment/',
            json.dumps({
                'solar_panel': 1,
                'min_panel': 10,
                'discounted_price': 8000
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_gp_recruitment_detail_get_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/gp_recruitment/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['min_panel'], 10)
        self.assertEqual(response.status_code, 200)

    def test_gp_recruitment_detail_get_with_anonymous_user(self):
        response = self.client.get('/api/gp_recruitment/1/')
        self.assertEqual(response.status_code, 403)

    def test_gp_recruitment_detail_put_self(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.put(
            '/api/gp_recruitment/1/',
            json.dumps({
                'solar_panel': 1,
                'min_panel': 20,
                'discounted_price': 5000
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

        gp_recruitment_edit = GPRecruitment.objects.get(id=1)
        self.assertEqual(gp_recruitment_edit.min_panel, 20)

    def test_gp_recruitment_detail_put_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put(
            '/api/gp_recruitment/1/',
            json.dumps({
                'solar_panel': 1,
                'min_panel': 20,
                'discounted_price': 5000
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_gp_recruitment_detail_delete_self(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.delete('/api/gp_recruitment/1/')
        self.assertEqual(response.status_code, 204)

        gp_recruitments = GPRecruitment.objects.all()
        self.assertEqual(len(gp_recruitments), 0)

    def test_gp_recruitment_detail_delete_other(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/gp_recruitment/1/')
        self.assertEqual(response.status_code, 403)

    def test_gp_recruitment_detail_not_allowed_method(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.post(
            '/api/gp_recruitment/1/',
            json.dumps({'dummy': 'data'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 405)

    def test_gp_register_list_get_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/gp_register/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)
        self.assertEqual(response.status_code, 200)

    def test_gp_register_list_get_with_anonymous_user(self):
        response = self.client.get('/api/gp_register/')
        self.assertEqual(response.status_code, 403)

    def test_gp_register_list_post_with_login_user(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.post(
            '/api/gp_register/',
            json.dumps({
                'gp_recruitment': 1,
                'num_panel': 5
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        new_gp_register = GPRegister.objects.get(id=2)
        self.assertEqual(new_gp_register.num_panel, 5)

    def test_gp_register_list_post_with_anonymous_user(self):
        response = self.client.post(
            '/api/gp_register/',
            json.dumps({
                'gp_recruitment': 1,
                'num_panel': 5
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_gp_register_detail_get_with_login_user(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.get('/api/gp_register/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['num_panel'], 5)
        self.assertEqual(response.status_code, 200)

    def test_gp_register_detail_get_with_anonymous_user(self):
        response = self.client.get('/api/gp_register/1/')
        self.assertEqual(response.status_code, 403)

    def test_gp_register_detail_put_self(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.put(
            '/api/gp_register/1/',
            json.dumps({
                'gp_recruitment': 1,
                'num_panel': 10
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

        gp_register_edit = GPRegister.objects.get(id=1)
        self.assertEqual(gp_register_edit.num_panel, 10)

    def test_gp_register_detail_put_other(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.put(
            '/api/gp_register/1/',
            json.dumps({
                'gp_recruitment': 1,
                'num_panel': 10
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

    def test_gp_register_detail_delete_self(self):
        self.client.login(username='cust', password='custpw')
        response = self.client.delete('/api/gp_register/1/')
        self.assertEqual(response.status_code, 204)

        gp_registers = GPRegister.objects.all()
        self.assertEqual(len(gp_registers), 0)

    def test_gp_register_detail_delete_other(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.delete('/api/gp_register/1/')
        self.assertEqual(response.status_code, 403)

    def test_gp_register_detail_not_allowed_method(self):
        self.client.login(username='manu', password='manupw')
        response = self.client.post(
            '/api/gp_register/1/',
            json.dumps({'dummy': 'data'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 405)
