import { useState, useEffect } from 'react'
import './App.css'
import abi from './abi.json'
import { ethers } from "ethers"
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([]) 

  const contractAddress = "0x29435702fFaE5465f753748b0d3c639a04068768"

  async function requestAccounts() {
    await window.ethereum.request({ method: "eth_requestAccounts" })
  }

  async function getTasks() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const coreContract = new ethers.Contract(contractAddress, abi, signer)
      
      const taskList = await coreContract.getMyTask()
      setTasks(taskList) 
    }
  }

  async function addTask() {
    if (window.ethereum) {
      await requestAccounts()
    }
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const coreContract = new ethers.Contract(contractAddress, abi, signer)

    const tx = await coreContract.addTask(task, "New Task", false)
    await tx.wait()
    toast.success("Task Added")

    setTask('') 
    getTasks()  
  }

  async function deleteTask(taskId) {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const coreContract = new ethers.Contract(contractAddress, abi, signer)

      const tx = await coreContract.deleteTask(taskId)
      await tx.wait()

      toast.success('Task deleted')
      getTasks() 
    }
  }

  useEffect(() => {
    getTasks() 
  }, [])

  return (
    <>
      <div className='App'>
        <h1>CORE DAPP</h1>
        
        <input type="text"
          placeholder='Enter a task'
          className='input'
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask} className='add'>Add Task</button>

        <h2>My Tasks</h2>
        <ul>
          {tasks.map((t, index) => (
            <li key={index}>
              {t.taskText}
              <button onClick={() => deleteTask(t.id)} className='delete'>Delete</button>
            </li>
          ))}
        </ul>
      <ToastContainer />
      </div>
    </>
  )
}

export default App
