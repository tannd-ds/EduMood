import { motion } from 'framer-motion'
import { FaSmile, FaHeart, FaUserFriends } from 'react-icons/fa'

function Hero() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
        >
          Chào mừng bạn đến với EduMood! 👋
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
        >
          Nơi bạn có thể chia sẻ cảm xúc và nhận được sự hỗ trợ tận tình. 
          Chúng tôi luôn sẵn sàng lắng nghe bạn!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
        >
          <div className="glass-effect p-6 rounded-2xl card-hover">
            <div className="text-5xl mb-4 text-center text-happy">
              <FaSmile />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Luôn vui vẻ
            </h3>
            <p className="text-gray-600">
              Học tập trong môi trường tích cực và vui vẻ
            </p>
          </div>

          <div className="glass-effect p-6 rounded-2xl card-hover">
            <div className="text-5xl mb-4 text-center text-primary-500">
              <FaHeart />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Được quan tâm
            </h3>
            <p className="text-gray-600">
              AI lắng nghe và thấu hiểu cảm xúc của bạn
            </p>
          </div>

          <div className="glass-effect p-6 rounded-2xl card-hover">
            <div className="text-5xl mb-4 text-center text-purple-500">
              <FaUserFriends />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Bạn đồng hành
            </h3>
            <p className="text-gray-600">
              Như một người bạn tâm sự đáng tin cậy
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
