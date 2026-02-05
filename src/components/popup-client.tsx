'use client'

import dynamic from 'next/dynamic'

const Popup = dynamic(() => import('./popup'), { ssr: false })

export function PopupClient() {
    return <Popup />
}
