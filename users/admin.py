from django.contrib import admin
from .models import TrafficInfo, TrafficLight, GenerateAlert, GenerateReport, Feedback

admin.site.register(TrafficInfo)
admin.site.register(TrafficLight)
admin.site.register(GenerateAlert)
admin.site.register(GenerateReport)
admin.site.register(Feedback)
