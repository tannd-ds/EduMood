import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaArrowDown,
  FaComments,
  FaExclamationTriangle,
  FaPaperPlane,
  FaRobot,
} from 'react-icons/fa'
import { NewGeminiService } from '../services/geminiService'
import React from 'react'

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
  const messagesContainerRef = useRef(null)
  const chatBoxRef = useRef(null)
  const hasAutoScrolledRef = useRef(false)

  const emotionIntro = useMemo(() => {
    if (!selectedEmotion) return null
    const config = EMOTION_GUIDANCE[selectedEmotion]
    if (!config) {
      return '\n\nMình rất muốn hiểu thêm cảm xúc của bạn. Hãy cứ chia sẻ theo cách bạn thấy thoải mái nhất nhé.'
    }
    return `\n\nMình cảm nhận được bạn đang ${config.label}. ${config.intro}`
  }, [selectedEmotion])

  useEffect(() => {
    if (!selectedEmotion) {
      setMessages([{ id: 'welcome', role: 'model', text: BASE_WELCOME }])
      setDraft('')
      setError(null)
      return
    }

    setMessages([
      {
        id: `intro-${selectedEmotion}`,
        role: 'model',
        text: `${BASE_WELCOME} ${emotionIntro}`,
      },
    ])
    setDraft('')
    setError(null)
  }, [emotionIntro, selectedEmotion])

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

    try {
      const responseText = await geminiService.chat(historyPayload, trimmed)
      const finalText = responseText?.trim()
        ? responseText.trim()
        : 'Xin lỗi nhé, mình đang hơi bối rối. Bạn có thể chia sẻ lại cho mình được không?'

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: finalText,
        },
      ])
    } catch (err) {
      console.error('Gemini chat error:', err)
      setError('Ôi! Mình gặp chút trục trặc kết nối. Bạn thử lại sau vài giây nhé.')
      setMessages((prev) => [
        ...prev,
        {
          id: `model-error-${Date.now()}`,
          role: 'model',
          text: 'Xin lỗi bạn nhé, hiện tại mình chưa thể phản hồi được. Chúng ta thử lại sau chút xíu nhé?',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const isReadyToChat = Boolean(selectedEmotion)
  const canSend = isReadyToChat && draft.trim().length > 0 && !isLoading

  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              💬
            </motion.div>
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
              className="bg-white rounded-2xl border border-gray-100 shadow-inner p-4 h-80 overflow-y-auto space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'model' && (
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3">
                      <FaRobot />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {/* There will be \n\n in the text, turn it into <br /> */}
                    {message.text.split('\n').map((part, index) => (
                      <React.Fragment key={index}>
                        {part}
                        {index < message.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
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

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-center mt-8"
        >
          <FaArrowDown className="text-4xl text-gray-400 mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default ChatPlaceholder
