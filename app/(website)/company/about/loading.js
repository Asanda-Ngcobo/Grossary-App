import Spinner from "@/app/(website)/_components/Spinner"


function Loading() {
    return (
        <div className="grid">
            <Spinner/>
            <p>Loading...</p>
        </div>
        

    )
}

export default Loading
