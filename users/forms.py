from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User
from django import forms
from .models import UserProfile, Feedback


class UserForm(UserCreationForm):
	'''
	Form that uses built-in UserCreationForm to handel user creation
	'''
	first_name = forms.CharField(max_length=30, required=True,
		widget=forms.TextInput(attrs={'placeholder': '*Your first name..'}))
	last_name = forms.CharField(max_length=30, required=True,
		widget=forms.TextInput(attrs={'placeholder': '*Your last name..'}))
	username = forms.EmailField(max_length=254, required=True,
		widget=forms.TextInput(attrs={'placeholder': '*Email..'}))
	password1 = forms.CharField(
		widget=forms.PasswordInput(attrs={'placeholder': '*Password..','class':'password'}))
	password2 = forms.CharField(
		widget=forms.PasswordInput(attrs={'placeholder': '*Confirm Password..','class':'password'}))

	#reCAPTCHA token
	token = forms.CharField(
		widget=forms.HiddenInput())

	class Meta:
		model = User
		fields = ('username', 'first_name', 'last_name', 'password1', 'password2', )



class AuthForm(AuthenticationForm):
	'''
	Custom Authentication Form that accepts both username or email.
	'''
	username = forms.CharField(max_length=254, required=True,
		widget=forms.TextInput(attrs={'placeholder': '*Username or Email...'}))
	
	password = forms.CharField(
		widget=forms.PasswordInput(attrs={'placeholder': '*Password...','class':'password'}))

	class Meta:
		model = User
		fields = ('username','password', )



class UserProfileForm(forms.ModelForm):
	'''
	Basic model-form for our user profile that extends Django user model.
	
	'''
	address = forms.CharField(max_length=100, required=True, widget = forms.HiddenInput())
	town = forms.CharField(max_length=100, required=True, widget = forms.HiddenInput())
	county = forms.CharField(max_length=100, required=True, widget = forms.HiddenInput())
	post_code = forms.CharField(max_length=8, required=True, widget = forms.HiddenInput())
	country = forms.CharField(max_length=40, required=True, widget = forms.HiddenInput())
	longitude = forms.CharField(max_length=50, required=True, widget = forms.HiddenInput())
	latitude = forms.CharField(max_length=50, required=True, widget = forms.HiddenInput())


	class Meta:
		model = UserProfile
		fields = ('address', 'town', 'county', 'post_code',
		 'country', 'longitude', 'latitude', )



class UsernameForm(AuthenticationForm):
	'''
	Basic model-form for our user reset password feature that extends Django user model.
	'''
	username = forms.EmailField(max_length=254, required=True,
		widget=forms.TextInput(attrs={'placeholder': '*Email..'}))

	class Meta:
		model = User
		fields = ('username', )



class FeedbackForm(forms.ModelForm):
	'''
	Basic model-form for feedback feature.
	'''
	title = forms.CharField(max_length=200, required=True,
		widget=forms.TextInput(attrs={'placeholder': '*Title..'}))
	description = forms.CharField(max_length=1000, required=True,
		widget=forms.Textarea(attrs={'placeholder': '*Description..'}))
	photo = forms.ImageField(required=False,widget=forms.FileInput(attrs={'placeholder': 'Picture..'}))
	
	class Meta:
		model = Feedback
		fields = ['title', 'description', 'photo']