import { useState } from "react"

import UploadBox from "../components/UploadBox"
import ProgressBar from "../components/ProgressBar"
import ImagePreview from "../components/ImagePreview"
import ImageModal from "../components/ImageModal"

import API from "../services/api"

function FaceDetection() {
  const [image, setImage] = useState(null)

  const [preview, setPreview] = useState(null)

  const [processedImage, setProcessedImage] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [modalImage, setModalImage] =
    useState(null)

  const handleFaceDetect = async () => {
    if (!image) {
      alert("Please upload image")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append("image", image)

      const response = await API.post(
        "face-detect/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      )

      setProcessedImage(
        response.data.processed_image
      )

    } catch (error) {
      console.error(error)

      alert("Face detection failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10">

      <div className="max-w-3xl mx-auto bg-slate-800 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-5xl font-bold text-white text-center mb-4">
          Face Detection
        </h1>

        <p className="text-slate-400 text-center mb-10">
          Detect faces automatically using AI
        </p>

        <UploadBox
          image={image}
          setImage={setImage}
          preview={preview}
          setPreview={setPreview}
        />

        {preview && (
          <ImagePreview
            image={preview}
            title="Original Image"
            onClick={() =>
              setModalImage(preview)
            }
          />
        )}

        <button
          onClick={handleFaceDetect}
          disabled={loading}
          className={`mt-8 w-full py-4 rounded-2xl text-white text-lg font-semibold transition ${
            loading
              ? "bg-slate-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading
            ? "Detecting..."
            : "Detect Face"}
        </button>

        {loading && <ProgressBar />}

        {processedImage && (
          <>
            <ImagePreview
              image={processedImage}
              title="Detected Face"
              onClick={() =>
                setModalImage(
                  processedImage
                )
              }
            />

            <a
              href={processedImage}
              download
              className="block mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-center font-semibold transition"
            >
              Download Image
            </a>
          </>
        )}

        {modalImage && (
          <ImageModal
            image={modalImage}
            onClose={() =>
              setModalImage(null)
            }
          />
        )}

      </div>

    </div>
  )
}

export default FaceDetection