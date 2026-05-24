function AccountModal({children}) {
    return (
         <div className="backdrop-blur-sm fixed
          w-screen h-full z-20  bottom-0 left-0 
          transition-all
           duration-500
           overflow-x-hidden 
            flex justify-center items-center"
         >
            {children}
        </div>
    )
}

export default AccountModal
