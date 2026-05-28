function ImageModal({ image, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">

      <div className="relative max-w-5xl w-full flex justify-center">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full text-xl"
        >
          ×
        </button>

        <img
          src={image}
          alt="Full Preview"
          className="max-h-[90vh] rounded-2xl shadow-2xl"
        />

      </div>
    </div>
  )
}

export default ImageModal