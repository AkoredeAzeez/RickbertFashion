import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createProduct } from '@/actions/products.action'

const Upload = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [sizes, setSizes] = useState('')
  const [colors, setColors] = useState('')
  const [stock, setStock] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  )
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)

    previews.forEach((url) => URL.revokeObjectURL(url))

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const removeImage = (indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove)
    const newPreviews = previews.filter((_, index) => index !== indexToRemove)

    URL.revokeObjectURL(previews[indexToRemove])

    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!files.length) return

    setLoading(true)
    setUploadProgress({})

    try {
      await createProduct(
        {
          name,
          price: Number(price),
          description,
          sizes,
          colors,
          stock,
        },
        files,
        setUploadProgress,
      )

      setShowSuccess(true)

      setTimeout(() => {
        setName('')
        setPrice('')
        setDescription('')
        setSizes('')
        setColors('')
        setStock(0)
        setFiles([])
        setPreviews([])
        setUploadProgress({})
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('❌ Upload failed:', error)
      alert('❌ Failed to upload product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-stone-50 py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className='text-3xl md:text-4xl font-light tracking-wide text-stone-900 mb-4'>
            ADD NEW PRODUCT
          </h1>
          <div className='w-20 h-0.5 bg-stone-400 mx-auto mb-6' />
          <p className='text-stone-600 font-light max-w-2xl mx-auto'>
            Create and upload new fashion pieces to your collection
          </p>
        </motion.div>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className='bg-white p-12 text-center max-w-md mx-4'
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </motion.div>
                <h3 className='text-xl font-light tracking-wide text-stone-900 mb-2'>
                  PRODUCT CREATED
                </h3>
                <p className='text-stone-600 font-light'>
                  Your product has been successfully uploaded
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Form */}
        <motion.div
          className='bg-white border border-stone-200 p-8 md:p-12'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className='space-y-8'>
            {/* Product Images */}
            <div className='space-y-4'>
              <label className='block text-sm font-light tracking-wide text-stone-700 uppercase mb-4'>
                Product Images *
              </label>

              <motion.div
                className='border-2 border-dashed border-stone-300 p-8 text-center hover:border-stone-400 transition-colors duration-300 cursor-pointer'
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input
                  type='file'
                  accept='image/*'
                  multiple
                  onChange={handleFilesChange}
                  required
                  className='hidden'
                  id='file-upload'
                />
                <label htmlFor='file-upload' className='cursor-pointer'>
                  <div className='w-12 h-12 mx-auto mb-4 text-stone-400'>
                    <svg fill='none' stroke='currentColor' viewBox='0 0 48 48'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1}
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                      />
                    </svg>
                  </div>
                  <p className='text-stone-600 font-light mb-2'>
                    Click to upload images
                  </p>
                  <p className='text-xs text-stone-500 uppercase tracking-wide'>
                    JPG, PNG, WEBP up to 10MB each
                  </p>
                </label>
              </motion.div>

              {/* Image Previews */}
              <AnimatePresence>
                {previews.length > 0 && (
                  <motion.div
                    className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {previews.map((src, idx) => (
                      <motion.div
                        key={idx}
                        className='relative aspect-square group'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className='w-full h-full object-cover border border-stone-200 transition-transform duration-300 group-hover:scale-105'
                        />

                        {/* Upload Progress */}
                        {loading && uploadProgress[idx] !== undefined && (
                          <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                            <div className='text-white text-sm font-light'>
                              {uploadProgress[idx]}%
                            </div>
                          </div>
                        )}

                        {/* Remove Button */}
                        {!loading && (
                          <motion.button
                            type='button'
                            onClick={() => removeImage(idx)}
                            className='absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <svg
                              className='w-3 h-3'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                              />
                            </svg>
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Product Details Grid */}
            <div className='grid md:grid-cols-2 gap-8'>
              {/* Left Column */}
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-light tracking-wide text-stone-700 uppercase mb-2'>
                    Product Name *
                  </label>
                  <motion.input
                    type='text'
                    placeholder='Enter product name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className='w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors duration-300 font-light'
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <div>
                  <label className='block text-sm font-light tracking-wide text-stone-700 uppercase mb-2'>
                    Price (₦) *
                  </label>
                  <motion.input
                    type='number'
                    placeholder='0.00'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min='0'
                    step='0.01'
                    className='w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors duration-300 font-light'
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <div>
                  <label className='block text-sm font-light tracking-wide text-stone-700 uppercase mb-2'>
                    Stock Quantity
                  </label>
                  <motion.input
                    type='number'
                    placeholder='0'
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min='0'
                    className='w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors duration-300 font-light'
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-light tracking-wide text-stone-700 uppercase mb-2'>
                    Available Sizes
                  </label>
                  <motion.input
                    type='text'
                    placeholder='XS, S, M, L, XL'
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    className='w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors duration-300 font-light'
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>

                <div>
                  <label className='block text-sm font-light tracking-wide text-stone-700 uppercase mb-2'>
                    Available Colors
                  </label>
                  <motion.input
                    type='text'
                    placeholder='Black, White, Navy'
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className='w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors duration-300 font-light'
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-light tracking-wide text-stone-700 uppercase mb-2'>
                Product Description
              </label>
              <motion.textarea
                placeholder='Describe your product...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className='w-full px-4 py-3 border border-stone-300 focus:border-stone-500 focus:outline-none transition-colors duration-300 font-light resize-none'
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            {/* Submit Button */}
            <motion.div
              className='pt-6'
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                type='submit'
                disabled={loading || !files.length}
                className={`w-full relative group overflow-hidden py-4 px-6 border font-light tracking-[0.2em] text-sm text-center transition-all duration-500 uppercase ${
                  loading || !files.length
                    ? 'border-stone-300 text-stone-400 cursor-not-allowed'
                    : 'border-stone-900 text-stone-900 hover:text-white'
                }`}
              >
                <motion.div
                  className='absolute inset-0 bg-stone-900'
                  initial={{ scaleX: 0 }}
                  whileHover={!loading && files.length ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.5 }}
                />
                <span className='relative flex items-center justify-center gap-3'>
                  {loading ? (
                    <>
                      <motion.div
                        className='w-4 h-4 border border-current border-t-transparent rounded-full'
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      Uploading Product...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </span>
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Upload
