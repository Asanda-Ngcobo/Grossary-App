'use client'
import {useState} from 'react'
import SubmitButton from "./SubmitButton";
import { addCard } from "@/app/_lib/actions";
export default function AddCardClient(){
    const [cards, setCards] = useState([]);
      const [name, setName] = useState("");
      const [cardNumber, setCardNumber] = useState("");

      return (
      <form action={addCard} className="mb-6 space-y-2">
        <input
          name="name"
          placeholder="Store name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          name="card_number"
          placeholder="Card number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <SubmitButton>Add Card</SubmitButton>
      </form>
      )
    
}