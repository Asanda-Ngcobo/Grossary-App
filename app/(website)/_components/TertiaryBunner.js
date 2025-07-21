function TertiaryBunner({children}) {
    return (
        <div className="w-[200px] md:w-[300px] h-[150px] md:h-[220px] rounded-xl  bg-[#041527] 
        flex justify-between
        shadow-2xl shadow-gray-500 ">
            {children}
        </div>
    )
}

export default TertiaryBunner
