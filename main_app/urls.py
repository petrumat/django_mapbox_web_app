"""main_app URL Configuration

"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.models import User, Group
from django.contrib.sessions.models import Session
from django.contrib.sites.models import Site
from django_otp.admin import OTPAdminSite
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.plugins.otp_totp.admin import TOTPDeviceAdmin
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from users.models import UserProfile, TrafficInfo, TrafficLight, GenerateAlert, GenerateReport, Feedback

class OTPAdmin(OTPAdminSite):
    pass

# Register built-in Django models
secure_admin = OTPAdmin(name='OTPAdmin')
secure_admin.register(User)
secure_admin.register(Group)
secure_admin.register(Session)
secure_admin.register(Site)
secure_admin.register(TOTPDevice, TOTPDeviceAdmin)

# Register django-allauth models
secure_admin.register(EmailAddress)
secure_admin.register(SocialAccount)
secure_admin.register(SocialApp)
secure_admin.register(SocialToken)

# Register custom models
secure_admin.register(UserProfile)
secure_admin.register(TrafficInfo)
secure_admin.register(TrafficLight)
secure_admin.register(GenerateAlert)
secure_admin.register(GenerateReport)
secure_admin.register(Feedback)

urlpatterns = [
    path('secure_admin/', secure_admin.urls),
    path('accounts/', include('allauth.urls')),
    path('accounts/', include('allauth.socialaccount.urls')),
    path('', include('main.urls', namespace="main")),
    path('', include('users.urls', namespace="users")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_URL)