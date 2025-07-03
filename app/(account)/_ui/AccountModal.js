function AccountModal({children}) {
    return (
         <div className=" backdrop-blur-sm  top-0 w-full h-full absolute left-0"
         >
            {children}
        </div>
    )
}

export default AccountModal
