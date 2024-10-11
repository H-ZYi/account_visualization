# accounts/urls.py
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),  # 首頁
    path('main/', views.main, name='main'),  # 功能選擇頁面
    path('login/', views.login_view, name='login'),  # 登入頁面
    path('register/', views.register, name='register'),  # 註冊頁面
    path('mind_map/', views.mind_map, name='mind_map'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
]
