
export default function AccordionItem({ question, explanation, index, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="cursor-pointer border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-xl transition-all"
    >
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-lg font-bold w-10">
          {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </p>
        <p className="flex-1 text-lg font-semibold px-4">{question}</p>
        <span className="text-2xl font-bold">{isOpen ? '−' : '+'}</span>
      </div>

      {isOpen && (
        <div className="mt-4 text-base text-gray-600 font-medium leading-relaxed">
          {explanation}
        </div>
      )}
    </div>
  );
}