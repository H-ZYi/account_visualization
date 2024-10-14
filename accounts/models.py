from django.db import models

"""
作用：models.py 是 Django 框架中負責數據模型定義的文件。
通過定義模型類（即數據表的結構），Django 會自動將它們轉換為數據庫中的表。
模型是 MVC（Model-View-Controller）結構中的 "Model"，負責數據的存取和邏輯處理。
"""
# Create your models here.

from django.contrib.auth.models import User

class Account(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(blank=True, null=True)
    password = models.CharField(max_length=128)

    def __str__(self):
        return self.username
    
# MindMap 模型 - 儲存每個使用者的心智圖數據
class MindMap(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mindmap') # 使用者與心智圖一對一關聯
    data = models.JSONField()  # 儲存心智圖數據（JSON 格式）
    last_modified = models.DateTimeField(auto_now=True)  # 自動更新修改時間

    def __str__(self):
        return f"{self.user.username}'s Mind Map"