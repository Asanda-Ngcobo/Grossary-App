
import DeleteForm from "./DeleteForm"

function DeleteList({listId, onDelete, handleModal, listname}) {
 
    return (
        <div className=" backdrop-blur-sm z-40  top-0 w-full h-full absolute left-0">
            <DeleteForm listId={listId}
            listname={listname}
            onDelete={onDelete}
            handleModal={handleModal}/>
        </div>
    )
}

export default DeleteList
