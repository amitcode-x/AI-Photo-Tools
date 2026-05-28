import { Link } from "react-router-dom"

function Home() {
  const features = [
    {
      title: "Background Remove",
      description:
        "Remove image background instantly",
      path: "/bg-remove",
    },

    {
      title: "Face Detection",
      description:
        "Detect and crop face automatically",
      path: "/face-detection",
    },

    {
      title: "Passport Photo Maker",
      description:
        "Generate passport-size photos",
      path: "/passport-maker",
    },
    {
  title: "Image Size Reducer",
  description:
    "Compress image size instantly",
  path: "/image-reducer",
},
  ]

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10">

      <h1 className="text-5xl font-bold text-center text-white mb-4">
        AI Photo Tools
      </h1>

      <p className="text-slate-400 text-center mb-14">
        Professional AI image processing tools
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.path}
            className="bg-slate-800 p-8 rounded-3xl shadow-2xl hover:scale-105 transition duration-300"
          >

            <h2 className="text-3xl font-bold text-white mb-4">
              {feature.title}
            </h2>

            <p className="text-slate-400">
              {feature.description}
            </p>

          </Link>
        ))}

      </div>

    </div>
  )
}

export default Home