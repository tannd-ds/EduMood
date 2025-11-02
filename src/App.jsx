import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import EmotionSelector from './components/EmotionSelector'
import ChatPlaceholder from './components/ChatPlaceholder'
import Features from './components/Features'
import Footer from './components/Footer'

function App() {
  const [selectedEmotion, setSelectedEmotion] = useState(null)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <EmotionSelector 
          selectedEmotion={selectedEmotion}
          setSelectedEmotion={setSelectedEmotion}
        />
        <ChatPlaceholder selectedEmotion={selectedEmotion} />
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default App
