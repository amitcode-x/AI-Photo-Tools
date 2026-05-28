import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error)
    console.error(errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
          
          <div className="bg-slate-800 p-8 rounded-2xl text-center max-w-lg w-full shadow-2xl">
            
            <h1 className="text-3xl font-bold text-red-500 mb-4">
              Something went wrong
            </h1>

            <p className="text-slate-300 mb-6">
              The application crashed unexpectedly.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
            >
              Reload App
            </button>

          </div>

        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary