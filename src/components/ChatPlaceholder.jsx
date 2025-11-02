import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaArrowDown,
  FaComments,
  FaExclamationTriangle,
  FaPaperPlane,
  FaRobot,
  FaExpand,
  FaCompress,
} from 'react-icons/fa'
import { NewGeminiService } from '../services/geminiService'
import { useAuth } from '../context/AuthContext'
import React from 'react'
import MarkdownMessage from './MarkdownMessage'

const EMOTION_GUIDANCE = {
  angry: {
    label: 'tức giận',
    intro:
      'Những cảm xúc mạnh mẽ đôi khi rất khó diễn đạt. Mình đang lắng nghe đây.',
  },
  sad: {
    label: 'buồn',
    intro:
      'Mình hiểu cảm giác này có thể rất nặng nề. Bạn có muốn tâm sự thêm với mình không?',
  },
  tired: {
    label: 'mệt mỏi',
    intro:
      'Mệt mỏi là tín hiệu cơ thể cần được chăm sóc. Bạn muốn kể cho mình nghe điều gì làm bạn kiệt sức không?',
  },
  anxious: {
    label: 'lo lắng',
    intro:
      'Lo lắng có thể khiến mọi thứ trở nên mơ hồ. Hãy nói với mình điều khiến bạn băn khoăn nhất nhé.',
  },
  happy: {
    label: 'vui vẻ',
    intro:
      'Nghe thật tuyệt! Hãy kể cho mình nghe điều gì đang khiến bạn hạnh phúc nhé.',
  },
  calm: {
    label: 'bình yên',
    intro:
      'Thật dễ chịu khi được nghe điều này. Bạn muốn chia sẻ thêm về cảm giác bình yên đó chứ?',
  },
}

const BASE_WELCOME = 'Xin chào! Mình là EduMood, người bạn AI luôn sẵn sàng lắng nghe bạn bất cứ lúc nào.'

function ChatPlaceholder({ selectedEmotion }) {
  const { user } = useAuth()
  const geminiServiceRef = useRef(null)
  if (!geminiServiceRef.current) {
    geminiServiceRef.current = new NewGeminiService()
  }
  const geminiService = geminiServiceRef.current
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'model', text: BASE_WELCOME },
  ])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const messagesContainerRef = useRef(null)
  const chatBoxRef = useRef(null)
  const hasAutoScrolledRef = useRef(false)
  const previousEmotionRef = useRef(null)

  // Helper function to get storage key for chat
  const getChatStorageKey = () => {
    if (!user || !selectedEmotion) return null
    return `edumood_chat_${user.id}_${selectedEmotion}`
  }

  // Load chat history from localStorage when user is logged in
  const loadChatHistory = () => {
    if (!user || !selectedEmotion) return false

    const storageKey = getChatStorageKey()
    if (!storageKey) return false

    try {
      const savedChat = localStorage.getItem(storageKey)
      if (savedChat) {
        const parsedMessages = JSON.parse(savedChat)
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages)
          return true
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
    return false
  }

  // Save chat history to localStorage when user is logged in
  const saveChatHistory = (messagesToSave) => {
    if (!user || !selectedEmotion) return

    const storageKey = getChatStorageKey()
    if (!storageKey) return

    try {
      // Don't save welcome messages only
      const meaningfulMessages = messagesToSave.filter(
        (msg) => msg.id !== 'welcome' && !msg.id.startsWith('intro-')
      )
      
      if (meaningfulMessages.length > 0) {
        // Include intro message if exists
        const introMessage = messagesToSave.find((msg) => msg.id.startsWith('intro-'))
        const messagesWithIntro = introMessage 
          ? [introMessage, ...meaningfulMessages]
          : meaningfulMessages
        localStorage.setItem(storageKey, JSON.stringify(messagesWithIntro))
      }
    } catch (error) {
      console.error('Error saving chat history:', error)
    }
  }

  const emotionIntro = useMemo(() => {
    if (!selectedEmotion) return null
    const config = EMOTION_GUIDANCE[selectedEmotion]
    if (!config) {
      return '\n\nMình rất muốn hiểu thêm cảm xúc của bạn. Hãy cứ chia sẻ theo cách bạn thấy thoải mái nhất nhé.'
    }
    return `\n\nMình cảm nhận được bạn đang ${config.label}. ${config.intro}`
  }, [selectedEmotion])

  // Load chat history when user logs in or when emotion changes
  useEffect(() => {
    if (!selectedEmotion) {
      // Save current chat before resetting if user is logged in
      if (user && previousEmotionRef.current) {
        const previousStorageKey = `edumood_chat_${user.id}_${previousEmotionRef.current}`
        try {
          const currentMessages = messages.filter(
            (msg) => msg.id !== 'welcome' && !msg.id.startsWith('intro-')
          )
          if (currentMessages.length > 0) {
            localStorage.setItem(previousStorageKey, JSON.stringify(messages))
          }
        } catch (error) {
          console.error('Error saving chat before emotion change:', error)
        }
      }

      setMessages([{ id: 'welcome', role: 'model', text: BASE_WELCOME }])
      setDraft('')
      setError(null)
      previousEmotionRef.current = null
      return
    }

    // If emotion changed and user is logged in, try to load saved history
    const hasHistory = user && previousEmotionRef.current !== selectedEmotion ? loadChatHistory() : false

    // If no saved history or user not logged in, set intro message
    if (!hasHistory && (!user || !localStorage.getItem(getChatStorageKey()))) {
      setMessages([
        {
          id: `intro-${selectedEmotion}`,
          role: 'model',
          text: `${BASE_WELCOME} ${emotionIntro}`,
        },
      ])
    }

    setDraft('')
    setError(null)
    previousEmotionRef.current = selectedEmotion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emotionIntro, selectedEmotion, user])

  // Load chat history when user logs in and emotion is already selected
  useEffect(() => {
    if (user && selectedEmotion) {
      // Check if this emotion was already initialized
      const isCurrentEmotion = previousEmotionRef.current === selectedEmotion
      const hasHistory = loadChatHistory()
      
      // If no history found and emotion was already set, show intro message
      // (Don't override if emotion just changed - that's handled in the other useEffect)
      if (!hasHistory && isCurrentEmotion && messages.length === 1 && messages[0].id === 'welcome') {
        setMessages([
          {
            id: `intro-${selectedEmotion}`,
            role: 'model',
            text: `${BASE_WELCOME} ${emotionIntro}`,
          },
        ])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    const behavior = hasAutoScrolledRef.current ? 'smooth' : 'auto'
    hasAutoScrolledRef.current = true

    const container = messagesContainerRef.current
    if (container) {
      const scrollOptions = { top: container.scrollHeight, behavior }
      if (typeof container.scrollTo === 'function') {
        container.scrollTo(scrollOptions)
      } else {
        container.scrollTop = container.scrollHeight
      }
    }
    const chatBox = chatBoxRef.current
    if (chatBox && typeof chatBox.scrollIntoView === 'function') {
      requestAnimationFrame(() => chatBox.scrollIntoView({ behavior, block: 'end' }))
    }
  }, [messages])

  // Save chat history whenever messages change (only if user is logged in)
  useEffect(() => {
    if (user && selectedEmotion && messages.length > 0) {
      saveChatHistory(messages)
    }
  }, [messages, user, selectedEmotion])

  const handleSend = async (event) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return

    if (!selectedEmotion) {
      setError('Bạn hãy chọn cảm xúc hiện tại của mình trước khi bắt đầu nhé!')
      return
    }

    const emotionLabel = EMOTION_GUIDANCE[selectedEmotion]?.label || selectedEmotion

    const historyPayload = [
      {
        role: 'user',
        parts: [
          {
            text: `Bối cảnh: Người đối thoại đang cảm thấy ${emotionLabel}. Hãy phản hồi hoàn toàn bằng tiếng Việt với sự đồng cảm và hỗ trợ tinh thần cho học sinh Việt Nam.`,
          },
        ],
      },
      ...messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
    ]

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsLoading(true)
    setError(null)

    // Create a placeholder message for streaming
    const streamingMessageId = `model-${Date.now()}`
    const streamingMessage = {
      id: streamingMessageId,
      role: 'model',
      text: '',
      isStreaming: true,
    }
    setMessages((prev) => [...prev, streamingMessage])

    try {
      const stream = geminiService.chatStream(historyPayload, trimmed)
      let fullText = ''

      for await (const chunk of stream) {
        fullText += chunk
        // Update the streaming message with accumulated text
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessageId
              ? { ...msg, text: fullText }
              : msg
          )
        )
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      )

      // If no content was received, show fallback
      if (!fullText.trim()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingMessageId
              ? {
                  ...msg,
                  text: 'Xin lỗi nhé, mình đang hơi bối rối. Bạn có thể chia sẻ lại cho mình được không?',
                  isStreaming: false,
                }
              : msg
          )
        )
      }
    } catch (err) {
      console.error('Gemini chat error:', err)
      setError('Ôi! Mình gặp chút trục trặc kết nối. Bạn thử lại sau vài giây nhé.')
      
      // Update the streaming message with error text
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingMessageId
            ? {
                ...msg,
                text: 'Xin lỗi bạn nhé, hiện tại mình chưa thể phản hồi được. Chúng ta thử lại sau chút xíu nhé?',
                isStreaming: false,
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const isReadyToChat = Boolean(selectedEmotion)
  const canSend = isReadyToChat && draft.trim().length > 0 && !isLoading

  return (
    <section className={`${isMaximized ? 'fixed inset-0 z-50 bg-white' : 'container mx-auto px-4 py-12'}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={isMaximized ? 'h-full overflow-y-auto' : 'max-w-4xl mx-auto'}
      >
        <div className={`glass-effect ${isMaximized ? 'rounded-none h-full p-4 md:p-8' : 'rounded-3xl p-8'} shadow-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-center flex-1">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                💬
              </motion.div>
            </div>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={isMaximized ? 'Thu nhỏ' : 'Phóng to'}
              title={isMaximized ? 'Thu nhỏ' : 'Phóng to'}
            >
              {isMaximized ? (
                <FaCompress className="text-2xl text-gray-700" />
              ) : (
                <FaExpand className="text-2xl text-gray-700" />
              )}
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              <FaComments className="inline-block mr-2 text-primary-500" />
              Khu vực Chat với AI
            </h2>
            <p className="text-gray-600 text-lg">
              Chia sẻ cảm xúc của bạn với EduMood để được lắng nghe và đồng hành
            </p>
          </div>

          {!isReadyToChat && (
            <div className="bg-gray-100 rounded-2xl p-6 mb-6 text-center">
              <p className="text-gray-500">
                👆 Hãy chọn cảm xúc của bạn ở trên để mình có thể trò chuyện sâu hơn nhé!
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                <FaRobot className="text-white text-2xl" />
              </div>
            </div>

            <div
              ref={messagesContainerRef}
              className={`bg-white rounded-2xl border border-gray-100 shadow-inner p-4 overflow-y-auto space-y-4 ${
                isMaximized ? 'h-[calc(100vh-450px)] min-h-[500px]' : 'h-80'
              }`}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'model' && (
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <FaRobot className={message.isStreaming ? 'animate-pulse' : ''} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {message.role === 'user' ? (
                      // User messages: plain text with line breaks
                      message.text.split('\n').map((part, index) => (
                        <React.Fragment key={index}>
                          {part}
                          {index < message.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))
                    ) : (
                      // Model messages: render with markdown
                      <MarkdownMessage content={message.text} />
                    )}
                    {message.isStreaming && (
                      <span className="inline-block ml-1 w-2 h-4 bg-primary-500 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
              </div>

            <form ref={chatBoxRef} onSubmit={handleSend} className="mt-6 space-y-3">
              <label htmlFor="chat-input" className="block text-sm font-medium text-gray-600">
                Viết chia sẻ của bạn ở đây
              </label>
              <textarea
                id="chat-input"
                className="w-full min-h-[120px] rounded-2xl border border-gray-200 bg-white p-4 text-sm md:text-base shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition"
                placeholder={
                  isReadyToChat
                    ? 'Ví dụ: Hôm nay mình cảm thấy áp lực vì bài kiểm tra...'
                    : 'Trước tiên hãy chọn cảm xúc của bạn nhé!'
                }
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={!isReadyToChat || isLoading}
              />

              <div className="flex items-center justify-between">
                {error && (
                  <div className="flex items-center text-sm text-red-600">
                    <FaExclamationTriangle className="mr-2" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSend}
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition focus:outline-none focus:ring-4 focus:ring-primary-200 ${
                    canSend
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FaPaperPlane className={isLoading ? 'animate-pulse' : ''} />
                  {isLoading ? 'Đang gửi...' : 'Gửi lời chia sẻ'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-2 justify-center">
              <span className="font-medium">💡 Gợi ý:</span>
              <span>"Hôm nay mình cảm thấy..."</span>
              <span>"Điều khiến mình bận tâm là..."</span>
              <span>"Mình mong muốn..."</span>
            </div>
          </div>
        </div>

        {!isMaximized && (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-center mt-8"
          >
            <FaArrowDown className="text-4xl text-gray-400 mx-auto" />
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default ChatPlaceholder
