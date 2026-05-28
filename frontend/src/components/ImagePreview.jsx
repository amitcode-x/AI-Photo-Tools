function ImagePreview({
  image,
  title,
  onClick,
}) {
  return (
    <div className="mt-8 w-full">

      <h2 className="text-white text-2xl mb-4">
        {title}
      </h2>

      <div className="bg-slate-900 p-4 rounded-2xl shadow-xl flex justify-center items-center overflow-hidden">

        <img
          src={image}
          alt="Preview"
          onClick={onClick}
          className="
            max-h-[700px]
            w-auto
            max-w-full
            object-contain
            rounded-xl
            cursor-pointer
            hover:scale-[1.02]
            transition
          "
        />

      </div>

      <p className="text-slate-400 text-sm mt-2 text-center">
        Click image to view full size
      </p>

    </div>
  )
}

export default ImagePreview