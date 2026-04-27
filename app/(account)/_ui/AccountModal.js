function AccountModal({children}) {
    return (
         <div className=" backdrop-blur-sm z-40  top-0 w-full h-[150vh] absolute left-0"
         >
            {children}
        </div>
    )
}

export default AccountModal
