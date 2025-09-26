import React from 'react';

interface ModelSelectorProps {
  selectedModel: 'AM Base' | 'AM Start' | 'AM Pro';
  onModelChange: (model: 'AM Base' | 'AM Start' | 'AM Pro') => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange
}) => {
  const models = [
    { name: 'AM Base', description: '', color: 'from-green-500 to-emerald-600' },
    { name: 'AM Start', description: '', color: 'from-blue-500 to-indigo-600' },
    { name: 'AM Pro', description: '', color: 'from-purple-500 to-violet-600' }
  ] as const;

  return (
    <div className="flex gap-2 mb-4">
      {models.map((model) => (
        <button
          key={model.name}
          onClick={() => onModelChange(model.name)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedModel === model.name
              ? `bg-gradient-to-r ${model.color} text-white shadow-lg scale-105`
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <div className="text-xs opacity-90">{model.description}</div>
          <div>{model.name}</div>
        </button>
      ))}
    </div>
  );
};