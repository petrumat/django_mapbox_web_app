from django.shortcuts import render, redirect, reverse
from django.urls import reverse_lazy
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.contrib import messages
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.edit import FormView
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import inch, cm
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors
import json
import io

from main_app.mixins import	AjaxFormMixin, reCAPTCHAValidation, FormErrors,	is_ajax
from .forms import UserForm, UserProfileForm, AuthForm,	UsernameForm, FeedbackForm
from .models import TrafficInfo, TrafficLight, GenerateAlert, GenerateReport, Feedback
from .utils import update_traffic_info_data, update_traffic_lights_data, update_generate_alerts_data, update_generate_reports_data


result = "Error"
message = "There was an error, please try again"



# User Classes and Functions

class AccountView(TemplateView):
	'''
	Generic FormView with our mixin to display user account page
	'''
	template_name = "users/account.html"

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super().dispatch(*args, **kwargs)

def profile_view(request):
	'''
	function view to allow users to update their profile
	'''
	user = request.user
	up = user.userprofile

	form = UserProfileForm(instance = up) 

	if is_ajax(request):
		form = UserProfileForm(data = request.POST, instance = up)
		if form.is_valid():
			obj = form.save()
			obj.has_profile = True
			obj.save()
			result = "Success"
			message = "Your profile has been updated"
		else:
			message = FormErrors(form)
		data = {'result': result, 'message': message}
		return JsonResponse(data)

	else:

		context = {'form': form}
		context['google_api_key'] = settings.GOOGLE_API_KEY
		context['base_country'] = settings.BASE_COUNTRY

		return render(request, 'users/profile.html', context)

class SignUpView(AjaxFormMixin, FormView):
	'''
	Generic FormView with our mixin for user sign-up with reCAPTURE security
	'''

	template_name = "users/sign_up.html"
	form_class = UserForm
	success_url = "/"

	#reCAPTURE key required in context
	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		context["recaptcha_site_key"] = settings.RECAPTCHA_PUBLIC_KEY
		return context

	#over write the mixin logic to get, check and save reCAPTURE score
	def form_valid(self, form):
		response = super(AjaxFormMixin, self).form_valid(form)	
		if is_ajax(self.request):
			token = form.cleaned_data.get('token')
			captcha = reCAPTCHAValidation(token)

			# Initialize result and message with default values
			result = "Error"
			message = "Invalid reCAPTCHA. Please try again."

			if captcha["success"]:
				obj = form.save()
				obj.email = obj.username
				obj.save()
				up = obj.userprofile
				up.captcha_score = float(captcha["score"])
				up.save()
				
				login(self.request, obj, backend='django.contrib.auth.backends.ModelBackend')

				#change result & message on success
				result = "Success"
				message = "Thank you for signing up"

			
			data = {'result': result, 'message': message}
			return JsonResponse(data)

		return response

class SignInView(AjaxFormMixin, FormView):
	'''
	Generic FormView with our mixin for user sign-in
	'''

	template_name = "users/sign_in.html"
	form_class = AuthForm
	success_url = "/"

	def form_valid(self, form):
		response = super(AjaxFormMixin, self).form_valid(form)	
		
		if is_ajax(self.request):
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password')
			#attempt to authenticate user
			user = authenticate(self.request, username=username, password=password)
			
			if user is not None:
				login(self.request, user, backend='django.contrib.auth.backends.ModelBackend')
				result = "Success"
				message = 'You are now logged in'
			else:
				message = FormErrors(form)
			data = {'result': result, 'message': message}
			return JsonResponse(data)
		
		return response

class ResetPasswordView(AjaxFormMixin, FormView):
	'''
	Generic FormView with our mixin for user reset-password
	'''

	template_name = "users/reset_password.html"
	form_class = UsernameForm
	success_url = "/"
	
	def form_valid(self, form):
		User = get_user_model()
		
		response = super(AjaxFormMixin, self).form_valid(form)	
		
		if is_ajax(self.request):
			username = form.cleaned_data.get('username')
			#attempt to authenticate user
			try:
				user = User.objects.get(email=username)
				# Generate password reset link
				token = default_token_generator.make_token(user)
				uid = urlsafe_base64_encode(force_bytes(user.pk))
				current_site = get_current_site(self.request)
				reset_link = self.request.build_absolute_uri(
					reverse_lazy('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
				)

				# Send email
				subject = "Password Reset Requested"
				message = render_to_string('users/password_reset_email.html', {
					'user': user,
					'reset_link': reset_link,
					'domain': current_site.domain,
					'site_name': current_site.name,
				})
				send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.username], fail_silently=False)

				result = "Success"
				message = "A password reset link has been sent to your email."
			except User.DoesNotExist:
				result = "Error"
				message = "User does not exist."

			
			data = {'result': result, 'message': message}
			return JsonResponse(data)
		
		return response

def sign_out(request):
	'''
	Basic view for user sign out
	'''
	logout(request)
	return redirect(reverse('users:sign-in'))



# Traffic Info Functions

def trafficInfoList(request):
	traffic_info_list = TrafficInfo.objects.all()
	return render(request, 'lists/traffic_info_list.html', {'traffic_info_list': traffic_info_list})

def trafficInfoData(request):
	update_traffic_info_data()
	markers = TrafficInfo.objects.all().values()
	return JsonResponse(list(markers), safe=False)



# Traffic Lights Functions

def trafficLightsList(request):
	traffic_lights_list = TrafficLight.objects.all()
	return render(request, 'lists/traffic_lights_list.html', {'traffic_lights_list': traffic_lights_list})

def trafficLightsData(request):
	update_traffic_lights_data()
	markers = TrafficLight.objects.all().values()
	return JsonResponse(list(markers), safe=False)



# Generate Alerts Functions

def generateAlertsList(request):
	generate_alerts_list = GenerateAlert.objects.all()
	return render(request, 'lists/generate_alerts_list.html', {'generate_alerts_list': generate_alerts_list})

def generateAlertsData(request):
	update_generate_alerts_data()
	markers = GenerateAlert.objects.all().values()
	return JsonResponse(list(markers), safe=False)

@csrf_exempt
def saveAlert(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		dev = 0.02
		
		lat = data.get('lat')
		lng = data.get('lng')
		zone = data.get('label')
		speed = 20
		alert = "Road under Construction - Drive Carefully"
		content = zone + " Alert & Notification"
		ariaLabel = content
		title = ariaLabel

		marker = GenerateAlert(lat=lat, lng=lng, zone=zone, speed=speed, alert=alert, content=content, ariaLabel=ariaLabel, title=title)
		marker.save()

		return JsonResponse({'status': 'success', 'message': 'Marker saved successfully'})
	
	return JsonResponse({'status': 'fail', 'message': 'Invalid request method'})



# Generate Reports Functions

def generateReportsList(request):
	generate_reports_list = GenerateReport.objects.all()
	return render(request, 'lists/generate_reports_list.html', {'generate_reports_list': generate_reports_list})

def generateReportsData(request):
	update_generate_reports_data()
	markers = GenerateReport.objects.all().values()
	return JsonResponse(list(markers), safe=False)

def generateReport(request):
	Lat = float(request.GET.get('Lat', 0))
	Lng = float(request.GET.get('Lng', 0))
	deviation = float(request.GET.get('Dev', 0))

	buffer = io.BytesIO()
	p = canvas.Canvas(buffer, pagesize=landscape(A4))

	p.setFont("Helvetica-Bold", 16)
	p.drawString(100, 570, "Generated Report")

	traffic_info_data, traffic_light_data, alert_data = get_report_data(Lat, Lng, deviation)

	data_ti = [
		["Timestamp", "Latitude", "Longitude", "Zone", "Accidents", "Alerts", "Details"]
	]
	for item in traffic_info_data:
		data_ti.append([
			item.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
			round(item.lat, 3),
			round(item.lng, 3),
			item.zone,
			"Yes" if item.accidents else "No",
			"Yes" if item.alerts else "No",
			item.alert_content
		])

	data_tl = [
		["Timestamp", "Latitude", "Longitude", "Zone", "Program", "Red", "Yellow", "Green"]
	]
	for item in traffic_light_data:
		data_tl.append([
			item.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
			round(item.lat, 3),
			round(item.lng, 3),
			item.zone,
			item.program,
			item.time_red,
			item.time_yellow,
			item.time_green,
		])
	
	data_ga = [
		["Timestamp", "Latitude", "Longitude", "Zone", "Details"]
	]
	for item in alert_data:
		data_ga.append([
			item.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
			round(item.lat, 3),
			round(item.lng, 3),
			item.zone,
			item.alert
		])

	col_widths_ti = [1.5 * inch, 0.75 * inch, 1 * inch, 1.25 * inch, 1 * inch, 0.6 * inch, 4 * inch]
	col_widths_tl = [1.5 * inch, 0.75 * inch, 1 * inch, 1.25 * inch, 1 * inch, 1 * inch, 1 * inch, 1 * inch]
	col_widths_ga = [1.5 * inch, 0.75 * inch, 1 * inch, 1.25 * inch, 4 * inch]

	style_ti = TableStyle([
		('BACKGROUND', (0, 0), (-1, 0), colors.grey),
		('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
		('ALIGN', (0, 0), (-1, -1), 'CENTER'),
		('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
		('FONTSIZE', (0, 0), (-1, 0), 12),
		('BOTTOMPADDING', (0, 0), (-1, 0), 12),
		('BACKGROUND', (0, 1), (-1, -1), colors.beige),
		('GRID', (0, 0), (-1, -1), 1, colors.black),
	])
	style_tl = TableStyle([
		('BACKGROUND', (0, 0), (-1, 0), colors.grey),
		('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
		('ALIGN', (0, 0), (-1, -1), 'CENTER'),
		('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
		('FONTSIZE', (0, 0), (-1, 0), 12),
		('BOTTOMPADDING', (0, 0), (-1, 0), 12),
		('BACKGROUND', (0, 1), (-1, -1), colors.beige),
		('GRID', (0, 0), (-1, -1), 1, colors.black),
	])
	style_ga = TableStyle([
		('BACKGROUND', (0, 0), (-1, 0), colors.grey),
		('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
		('ALIGN', (0, 0), (-1, -1), 'CENTER'),
		('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
		('FONTSIZE', (0, 0), (-1, 0), 12),
		('BOTTOMPADDING', (0, 0), (-1, 0), 12),
		('BACKGROUND', (0, 1), (-1, -1), colors.beige),
		('GRID', (0, 0), (-1, -1), 1, colors.black),
	])

	table_ti = Table(data_ti, colWidths=col_widths_ti)
	table_tl = Table(data_tl, colWidths=col_widths_tl)
	table_ga = Table(data_ga, colWidths=col_widths_ga)

	table_ti.setStyle(style_ti)
	table_tl.setStyle(style_tl)
	table_ga.setStyle(style_ga)

	table_ti.wrapOn(p, inch*11, inch*8.5)
	table_tl.wrapOn(p, inch*11, inch*8.5)
	table_ga.wrapOn(p, inch*11, inch*8.5)

	table_ti.drawOn(p, inch, inch*5.5)
	table_tl.drawOn(p, inch, inch*3.5)
	table_ga.drawOn(p, inch, inch*1.5)

	p.showPage()
	p.save()

	buffer.seek(0)
	file_name = f'report_{Lat}_{Lng}.pdf'
	return FileResponse(buffer, as_attachment=True, filename=file_name)

def get_report_data(Lat, Lng, deviation):
	if deviation > 0:
		traffic_info_data = TrafficInfo.objects.filter(
			lat__range=(Lat - deviation, Lat + deviation),
			lng__range=(Lng - deviation, Lng + deviation)
		)
		traffic_light_data = TrafficLight.objects.filter(
			lat__range=(Lat - deviation, Lat + deviation),
			lng__range=(Lng - deviation, Lng + deviation)
		)
		alert_data = GenerateAlert.objects.filter(
			lat__range=(Lat - deviation, Lat + deviation),
			lng__range=(Lng - deviation, Lng + deviation)
		)
	else:
		traffic_info_data = TrafficInfo.objects.all()
		traffic_light_data = TrafficLight.objects.all()
		alert_data = GenerateAlert.objects.all()

	return traffic_info_data, traffic_light_data, alert_data

@csrf_exempt
def saveReport(request):
	if request.method == 'POST':
		data = json.loads(request.body)
		dev = 0.02
		
		lat = data.get('lat')
		lng = data.get('lng')
		zone = data.get('label')
		link = f'generateReport?Lat={lat}&Lng={lng}&Dev={dev}'
		content = zone + " Report"
		ariaLabel = content
		title = ariaLabel

		marker = GenerateReport(lat=lat, lng=lng, zone=zone, link=link, content=content, ariaLabel=ariaLabel, title=title)
		marker.save()

		return JsonResponse({'status': 'success', 'message': 'Marker saved successfully'})
	
	return JsonResponse({'status': 'fail', 'message': 'Invalid request method'})



# Feedback Functions

class FeedbackView(AjaxFormMixin, FormView):
	'''
	Generic FormView with our mixin for user feedback submission
	'''
	template_name = "users/feedback.html"
	form_class = FeedbackForm
	success_url = '/'

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super().dispatch(*args, **kwargs)

	def form_valid(self, form):
		feedback = form.save(commit=False)
		feedback.user = self.request.user
		feedback.save()
		messages.success(self.request, 'Your feedback has been submitted!')

		if is_ajax(self.request):
			result = "Success"
			message = 'Your feedback has been submitted!'
			data = {'result': result, 'message': message}
			return JsonResponse(data)
        
		return super().form_valid(form)
	
	def form_invalid(self, form):
		if is_ajax(self.request):
			message = form.errors
			data = {'result': 'Error', 'message': message}
			return JsonResponse(data)
		return super().form_invalid(form)

def feedbackList(request):
	feedback_list = Feedback.objects.all()
	return render(request, 'lists/feedback_list.html', {'feedback_list': feedback_list})
