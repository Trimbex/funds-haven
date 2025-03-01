import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import * as card from "react-payment-logos/dist/flat"; 

export const cardOptions = [
  { name: "Visa", icon: <card.Visa style={{ width: 30 }} /> },
  { name: "MasterCard", icon: <card.Mastercard style={{ width: 30 }} /> },
  { name: "American Express", icon: <card.Amex style={{ width: 30 }} /> },
  { name: "Paypal", icon: <card.Paypal style={{ width: 30 }} /> },
  { name: "Other", icon: <card.Generic style={{ width: 50 }} /> },
];

const renderCard = (company: string)  =>{
  switch (company) {
    case "Visa":
      return <card.Visa  />;
    case "MasterCard":
      return <card.Mastercard  />;
    case "American Express":
      return <card.Amex  />;
    case "Paypal":
      return <card.Paypal  />;
    default:
      return <card.Generic  />;
  }
}

interface CardDropdownProps {
  initialValue: string;
  onSelect: (cardName: string) => void;
}

const CardDropdown = ({ initialValue = "Other", onSelect }: CardDropdownProps) => {
  const initialCard = cardOptions.find(card => card.name === initialValue) || cardOptions[4];
  // 
  
  const [selectedCard, setSelectedCard] = useState(initialCard);
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle card selection and notify parent component
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    if (onSelect) {
      onSelect(card.name);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-2 bg-gray-100 border rounded-lg shadow-sm hover:bg-gray-200 transition"
      >
        <div className="flex items-center gap-2">
          {selectedCard.icon}
          <span>{selectedCard.name}</span>
        </div>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="absolute left-0 w-full mt-2 bg-white border rounded-lg shadow-lg overflow-hidden z-10"
        >
          {cardOptions.map((card, index) => (
            <li
              key={index}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleSelectCard(card)}
            >
              {card.icon}
              <span>{card.name}</span>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default CardDropdown;
