import { sampleQuestions } from '../data/sampleQuestions';

interface SampleQuestionsProps {
  onQuestionSelect: (question: string) => void;
  darkMode?: boolean;
}

export const SampleQuestions = ({ onQuestionSelect, darkMode = false }: SampleQuestionsProps) => {
  const categories = Array.from(new Set(sampleQuestions.map(q => q.category)));

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`text-center mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <h2 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Sample Questions
        </h2>
        <p className="text-sm">
          Choose a sample question below to start the conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => (
          <div key={category} className={`rounded-xl p-4 backdrop-blur-md shadow-lg ${
            darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white/50 border border-gray-200/50'
          }`}>
            <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {category}
            </h3>
            <div className="space-y-2">
              {sampleQuestions
                .filter(q => q.category === category)
                .map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionSelect(question.question)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 text-sm hover:scale-105 hover:shadow-lg transform ${
                      darkMode
                        ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 hover:text-white backdrop-blur-sm'
                        : 'bg-gray-50/70 hover:bg-gray-100 text-gray-700 hover:text-gray-900 backdrop-blur-sm'
                    }`}
                  >
                    <div className="font-medium mb-1">{question.question}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {question.description}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};