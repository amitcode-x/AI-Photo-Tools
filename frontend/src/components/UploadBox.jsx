import { useRef } from "react"

function UploadBox({ image, setImage, preview, setPreview }) {
  const inputRef = useRef()

  const handleImageChange = (file) => {
    if (!file) return

    setImage(file)

    const imageURL = URL.createObjectURL(file)
    setPreview(imageURL)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    handleImageChange(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()

    const file = e.dataTransfer.files[0]
    handleImageChange(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-slate-500 rounded-2xl p-10 cursor-pointer hover:border-blue-500 transition text-center"
    >
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleInputChange}
      />

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-48 h-48 object-cover rounded-xl mx-auto"
        />
      ) : (
        <div>
          <p className="text-slate-300 text-lg mb-2">
            Click or Drag & Drop Image
          </p>

          <p className="text-slate-500 text-sm">
            JPG, PNG supported
          </p>
        </div>
      )}
    </div>
  )
}

export default UploadBox