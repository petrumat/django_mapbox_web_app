from django.urls import path
from .import views

app_name = "main"

urlpatterns = [
    path('route', views.route, name="route"),
    path('map', views.map, name="map"),
    path('traffic_info', views.traffic_info, name="traffic_info"),
    path('generate_alerts', views.generate_alerts, name="generate_alerts"),
    path('traffic_lights', views.traffic_lights, name="traffic_lights"),
    path('generate_reports', views.generate_reports, name="generate_reports"),
]