import { Chat } from './components/Chat'
import { TestTailwind } from './components/TestTailwind'
import './App.css'

function App() {
  // Uncomment below to test Tailwind
  // return <TestTailwind />
  
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Chat />
    </div>
  )
}

export default App
