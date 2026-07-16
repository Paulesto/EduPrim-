import { useTranslation } from 'react-i18next'

const Pagination = ({ pagination, onPageChange }) => {
  const { t } = useTranslation()

  if (!pagination || pagination.last_page <= 1) return null

  const pages = Array.from({ length: pagination.last_page }, (_, i) => i + 1)
  const from = ((pagination.current_page - 1) * pagination.per_page) + 1
  const to = Math.min(pagination.current_page * pagination.per_page, pagination.total)

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
      <span className="text-xs text-gray-400">
        {t('pagination.showing', { from, to, total: pagination.total })}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
        >
          ‹
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              page === pagination.current_page
                ? 'bg-blue-700 text-white border border-blue-700'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.last_page}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default Pagination
