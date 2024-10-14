from django.shortcuts import render

"""
作用：views.py 是處理用戶請求的主要邏輯所在。
在這裡，你會定義視圖函數或類視圖，負責處理用戶請求、與模型交互以及將結果返回給用戶。
視圖是 Django 的 MTV 結構中的 "View" 部分。
"""
# Create your views here.


# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import MindMap
import json


# 首頁：僅顯示帳號管理系統字樣
def home(request):
    return render(request, 'home.html')

# 功能選擇頁面：提供登入、註冊、返回三個按鈕
def main(request):
    return render(request, 'main.html')

# 登入
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        # 在處理登入前先清除殘留訊息
        storage = messages.get_messages(request)
        storage.used = True  # 清除所有殘留訊息

        if user is not None:
            login(request, user)
            messages.success(request, '登入成功！')
            return redirect('mind_map')
        else:
            messages.error(request, '帳號或密碼錯誤！')
            return redirect('login')

    return render(request, 'login.html')

# 註冊
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        password_confirm = request.POST['password-confirm']

        # 在處理登入前先清除殘留訊息
        storage = messages.get_messages(request)
        storage.used = True  # 清除所有殘留訊息

        # 檢查密碼是否匹配
        if password != password_confirm:
            messages.error(request, '密碼不匹配！')
            return redirect('register')

        # 檢查用戶名是否已存在
        if User.objects.filter(username=username).exists():
            messages.error(request, '用戶名已存在！')
            return redirect('register')

        # 創建新用戶
        user = User.objects.create_user(username=username, password=password)
        user.save()
        messages.success(request, '註冊成功！請登入')
        return redirect('login')

    return render(request, 'register.html')

# 登出
def logout_view(request):
    if request.method == "POST":
        logout(request)
        return redirect('login')
    return redirect('mind_map')

@login_required
def mind_map(request):
    return render(request, 'mind_map.html')

# save_mindmap 視圖 - 接收並儲存心智圖數據
@csrf_exempt
@login_required
def save_mindmap(request):
    """
    接收 POST 請求中的心智圖數據並保存至數據庫
    使用者必須登入
    保存心智圖數據至數據庫，需符合 node_tree 結構
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        mindmap, created = MindMap.objects.get_or_create(user=request.user)
        mindmap.data = data  # 應確保這是 node_tree 格式的 JSON
        mindmap.save()
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

# load_mindmap 視圖 - 加載使用者的心智圖數據
@login_required
def load_mindmap(request):
    """
    返回當前登入使用者的心智圖數據，若無數據則返回 None
    """
    try:
        mindmap = MindMap.objects.get(user=request.user)
        return JsonResponse(mindmap.data)
    except MindMap.DoesNotExist:
        # 預設心智圖結構
        default_data = {
            "meta": {
                "name": "default",
                "author": "auto-generated",
            },
            "format": "node_tree",
            "data": {
                "id": "root",
                "topic": "開始使用心智圖",
                "children": [
                    {"id": "sub1", "topic": "個人目標"},
                    {"id": "sub2", "topic": "職業發展"},
                    {"id": "sub3", "topic": "興趣愛好"}
                ]
            }
        }
        return JsonResponse(default_data)
    except Exception as e:
        # 增加錯誤處理，返回錯誤信息
        return JsonResponse({'error': str(e)}, status=500)