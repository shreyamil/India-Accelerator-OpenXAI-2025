'use client'
import './globals.css';
import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }), // send only current message
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.message }

      // replace pulsing dots with actual assistant message
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error processing your message.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

return (
  <main className="relative min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 overflow-hidden flex items-center justify-center">
  {/* Floating background clouds */}
  <div className="absolute inset-0 -z-10">
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute w-24 h-24 bg-white/10 rounded-full blur-3xl animate-cloud"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${25 + Math.random() * 20}s`,
        }}
      />
    ))}
  </div>

  <div className="flex flex-col lg:flex-row items-start gap-8 w-full max-w-6xl px-4">
    {/* Chat Section */}
    <div className="flex-[2] bg-black/30 backdrop-blur-xl rounded-3xl p-8 flex flex-col shadow-2xl border border-purple-500/40 overflow-hidden max-h-[85vh]">
      {/* Chat Header */}
      <div className="text-center text-white mb-6">
        <h1 className="text-5xl font-extrabold mb-2 drop-shadow-2xl animate-fadeIn">☁️ CloudChat Cozy</h1>
        <p className="text-lg italic text-purple-200 animate-fadeIn delay-200">
          Let your thoughts float like clouds ☁️✨
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <Bot size={48} className="mx-auto mb-4 text-pink-400 drop-shadow-2xl animate-pulse" />
            <p className="text-lg text-purple-200 animate-fadeIn">
              Type a message and watch it drift away ☁️🌟
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-cloudMessage`}
            >
              {message.role === 'assistant' && (
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-lg animate-cloudPulse border border-pink-400/50">
                  <Bot size={20} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-3xl px-6 py-4 rounded-3xl shadow-lg transition-transform transform hover:scale-105 border border-purple-400/50 backdrop-blur-sm ${
                  message.role === 'user'
                    ? 'bg-purple-500/80 text-white shadow-pink-500/50'
                    : 'bg-pink-600/80 text-white shadow-purple-500/50'
                }`}
                style={{ boxShadow: '0 0 25px 6px rgba(255,182,193,0.4)' }}
              >
                <p className="whitespace-pre-wrap text-base lg:text-lg">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-cloudPulse border border-purple-400/50">
                  <User size={20} className="text-white" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start space-x-3 animate-cloudMessage">
            <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center shadow-lg animate-cloudPulse border border-pink-400/50">
              <Bot size={20} className="text-white" />
            </div>
            <div className="bg-purple-600/80 text-white px-6 py-4 rounded-3xl shadow-lg border border-purple-400/50">
              <div className="flex space-x-2">
                <div className="w-3.5 h-3.5 bg-white rounded-full animate-bounce"></div>
                <div className="w-3.5 h-3.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3.5 h-3.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1 bg-black/50 text-white placeholder-white/70 px-6 py-4 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/70 transition-all shadow-lg backdrop-blur-md animate-cloudInput text-lg"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-500 text-white px-7 py-4 rounded-3xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-3 shadow-2xl text-lg"
        >
          <Send size={22} />
          <span>Send</span>
        </button>
      </div>
    </div>

    {/* Common Questions Panel */}
    <div className="hidden lg:flex flex-col gap-6 w-64">
      {['Hello! 🌸', 'How are you? ☁️', 'Tell me a joke 😄', 'Give me a tip 💡'].map((q, i) => (
        <div
          key={i}
          className="bg-white/20 backdrop-blur-lg rounded-3xl px-4 py-3 text-purple-900 font-semibold cursor-pointer shadow-lg hover:scale-105 hover:shadow-pink-400/50 transition-all animate-cloudMessage"
          onClick={() => setInput(q)}
        >
          {q}
        </div>
      ))}
    </div>
  </div>

  {/* Animations */}
  <style jsx>{`
    @keyframes cloud {
      0% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
      50% { transform: translateY(-20px) translateX(10px); opacity: 0.9; }
      100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
    }
    .animate-cloud { animation: cloud linear infinite; }

    @keyframes cloudMessage {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0px); }
    }
    .animate-cloudMessage { animation: cloudMessage 0.6s ease forwards; }

    @keyframes cloudPulse {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }
    .animate-cloudPulse { animation: cloudPulse 2s ease-in-out infinite; }

    @keyframes cloudInput {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-2px); }
    }
    .animate-cloudInput { animation: cloudInput 3s ease-in-out infinite; }

    @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
    .animate-fadeIn { animation: fadeIn 1s ease forwards; }
  `}</style>
</main>

)

}
