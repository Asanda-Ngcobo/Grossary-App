'use client'

import { Quicksand } from "next/font/google";
import Image from "next/image";
const HeaderFont = Quicksand({
  subsets: ["latin"],
  display: 'swap',
});

export default function BuildFor({ userinfo }) {
  if (!userinfo) return <p>No User found</p>; // safeguard

  return (
    <main>
      {/* Header */}
       <h1
              className={`text-[20px] font-bold mb-8 
                text-center text-[#041527] ${HeaderFont.className}`}
            >
              Who Is Grossary Built For?
            </h1>
            {/* Content Main Container */}
       <div className=" h-full lg:flex justify-center items-center gap-5">
      
      <ul className="grid justify-center">
        <li className="bg-[#041527] p-2 my-3 w-[300px] text-xs text-white">Name: <span className="text-[#ACF532]">{userinfo.name}</span></li>
                <li className="bg-[#041527] p-2 my-3 w-[300px] text-xs text-white">Age: <span className="text-[#ACF532]">{userinfo.age}</span></li>
                  <li className="bg-[#041527] p-2 my-3 w-[300px] text-xs text-white">occupation: <span className="text-[#ACF532]">{userinfo.occupation}</span></li>
                    <li className="bg-[#041527] p-2 my-3 w-[300px] text-xs text-white">Monthly Groceries Budget: <span className="text-[#ACF532]">R{userinfo.budget}</span></li>
      </ul>
   <div className="hidden lg:flex">
    <Image src={userinfo.image} alt="picture of potential users"/>
   </div>
      <table className="lg:w-[30%] w-full
       py-4 table-auto border-0 bg-[#04284B]
          text-white">
            <thead>
              <tr>
               <th className={`text-[#ACF532] ${HeaderFont.className}`}>
                  Goals
                </th>

              </tr>
            </thead>
            <tbody className="bg-white text-black
             text-center p-2">
              {userinfo.goals.map(function(goal, index){
                return <tr key={index}>
                  <td className="py-2 text-xs lg:font-bold">{goal}</td>
                </tr>
              })}

            </tbody>
                   <thead>
              <tr>
              
                  <th className={`text-[#ACF532] ${HeaderFont.className}`}>
                  Frustrations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-black
             text-center p-2">
        

                 {userinfo.frustrations.map(function(frustration,index){
                return <tr key={index}>
                  <td className="list-disc py-2 text-xs lg:font-bold">{frustration}</td>
                </tr>
              })}
            </tbody>
              <thead>
              <tr>
              
                 <th className={`text-[#ACF532] ${HeaderFont.className}`}>
                  How Can Grossary Help?
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-black
             text-center p-2">
        

                 {userinfo.grossaryProvides.map(function(useful, index){
                return <tr key={index}>
                  <td className="list-disc py-2 text-xs lg:font-bold">{useful}</td>
                </tr>
              })}
            </tbody>


      </table>
    </div>
    </main>
   
  );
}
