import { motion } from 'framer-motion'
import { 
  FaShieldAlt, 
  FaLock, 
  FaHeart, 
  FaClock, 
  FaChartLine, 
  FaGamepad 
} from 'react-icons/fa'

const features = [
  {
    icon: FaShieldAlt,
    title: 'An toàn & Bảo mật',
    description: 'Thông tin của bạn được bảo vệ tuyệt đối và hoàn toàn ẩn danh',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: FaHeart,
    title: 'Luôn lắng nghe',
    description: 'AI đồng hành với bạn 24/7, luôn sẵn sàng lắng nghe mọi tâm sự',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: FaClock,
    title: 'Hỗ trợ 24/7',
    description: 'Có mặt mọi lúc, mọi nơi khi bạn cần tâm sự hoặc cần lời khuyên',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: FaChartLine,
    title: 'Theo dõi cảm xúc',
    description: 'Giúp bạn theo dõi và quản lý cảm xúc hàng ngày của mình',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: FaLock,
    title: 'Riêng tư tuyệt đối',
    description: 'Mọi cuộc trò chuyện đều được mã hóa và không ai biết danh tính của bạn',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: FaGamepad,
    title: 'Trò chơi thư giãn',
    description: 'Tham gia các mini game vui nhộn để giảm căng thẳng sau giờ học',
    color: 'from-yellow-500 to-yellow-600'
  },
]

function Features() {
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
          Tại sao chọn EduMood? 🌟
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Những điều làm nên sự khác biệt của chúng tôi
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-2xl p-6 card-hover"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

export default Features
