import React, { createContext, useContext, useEffect, useState } from 'react'

type Toast = { id: string; message: string }

const ToastCtx = createContext<{ show: (message: string) => void } | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = (message: string) => {
    const t: Toast = { id: Date.now().toString(), message }
    setToasts((s) => [...s, t])
    // auto remove after 3s
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== t.id))
    }, 3000)
  }

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}

      {/* Toast container */}
      <div aria-live='polite' className='fixed top-6 right-6 z-50'>
        <div className='flex flex-col gap-3'>
          {toasts.map((t) => (
            <div
              key={t.id}
              className='notification bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg font-semibold'
              style={{ minWidth: 220 }}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export default ToastProvider
