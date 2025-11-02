import { motion } from 'framer-motion'
import { FaLaugh, FaSadTear, FaAngry, FaFlushed, FaSmile, FaMeh } from 'react-icons/fa'

const emotions = [
  { id: 'happy', name: 'Vui vẻ', icon: FaLaugh, color: 'bg-yellow-400', emoji: '😊' },
  { id: 'sad', name: 'Buồn', icon: FaSadTear, color: 'bg-blue-400', emoji: '😢' },
  { id: 'angry', name: 'Tức giận', icon: FaAngry, color: 'bg-red-400', emoji: '😠' },
  { id: 'anxious', name: 'Lo lắng', icon: FaFlushed, color: 'bg-purple-400', emoji: '😰' },
  { id: 'calm', name: 'Bình yên', icon: FaSmile, color: 'bg-green-400', emoji: '😌' },
  { id: 'tired', name: 'Mệt mỏi', icon: FaMeh, color: 'bg-gray-400', emoji: '😴' },
]

function EmotionSelector({ selectedEmotion, setSelectedEmotion }) {
  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Hôm nay bạn cảm thấy thế nào? 🤔
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Chọn cảm xúc của bạn để bắt đầu chia sẻ
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {emotions.map((emotion) => (
            <motion.button
              key={emotion.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedEmotion(emotion.id)}
              className={`p-6 rounded-2xl card-hover ${
                selectedEmotion === emotion.id 
                  ? 'ring-4 ring-primary-500 shadow-2xl transform scale-105' 
                  : 'glass-effect'
              }`}
            >
              <div className="text-center">
                <div className={`text-5xl mb-3 ${emotion.color} rounded-full p-4 inline-block`}>
                  {emotion.emoji}
                </div>
                <p className="font-semibold text-gray-800">{emotion.name}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {selectedEmotion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="text-lg text-gray-700">
              Bạn đã chọn cảm xúc: <span className="font-bold text-primary-600">
                {emotions.find(e => e.id === selectedEmotion)?.name}
              </span>
            </p>
            <p className="text-gray-600 mt-2">
              Cuộn xuống để chia sẻ với AI nhé! ↓
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default EmotionSelector
