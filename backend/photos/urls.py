from django.urls import path

from .views import (
    remove_bg,
    face_detect,
    passport_photo,image_reducer
)

urlpatterns = [

    path(
        'remove-bg/',
        remove_bg
    ),

    path(
        'face-detect/',
        face_detect
    ),

    path(
        'passport-photo/',
        passport_photo
    ),
    path(
    'image-reducer/',
    image_reducer
),

]