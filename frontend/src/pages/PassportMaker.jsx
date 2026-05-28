import { useState } from "react"

import UploadBox from "../components/UploadBox"
import ProgressBar from "../components/ProgressBar"
import ImagePreview from "../components/ImagePreview"
import ImageModal from "../components/ImageModal"

import API from "../services/api"

function PassportMaker() {

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

  const [copies, setCopies] =
    useState("4")

  const [customCopies, setCustomCopies] =
    useState("")

  const [width, setWidth] =
    useState(413)

  const [height, setHeight] =
    useState(531)

  const [bgColor, setBgColor] =
    useState("")

    

  const handleGeneratePassport =
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
          "copies",
          copies === "custom"
            ? customCopies
            : copies
        )

        formData.append(
          "width",
          width
        )

        formData.append(
          "height",
          height
        )

        formData.append(
          "bg_color",
          bgColor
        )

        const response =
          await API.post(
            "passport-photo/",
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

        alert(
          "Passport generation failed"
        )

      } finally {

        setLoading(false)

      }
    }

    const handleDownload = async () => {

  const response = await fetch(
    processedImage
  )

  const blob =
    await response.blob()

  const url =
    window.URL.createObjectURL(blob)

  const link =
    document.createElement("a")

  link.href = url

  link.download =
    "passport-photo.png"

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  window.URL.revokeObjectURL(url)
}

  return (

    <div className="min-h-screen bg-slate-900 px-4 py-10">

      <div className="max-w-5xl mx-auto bg-slate-800 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-5xl font-bold text-white text-center mb-4">
          Passport Photo Maker
        </h1>

        <p className="text-slate-400 text-center mb-10">
          Generate professional passport photos
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

          {/* Copies */}

          <div>

            <label className="text-white block mb-2">
              Number of Copies
            </label>

            <select
              value={copies}
              onChange={(e) =>
                setCopies(
                  e.target.value
                )
              }
              className="w-full bg-slate-700 text-white p-4 rounded-xl outline-none"
            >

              <option value="1">
                1
              </option>

              <option value="2">
                2
              </option>

              <option value="4">
                4
              </option>

              <option value="8">
                8
              </option>

              <option value="16">
                16
              </option>

              <option value="custom">
                Custom
              </option>

            </select>

            {
              copies === "custom" && (
                <input
                  type="number"
                  placeholder="Enter custom copies"
                  value={customCopies}
                  onChange={(e) =>
                    setCustomCopies(
                      e.target.value
                    )
                  }
                  className="w-full mt-4 bg-slate-700 text-white p-4 rounded-xl outline-none"
                />
              )
            }

          </div>

          {/* BG Color */}

          <div>

            <label className="text-white block mb-2">
              Background Color
            </label>

            <select
              value={bgColor}
              onChange={(e) =>
                setBgColor(
                  e.target.value
                )
              }
              className="w-full bg-slate-700 text-white p-4 rounded-xl outline-none"
            >

              <option value="">
                Transparent
              </option>

              <option value="white">
                White
              </option>

              <option value="blue">
                Blue
              </option>

              <option value="red">
                Red
              </option>

              <option value="gray">
                Gray
              </option>

            </select>

          </div>

          {/* Width */}

          <div>

            <label className="text-white block mb-2">
              Width
            </label>

            <input
              type="number"
              value={width}
              onChange={(e) =>
                setWidth(
                  e.target.value
                )
              }
              className="w-full bg-slate-700 text-white p-4 rounded-xl outline-none"
            />

          </div>

          {/* Height */}

          <div>

            <label className="text-white block mb-2">
              Height
            </label>

            <input
              type="number"
              value={height}
              onChange={(e) =>
                setHeight(
                  e.target.value
                )
              }
              className="w-full bg-slate-700 text-white p-4 rounded-xl outline-none"
            />

          </div>

        </div>

        <button
          onClick={
            handleGeneratePassport
          }
          disabled={loading}
          className={`mt-10 w-full py-4 rounded-2xl text-white text-lg font-semibold transition ${
            loading
              ? "bg-slate-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >

          {
            loading
              ? "Generating..."
              : "Generate Passport Photo"
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
                title="Passport Photo"
                onClick={() =>
                  setModalImage(
                    processedImage
                  )
                }
              />

              <button
  onClick={handleDownload}
  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-center font-semibold transition"
>
  Download Passport Photo
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

export default PassportMaker