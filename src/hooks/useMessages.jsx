import React, { useEffect, useState } from 'react'

export default function useMessages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/messages`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json()
                setMessages(data)
            } catch (error) {
                console.error('Error fetching messages:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMessages()
    }, [])

    return { messages, loading }
}
