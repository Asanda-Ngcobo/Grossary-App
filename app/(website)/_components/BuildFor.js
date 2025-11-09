'use client'

export default function BuildFor({ potentials }) {
  if (!potentials) return <p>No User found</p>; // safeguard

  return (
    <div className="text-white h-[100vh] flex flex-col justify-center items-center">
      <p className="text-2xl font-semibold">{potentials.name}</p>
      {/* <p className="text-gray-400">{userinfo.age} years old</p>
      <div
        className="border-l-4 border-[#A2B06D] pl-4 italic text-gray-300 text-lg mt-2"
      >
        {userinfo.occupation}
      </div> */}
    </div>
  );
}
