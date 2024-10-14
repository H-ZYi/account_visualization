from django.contrib import admin

"""
作用：admin.py 文件負責配置 Django 管理後台中的模型顯示方式。
將模型註冊到 admin.py 文件後，Django 的管理後台就可以顯示並管理該模型數據。
"""
# Register your models here.


# accounts/admin.py
from django.contrib import admin
from .models import Account

# 註冊 MindMap 模型，使其可在 Django 管理後台中管理
admin.site.register(Account)  # 註冊 Account 模型