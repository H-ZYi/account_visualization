from django.shortcuts import render

# Create your views here.


# accounts/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm, User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control


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

