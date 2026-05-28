function ProgressBar() {
  return (
    <div className="w-full mt-6">

      <div className="flex justify-between text-sm text-slate-300 mb-2">
        <span>Processing Image...</span>
        <span>Please wait</span>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

        <div className="bg-blue-500 h-3 rounded-full animate-pulse w-full"></div>

      </div>

    </div>
  )
}

export default ProgressBar