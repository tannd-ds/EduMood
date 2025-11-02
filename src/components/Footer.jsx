import { FaHeart, FaGraduationCap, FaUser, FaEnvelope } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary-700 to-purple-700 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <FaGraduationCap className="text-3xl" />
              <h3 className="text-2xl font-bold">EduMood</h3>
            </div>
            <p className="text-white/90">
              Thầy cô ảo của cảm xúc - Đồng hành cùng học sinh trên hành trình học tập và phát triển.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FaUser className="text-sm" />
                <span className="text-white/90">Giới thiệu: <span className="font-semibold">Locht - Tandn</span></span>
              </li>
              <li className="flex items-center space-x-2">
                <FaUser className="text-sm" />
                <span className="text-white/90">Đội ngũ: <span className="font-semibold">Locht - Tandn</span></span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-sm" />
                <span className="text-white/90">Liên hệ: </span>
                <a 
                  href="mailto:tanlochuynh112@gmail.com" 
                  className="text-white/90 hover:text-white underline transition"
                >
                  tanlochuynh112@gmail.com
                </a>
              </li>
              <li><a href="#" className="text-white/90 hover:text-white transition">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/90 hover:text-white transition">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition">Góp ý & Phản hồi</a></li>
              <li><a href="#" className="text-white/90 hover:text-white transition">Trợ giúp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/90 flex items-center justify-center space-x-2">
            <span>Made with</span>
            <FaHeart className="text-red-400" />
            <span>for students by EduMood Team</span>
          </p>
          <p className="text-white/70 mt-2">
            © 2024 EduMood. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
