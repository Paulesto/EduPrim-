import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../i18n'

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { i18n } = useTranslation()

  const handleChange = (code) => {
    i18n.changeLanguage(code)
  }

  if (variant === 'compact') {
    return (
      <div className="flex gap-1">
        {LANGUAGES.map(({ code, flag }) => (
          <button
            key={code}
            onClick={() => handleChange(code)}
            title={code.toUpperCase()}
            className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-colors cursor-pointer ${
              i18n.language === code
                ? 'bg-blue-100 ring-2 ring-blue-400'
                : 'hover:bg-gray-100'
            }`}
          >
            {flag}
          </button>
        ))}
      </div>
    )
  }

  return (
    <select
      value={i18n.language}
      onChange={(e) => handleChange(e.target.value)}
      aria-label="Language"
      className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs bg-white outline-none focus:border-blue-400 cursor-pointer"
    >
      {LANGUAGES.map(({ code, flag, label }) => (
        <option key={code} value={code}>
          {flag} {label}
        </option>
      ))}
    </select>
  )
}

export default LanguageSwitcher
