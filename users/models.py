from django.db import models
from django.contrib.auth.models import User



class UserProfile(models.Model):
	'''
	Our UserProfile model extends the built-in Django User Model
	'''
	timestamp = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	
	address = models.CharField(verbose_name="Address",max_length=100, null=True, blank=True)
	town = models.CharField(verbose_name="Town/City",max_length=100, null=True, blank=True)
	county = models.CharField(verbose_name="County",max_length=100, null=True, blank=True)
	post_code = models.CharField(verbose_name="Post Code",max_length=8, null=True, blank=True)
	country = models.CharField(verbose_name="Country",max_length=100, null=True, blank=True)
	longitude = models.CharField(verbose_name="Longitude",max_length=50, null=True, blank=True)
	latitude = models.CharField(verbose_name="Latitude",max_length=50, null=True, blank=True)

	captcha_score = models.FloatField(default = 0.0)
	has_profile = models.BooleanField(default = False)
	
	is_active = models.BooleanField(default = True)

	def __str__(self):
		return f'{self.user}'
	



class TrafficInfo(models.Model):
	choices_list = [
		("green", "green"),
		("yellow", "yellow"),
		("red", "red")
	]
	
	timestamp = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
		
	lat = models.FloatField()
	lng = models.FloatField()
	zone = models.CharField(max_length=100)
	density = models.IntegerField()
	med_speed = models.IntegerField()
	lights = models.BooleanField(default=False)
	cameras = models.BooleanField(default=False)
	signs = models.BooleanField(default=False)
	incidents = models.BooleanField(default=False)
	accidents = models.BooleanField(default=False)
	alerts = models.BooleanField(default=False)
	alert_content = models.CharField(max_length=255, blank=True)
	ariaLabel = models.CharField(max_length=100)
	icon = models.CharField(choices=choices_list, max_length=10, default='green')
	title = models.CharField(max_length=100)

	def __str__(self):
		return f'{self.title}'

	


class TrafficLight(models.Model):
	orientation_list = [
		("N", "N"),
		("NE", "NE"),
		("E", "E"),
		("SE", "SE"),
		("S", "S"),
		("SV", "SV"),
		("V", "V"),
		("NV", "NV")
	]
	program_list = [
		("MANUAL", "MANUAL"),
		("AUTO", "AUTO")
	]
	
	timestamp = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
		
	lat = models.FloatField()
	lng = models.FloatField()
	zone = models.CharField(max_length=100)
	orientation = models.CharField(choices=orientation_list, max_length=3, default='N')
	functioning = models.BooleanField(default=False)
	function_error = models.CharField(max_length=100, blank=True)
	program = models.CharField(choices=program_list, max_length=10, default='MANUAL')
	time_red = models.IntegerField()
	time_yellow = models.IntegerField()
	time_green = models.IntegerField()
	error = models.CharField(max_length=100, blank=True)
	ariaLabel = models.CharField(max_length=100)
	title = models.CharField(max_length=100)

	def __str__(self):
		return f'{self.title}'
	



class GenerateAlert(models.Model):
	timestamp = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
		
	lat = models.FloatField()
	lng = models.FloatField()
	zone = models.CharField(max_length=100)
	speed = models.FloatField()
	alert = models.CharField(max_length=100)
	content = models.CharField(max_length=300)
	ariaLabel = models.CharField(max_length=100)
	title = models.CharField(max_length=100)

	def __str__(self):
		return f'{self.title}'
	



class GenerateReport(models.Model):
	timestamp = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
		
	lat = models.FloatField()
	lng = models.FloatField()
	zone = models.CharField(max_length=100)
	link = models.URLField(max_length=200)
	content = models.CharField(max_length=300)
	ariaLabel = models.CharField(max_length=100)
	title = models.CharField(max_length=100)

	def __str__(self):
		return f'{self.title}'




class Feedback(models.Model):
	timestamp = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)
		
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	title = models.CharField(max_length=200, blank=False, null=False)
	description = models.TextField(max_length=1000, blank=False, null=False)
	photo = models.ImageField(upload_to='feedback_photos/', blank=True, null=True)

	def __str__(self):
		return f'{self.title}'