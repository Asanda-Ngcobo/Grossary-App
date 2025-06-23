'use client'
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
//finished shopping messages
const completionMessages = [
  "Awu shem! 🛒 You’ve cleaned up like it’s Black Friday at Makro — go pay now!",
  "Yoh, you *mos* nailed that list! Now go swipe at the till like a baller. 💳",
  "Eish! Not even a single item left? Now that’s how you shop, my bru. Off to the till!",
  "Done and dusted, wena! The till is calling like gqom at a groove. 🔥",
  "Hai suka! Your cart’s looking lekker full — now go flex at the till, sharp sharp.",
  "Boom! 🛒 All done — time to strut to the till like a shopping champ!",
  "You did it! 🎉 Every item’s in the bag — now go conquer that till",
  "All items shopped, cart looking fine — go dazzle that cashier! 💃",
  "Shopping complete! 🏁 Now go flex at the till like a boss.",
  "Just like that, your are done 😎 Off to the till you go!"
];

const getRandomCompletionMessage = () => {
  const index = Math.floor(Math.random() * completionMessages.length);
  return completionMessages[index];
};

const budgetWinMessages = [
  "Yhuuu! You still have change? Budget boss vibes! 💸🧠",
  "Ngiyak’bonga, Finance Minister! You just shopped smart and saved hard. 🔥",

  "Aweh! You shopped like a pro and still kept your wallet fat. Respect! 🙌",
  "Lalela, even your ancestors are proud of that budgeting skill. 👏🏽",
  "Sho! That’s how you stretch a rand like chakalaka on pap! 🍲💰",
  "Budget? Completed it, chief. Now go spoil yourself with that leftover cash. 😏",
  "You didn’t just shop — you *finessed* the budget. Love to see it! 🧾🔥",
  "Under budget and overachieving — that’s the soft life, mos! 🛍️💅🏽",
  "Ke star, you! Rands still dancing in your account like it's December. 💃🏽🕺🏾",
  "Bosso ke mang? wena!.. ke mang? wena! 🕺🏾"
];

const getRandomBudgetMessage = () => {
  const index = Math.floor(Math.random() * budgetWinMessages.length);
  return budgetWinMessages[index];
};

const overBudgetMessages = [
  "Hhaybo! You spent like it's Black Friday in January 😭🛒",
  "Even your wallet just sighed. Budget? Never met her. 😩💸",
  "Sho! You swiped that card like you had sponsors. NSFAS is watching. 👀",
  "You're not shopping, you're living soft! Budget said ‘stop’, but you said ‘one more’. 💅🏽",
  "That budget is shaking in the corner. You did it dirty! 😬",
  "You went over budget like a gqom beat at groove — no breaks. 🔊💳",
  "Tjo! You shopped like you had a sugar daddy. Respect... I guess? 😏",
  "We said budget. You said *YOLO*. 🙃",
  "Your basket was full, your heart was full, and now your bank account is empty. 🥲",
  "At this rate, even Pick n Pay is worried about your finances. 🧾😮‍💨"
];

const getRandomOverBudgetMessage = () => {
  const index = Math.floor(Math.random() * overBudgetMessages.length);
  return overBudgetMessages[index];
};
function ShoppingDoneBunner() {
    return (
        <div className="w-[90%] h-[60vh] mx-[5%] fixed mt-[10%] z-50 text-[#04284B]">

          {/* {moneyLeft > 0 ? <getRandomBudgetMessage/> : <getRandomOverBudgetMessage/>} */}

            
        </div>
    )
}

export default ShoppingDoneBunner
