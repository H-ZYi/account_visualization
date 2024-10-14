"""
作用：urls.py 文件負責定義 URL 路徑與視圖的對應關係。
每個 URL 路徑會映射到一個視圖函數，使 Django 能夠根據用戶訪問的 URL 路徑來調用相應的視圖處理請求。
"""

# accounts/urls.py
from django.urls import path
from . import views

# URL 路徑定義，將用戶請求路徑映射至相應的視圖
urlpatterns = [
    path('', views.home, name='home'),  # 首頁
    path('main/', views.main, name='main'),  # 功能選擇頁面
    path('login/', views.login_view, name='login'),  # 登入頁面
    path('register/', views.register, name='register'),  # 註冊頁面
    path('mind_map/', views.mind_map, name='mind_map'),  # 心智圖主頁
    path('logout/', views.logout_view, name='logout'),  # 登出
    path('api/save_mindmap/', views.save_mindmap, name='save_mindmap'),  # 儲存 API
    path('api/load_mindmap/', views.load_mindmap, name='load_mindmap'),  # 載入 API
]
