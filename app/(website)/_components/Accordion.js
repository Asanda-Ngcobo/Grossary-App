'use client'

import { useState } from 'react';
import AccordionItem from './AccordionItem';

const data = [
  {
    question: 'Create a Retail Profile',
    explanation: 'Add your store name, locations, trading hours, and contact details.',
    id: 1,
  },
  {
    question: 'Sync Your Specials or Product Listings',
    explanation: 'Upload current specials, price ranges, or catalogues via our dashboard (CSV/API available).',
    id: 2,
  },
  {
    question: 'Get Featured in Smart Recommendations',
    explanation: 'Grossary+ users are guided to the most budget-friendly stores near them. If your store matches their criteria, you show up.',
    id: 3,
  },
  {
    question: 'Analyze Foot Traffic & Item Demand',
    explanation: 'Get anonymized insights about what users in your area are adding to their lists, tracking, and buying.',
    id: 4,
  },
];

export default function Accordion() {
  const [curOpen, setCurOpen] = useState(null);

  return (
    <div className="max-w-[90%] lg:max-w-[70%] mx-auto my-24 flex flex-col gap-6">
      {data.map((item, index) => (
        <AccordionItem
          key={item.id}
          index={index}
          question={item.question}
          explanation={item.explanation}
          isOpen={curOpen === index}
          onToggle={() => setCurOpen(curOpen === index ? null : index)}
        />
      ))}
    </div>
  );
}

