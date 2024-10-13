from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.urls import path
from . import views


app_name = "users"

urlpatterns = [
    path('favicon.ico', RedirectView.as_view(url='/static/branding/logo.gif')),
    path('', views.AccountView.as_view(), name="account"),
    path('profile', views.profile_view, name="profile"),
    path('sign-up', views.SignUpView.as_view(), name="sign-up"),
    path('help', views.help, name="help"),
    path('sign-in', views.SignInView.as_view(), name="sign-in"),
    path('sign-out', views.sign_out, name="sign-out"),
    path('reset-password', views.ResetPasswordView.as_view(), name="reset-password"),

    path('trafficInfoList', views.trafficInfoList, name="trafficInfoList"),
    path('trafficInfoData', views.trafficInfoData, name="trafficInfoData"),

    path('trafficLightsList', views.trafficLightsList, name="trafficLightsList"),
    path('trafficLightsData', views.trafficLightsData, name="trafficLightsData"),

    path('generateAlertsList', views.generateAlertsList, name="generateAlertsList"),
    path('generateAlertsData', views.generateAlertsData, name="generateAlertsData"),
    path('saveAlert', views.saveAlert, name="saveAlert"),

    path('generateReportsList', views.generateReportsList, name="generateReportsList"),
    path('generateReportsData', views.generateReportsData, name="generateReportsData"),
    path('generateReport', views.generateReport, name="generateReport"),
    path('saveReport', views.saveReport, name="saveReport"),

    path('feedback', views.FeedbackView.as_view(), name='feedback'),
    path('feedbackList', views.feedbackList, name="feedbackList"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)