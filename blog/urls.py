from django.conf.urls import url
from django.contrib.auth.decorators import login_required


from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    url('^$', views.public, name='all'),
    url('^user/$', login_required(views.index), name='index'),
    url('^new/$', login_required(views.PostFormView.as_view()), name='new'),

    url(r'^api/posts/$', views.PostList.as_view(), name='post-list'),
    url(r'^api/post/(?P<pk>[0-9]+)$', views.PostDetail.as_view(), name='post-detail'),

    url(r'^api/public/$', views.PublicPostList.as_view(), name='public-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
