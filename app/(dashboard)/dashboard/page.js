import { getAlllists } from "@/app/_lib/data-services";
import { List, TrendingDown, TrendingUp } from "@deemlol/next-icons";

function isSameMonth(dateString, offset = 0) {
  const date = new Date(dateString);
  const now = new Date();
  const targetMonth = now.getMonth() - offset;
  const targetYear = now.getFullYear();

  const adjustedDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);

  return (
    date.getMonth() === adjustedDate.getMonth() &&
    date.getFullYear() === adjustedDate.getFullYear()
  );
}

async function page() {
  const allLists = await getAlllists();

  const currentMonthLists = allLists.filter(
    (list) => list.created_at && isSameMonth(list.created_at, 0)
  );

  const lastMonthLists = allLists.filter(
    (list) => list.created_at && isSameMonth(list.created_at, 1)
  );

  const thisMonthCount = currentMonthLists.length;
  const lastMonthCount = lastMonthLists.length;

  let percentageChange = 0;
  let changeText = "No change";

  if (lastMonthCount === 0 && thisMonthCount > 0) {
    changeText = "📈 100% increase from last month";
  } else if (lastMonthCount > 0) {
    const change = ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
    percentageChange = Math.abs(change.toFixed(1));
    changeText =
      change > 0
        ? ` ${percentageChange}% more than last month`
        : ` ${percentageChange}% less than last month`;
  }

  return (
    <div className="mt-20 ml-[10%] w-[80%]">
      <ul className="flex gap-4">
        <li className="w-1/4 bg-[#04284B] h-[300px] rounded-lg text-white flex justify-center gap-4 items-center">
          <div className="w-[50px] h-[50px] rounded-full bg-[#041527] flex justify-center items-center">
            <List />
          </div>
          <div className="grid justify-center items-center">
            <span>All Lists</span>
            <span className="font-extrabold text-5xl">
              {allLists.length}
            </span>
           
          </div>
        </li>

          <li className="w-1/4 bg-[#04284B] h-[300px] rounded-lg text-white flex justify-center gap-4 items-center">
          <div className="w-[50px] h-[50px] rounded-full bg-[#041527] flex justify-center items-center">
            {thisMonthCount > lastMonthCount ? <TrendingUp color="green"/> : <TrendingDown color="red"/>}
          </div>
          <div className="grid justify-center items-center">
            <span>New This Month</span>
            <span className="font-extrabold text-5xl">
               {thisMonthCount} 
            </span>
            <span></span>
            <span className="font-bold text-sm">
            {changeText}
            </span>
           
          </div>
        </li>
        
      </ul>

     
    </div>
  );
}

export default page;
