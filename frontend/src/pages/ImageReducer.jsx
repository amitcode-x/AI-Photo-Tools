import { useState } from "react"

import UploadBox from "../components/UploadBox"
import ProgressBar from "../components/ProgressBar"
import ImagePreview from "../components/ImagePreview"
import ImageModal from "../components/ImageModal"

import API from "../services/api"

function ImageReducer() {

  const [image, setImage] =
    useState(null)

  const [preview, setPreview] =
    useState(null)

  const [processedImage, setProcessedImage] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [modalImage, setModalImage] =
    useState(null)

  const [targetKB, setTargetKB] =
    useState(200)

  const [finalSize, setFinalSize] =
    useState(null)

  const handleReduceImage =
    async () => {

      if (!image) {
        alert("Please upload image")
        return
      }

      try {

        setLoading(true)

        const formData =
          new FormData()

        formData.append(
          "image",
          image
        )

        formData.append(
          "target_kb",
          targetKB
        )

        const response =
          await API.post(
            "image-reducer/",
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

        setFinalSize(
          response.data.final_size_kb
        )

      } catch (error) {

        console.error(error)

        alert(
          "Image compression failed"
        )

      } finally {

        setLoading(false)

      }
    }

  const handleDownload =
    async () => {

      const response =
        await fetch(processedImage)

      const blob =
        await response.blob()

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement("a")

      link.href = url

      link.download =
        "compressed-image.jpg"

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      window.URL.revokeObjectURL(url)
    }

  return (

    <div className="min-h-screen bg-slate-900 px-4 py-10">

      <div className="max-w-5xl mx-auto bg-slate-800 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-5xl font-bold text-white text-center mb-4">
          Image Size Reducer
        </h1>

        <p className="text-slate-400 text-center mb-10">
          Compress images for forms and uploads
        </p>

        <UploadBox
          image={image}
          setImage={setImage}
          preview={preview}
          setPreview={setPreview}
        />

        {
          preview && (
            <div className="max-w-sm mx-auto">
              <ImagePreview
                image={preview}
                title="Original Image"
                onClick={() =>
                  setModalImage(preview)
                }
              />
            </div>
          )
        }

        <div className="mt-10">

          <label className="text-white block mb-2">
            Target Size (KB)
          </label>

          <select
            value={targetKB}
            onChange={(e) =>
              setTargetKB(
                e.target.value
              )
            }
            className="w-full bg-slate-700 text-white p-4 rounded-xl outline-none"
          >

            <option value="50">
              50 KB
            </option>

            <option value="100">
              100 KB
            </option>

            <option value="200">
              200 KB
            </option>

            <option value="500">
              500 KB
            </option>

            <option value="1024">
              1 MB
            </option>

          </select>

        </div>

        <button
          onClick={handleReduceImage}
          disabled={loading}
          className={`mt-10 w-full py-4 rounded-2xl text-white text-lg font-semibold transition ${
            loading
              ? "bg-slate-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >

          {
            loading
              ? "Compressing..."
              : "Reduce Image Size"
          }

        </button>

        {
          loading && (
            <ProgressBar />
          )
        }

        {
          processedImage && (
            <>

              <ImagePreview
                image={processedImage}
                title="Compressed Image"
                onClick={() =>
                  setModalImage(
                    processedImage
                  )
                }
              />

              <div className="mt-4 text-center text-green-400 text-lg">

                Final Size:
                {" "}
                {finalSize}
                {" "}
                KB

              </div>

              <button
                onClick={handleDownload}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-center font-semibold transition"
              >
                Download Compressed Image
              </button>

            </>
          )
        }

        {
          modalImage && (
            <ImageModal
              image={modalImage}
              onClose={() =>
                setModalImage(null)
              }
            />
          )
        }

      </div>

    </div>

  )
}

export default ImageReducer