import { useTranslation } from 'react-i18next'

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl text-center">
        <div className="text-4xl mb-4">🗑️</div>
        <h3 className="font-semibold text-gray-800 mb-2">{t('common.confirmDelete')}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium cursor-pointer"
          >
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
