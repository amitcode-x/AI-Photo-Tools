import os
import uuid
import cv2
import numpy as np

from PIL import Image

from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response

from rembg import remove
from io import BytesIO


# ==============================
# REMOVE BACKGROUND
# ==============================

@api_view(['POST'])
def remove_bg(request):

    image = request.FILES.get('image')

    if not image:
        return Response({
            "error": "No image uploaded"
        }, status=400)

    filename = f"{uuid.uuid4()}.png"

    upload_path = os.path.join(
        settings.MEDIA_ROOT,
        'uploads',
        filename
    )

    with open(upload_path, 'wb+') as destination:
        for chunk in image.chunks():
            destination.write(chunk)

    with open(upload_path, 'rb') as input_file:
        input_image = input_file.read()

    output_image = remove(input_image)

    processed_path = os.path.join(
        settings.MEDIA_ROOT,
        'processed',
        filename
    )

    with open(processed_path, 'wb') as output_file:
        output_file.write(output_image)

    processed_image_url = request.build_absolute_uri(
        f"/media/processed/{filename}"
    )

    return Response({
        "processed_image":
        processed_image_url
    })


# ==============================
# FACE DETECTION
# ==============================

@api_view(['POST'])
def face_detect(request):

    image = request.FILES.get('image')

    if not image:
        return Response({
            "error": "No image uploaded"
        }, status=400)

    filename = f"{uuid.uuid4()}.png"

    upload_path = os.path.join(
        settings.MEDIA_ROOT,
        'uploads',
        filename
    )

    with open(upload_path, 'wb+') as destination:
        for chunk in image.chunks():
            destination.write(chunk)

    img = cv2.imread(upload_path)

    gray = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2GRAY
    )

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades +
        'haarcascade_frontalface_default.xml'
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )

    for (x, y, w, h) in faces:

        cv2.rectangle(
            img,
            (x, y),
            (x + w, y + h),
            (0, 255, 0),
            3
        )

    processed_path = os.path.join(
        settings.MEDIA_ROOT,
        'processed',
        filename
    )

    cv2.imwrite(
        processed_path,
        img
    )

    processed_image_url = request.build_absolute_uri(
        f"/media/processed/{filename}"
    )

    return Response({
        "processed_image":
        processed_image_url
    })


# ==============================
# PASSPORT PHOTO
# ==============================

@api_view(['POST'])
def passport_photo(request):

    image = request.FILES.get('image')

    copies = int(
        request.POST.get("copies", 4)
    )

    bg_color = request.POST.get(
        "bg_color",
        ""
    )

    width = int(
        request.POST.get("width", 413)
    )

    height = int(
        request.POST.get("height", 531)
    )

    if not image:
        return Response({
            "error": "No image uploaded"
        }, status=400)

    filename = f"{uuid.uuid4()}.png"

    upload_path = os.path.join(
        settings.MEDIA_ROOT,
        'uploads',
        filename
    )

    with open(upload_path, 'wb+') as destination:
        for chunk in image.chunks():
            destination.write(chunk)

    # BG REMOVE
    with open(upload_path, 'rb') as input_file:
        input_image = input_file.read()

    output_image = remove(input_image)

    processed_path = os.path.join(
        settings.MEDIA_ROOT,
        'processed',
        filename
    )

    with open(processed_path, 'wb') as output_file:
        output_file.write(output_image)

    image_pil = Image.open(
        processed_path
    ).convert("RGBA")

    # BG COLORS
    colors = {
        "white": (255, 255, 255, 255),
        "blue": (67, 120, 255, 255),
        "red": (255, 80, 80, 255),
        "gray": (180, 180, 180, 255),
    }

    # Transparent default
    if bg_color == "":

        final_image = image_pil

    else:

        selected_color = colors.get(
            bg_color,
            (255, 255, 255, 255)
        )

        bg = Image.new(
            "RGBA",
            image_pil.size,
            selected_color
        )

        final_image = Image.alpha_composite(
            bg,
            image_pil
        )

    # OpenCV
    open_cv_image = np.array(final_image)

    open_cv_image = cv2.cvtColor(
        open_cv_image,
        cv2.COLOR_RGBA2BGR
    )

    gray = cv2.cvtColor(
        open_cv_image,
        cv2.COLOR_BGR2GRAY
    )

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades +
        'haarcascade_frontalface_default.xml'
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(100, 100)
    )

    cropped = open_cv_image

    if len(faces) > 0:

        x, y, w, h = faces[0]

        top_padding = int(h * 1.2)

        side_padding = int(w * 0.8)

        bottom_padding = int(h * 1.8)

        start_x = max(
            x - side_padding,
            0
        )

        start_y = max(
            y - top_padding,
            0
        )

        end_x = min(
            x + w + side_padding,
            open_cv_image.shape[1]
        )

        end_y = min(
            y + h + bottom_padding,
            open_cv_image.shape[0]
        )

        cropped = open_cv_image[
            start_y:end_y,
            start_x:end_x
        ]

    resized = cv2.resize(
        cropped,
        (width, height)
    )

    passport_pil = Image.fromarray(
        cv2.cvtColor(
            resized,
            cv2.COLOR_BGR2RGB
        )
    )

    # DYNAMIC GRID
    if copies <= 2:
        cols = copies

    elif copies <= 4:
        cols = 2

    elif copies <= 9:
        cols = 3

    else:
        cols = 4

    rows = (copies + cols - 1) // cols

    spacing = 30

    canvas_width = (
        cols * width
    ) + ((cols + 1) * spacing)

    canvas_height = (
        rows * height
    ) + ((rows + 1) * spacing)

    canvas = Image.new(
        "RGB",
        (
            canvas_width,
            canvas_height
        ),
        (255, 255, 255)
    )

    count = 0

    for row in range(rows):

        for col in range(cols):

            if count >= copies:
                break

            x_pos = spacing + (
                col * (width + spacing)
            )

            y_pos = spacing + (
                row * (height + spacing)
            )

            canvas.paste(
                passport_pil,
                (x_pos, y_pos)
            )

            count += 1

    canvas.save(processed_path)

    processed_image_url = request.build_absolute_uri(
        f"/media/processed/{filename}"
    )

    return Response({
        "processed_image":
        processed_image_url
    })


@api_view(['POST'])
def image_reducer(request):

    image = request.FILES.get('image')

    target_kb = int(
        request.POST.get(
            "target_kb",
            200
        )
    )

    if not image:
        return Response({
            "error": "No image uploaded"
        }, status=400)

    filename = f"{uuid.uuid4()}.jpg"

    processed_path = os.path.join(
        settings.MEDIA_ROOT,
        'processed',
        filename
    )

    img = Image.open(image)

    if img.mode == "RGBA":
        img = img.convert("RGB")

    quality = 95

    while quality > 5:

        buffer = BytesIO()

        img.save(
            buffer,
            format="JPEG",
            quality=quality,
            optimize=True
        )

        size_kb = (
            len(buffer.getvalue()) / 1024
        )

        if size_kb <= target_kb:
            break

        quality -= 5

    with open(processed_path, 'wb') as f:
        f.write(buffer.getvalue())

    processed_image_url = request.build_absolute_uri(
        f"/media/processed/{filename}"
    )

    return Response({

        "processed_image":
        processed_image_url,

        "final_size_kb":
        round(size_kb, 2)

    })



