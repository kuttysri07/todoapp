
import { useState } from "react"
const apiUrl = process.env.REACT_APP_API_URL;

const Inputtodo = () => {
    const[description,setDescription]=useState('')

   async function onSubmitform(e){
        e.preventDefault()
        try {
            const body={description};
            const response=await fetch(`${apiUrl}/todos`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(body)
                }
            )
            console.log(response);
        } catch (err) {
            console.error(err.message)
        }
     window.location="/"
    }

  return (
    <div>
        <h1 className='text-center mt-5'>PERN TODO APP</h1>
        <form className='d-flex' onSubmit={onSubmitform}>
            <input type="text" className='form-control' onChange={e =>{setDescription(e.target.value)}} value={description}/>
            <button className='btn btn-success'   >Add</button>
        </form>
    </div>
  )
}

export default Inputtodo