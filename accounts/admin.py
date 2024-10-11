from django.contrib import admin

# Register your models here.


# accounts/admin.py
from django.contrib import admin
from .models import Account

admin.site.register(Account)  # 註冊 Account 模型