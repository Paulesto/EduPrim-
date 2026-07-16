import { useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const config = {
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✅' },
    error:   { bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-700',   icon: '❌' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '⚠️' },
  }

  const c = config[type] || config.success

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${c.bg} ${c.border} ${c.text} animate-bounce`}>
      <span>{c.icon}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
    </div>
  )
}

export default Toast