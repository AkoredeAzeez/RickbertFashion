import React, { createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Toast = { id: string; message: string }

const ToastCtx = createContext<{ show: (message: string) => void } | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = (message: string) => {
    console.debug('[Toast] show()', message)
    const t: Toast = { id: Date.now().toString(), message }
    setToasts((s) => [...s, t])
    // auto remove after 3s
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== t.id))
    }, 3000)
  }

  // Expose a helper for manual testing in the browser console
  useEffect(() => {
    // @ts-ignore
    window.__rb_show_toast = show
    return () => {
      // @ts-ignore
      delete window.__rb_show_toast
    }
  }, [])

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      {/* Toast container via portal to document.body so it sits above app overlays */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div aria-live='polite' className='fixed top-6 right-6 z-[9999] pointer-events-auto'>
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
          </div>,
          document.body,
        )}
    </ToastCtx.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

export default ToastProvider
