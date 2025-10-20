import { imageUrlBuilder } from '@/actions/products.action'
import { CartItem as CartItemType } from '@/state/CartContext'

interface CartItemProps {
  item: CartItemType
  updateQty: (id: number, qty: number) => void
  removeItem: (id: number) => void
}

export default function CartItem({
  item,
  updateQty,
  removeItem,
}: CartItemProps) {
  const imageUrl = imageUrlBuilder(item.images[0]?.url) || '/placeholder.png'

  return (
    <div className='bg-white p-4 rounded-xl shadow flex gap-4 items-center'>
      <img
        src={imageUrl}
        alt={item.name}
        className='w-24 h-24 rounded object-cover'
      />
      <div className='flex-1'>
        <div className='font-semibold'>{item.name}</div>
        <div className='text-sm text-gray-500'>
          ₦{item.price.toLocaleString()}
        </div>
        <div className='mt-2 flex items-center gap-2'>
          <input
            type='number'
            min='1'
            value={item.qty}
            onChange={(e) => updateQty(item.id, Number(e.target.value))}
            className='w-16 border rounded px-2 py-1'
          />
          <button
            className='text-red-600 text-sm'
            onClick={() => removeItem(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
