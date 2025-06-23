'use client';

function HandleCategories({ allItems, selectedCategory, setSelectedCategory }) {
  // Extract unique categories
  const categoryNames = [...new Set(allItems.map(item => item.item_category))];

  // Reorder to move selected category to the top
  const sortedCategories = selectedCategory
    ? [selectedCategory, ...categoryNames.filter(c => c !== selectedCategory)]
    : categoryNames;

  // Calculate items left for each category
  const categoryStatusMap = sortedCategories.reduce((acc, category) => {
    const itemsInCategory = allItems.filter(item => item.item_category === category);
    const shopped = itemsInCategory.filter(item => item.is_checked).length;
    const total = itemsInCategory.length;
    const left = total - shopped;
    acc[category] = { total, shopped, left };
    return acc;
  }, {});

  return (
    <select
      name="categories"
      className={`rounded px-2 py-1 bg-[#04284B] w-[200px]` }
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
    >
      {sortedCategories.map(category => (
        <option key={category} value={category}
         className={categoryStatusMap[category]?.left > 0 ? 'text-[#F38A8C] text-sm ': 'text-white'}>
            {categoryStatusMap[category]?.left > 0
            ? `(${categoryStatusMap[category].left} left) `
            : '(All Shopped)'}
          {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}{' '}
          
        </option>
      ))}
    </select>
  );
}

export default HandleCategories;