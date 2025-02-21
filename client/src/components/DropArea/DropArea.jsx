import React, { useState } from 'react'

export default function DropArea({onDrop}) {
  const [showDrop, setShowDrop] = useState(false)
  return (
    <section 
    onDragEnter={() => setShowDrop(true)} 
    onDragLeave={() => setShowDrop(false)}
    onDrop={() => {
        onDrop();
        setShowDrop(false)
    }} 
    onDragOver={(e) => e.preventDefault()}
    className={showDrop ? 'w-full h-[100px] border border-[#dcdcdc] p-4 mb-4 opacity-100' : 'opacity-0'}>
        Drop Here
    </section>

  )
}
