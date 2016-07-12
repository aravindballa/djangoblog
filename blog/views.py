from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect, render_to_response
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from blog.forms import UserForm, PostForm
from models import Post
from serializers import PostSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.generic import View


# Create your views here.

class PostList(APIView):
    def get(self, request):
        posts = Post.objects.all()
        if request.user.is_authenticated():
            posts = posts.filter(user=request.user)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class PostDetail(APIView):

    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        post = self.get_object(pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        post = self.get_object(pk)
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        post = self.get_object(pk)
        post.delete()
        return Response(status=204)


class UserFormView(View):
    form_class = UserForm
    template_name = 'registration/register.html'

    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)

        if form.is_valid():
            user = form.save(commit=False)
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user.set_password(password)
            user.save()

            user = authenticate(username=username, password=password)

            if user is not None:
                if user.is_active:
                    login(request, user)
                    return redirect('index')

        return render(request, self.template_name, {'form': form})

def index(request):
    return render(request, 'index.html')

def public(request):
    user = None
    if request.user.is_authenticated():
        user = request.user
    return render(request, 'public.html', context={'user': user})

class PostFormView(View):
    form_class = PostForm
    template_name = 'new-post.html'

    def get(self, request):
        form = self.form_class(None)
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)

        if form.is_valid():
            post = form.save(commit=False)
            title = form.cleaned_data['title']
            post.slug = '_'.join(title.lower().split(' '))
            post.user = request.user
            post.save()

            return redirect('index')

        return render(request, self.template_name, {'form': form})

class PublicPostList(APIView):
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

