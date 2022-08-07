import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.css'

function App() {
  const [threshold, setThreshold] = useState(0.5)
  const threshChange = (e) => {
    setThreshold(e.target.value)
  }
  const methods = [
    'TM_CCORR',
    'TM_CCORR_NORMED',
    'TM_CCOEFF',
    'TM_CCOEFF_NORMED',
    'TM_SODIM',
    'TM_SODIM_NORMED',
  ]

  return (
    <div className="container mx-auto py-5">
      <h1 className='text-center font-bold text-3xl'>Template Matching Simulator</h1>
      <div className="flex flex-row items-start mt-5 justify-between">
        <div>
          <h2 className='font-bold text-xl'>Image</h2>
          <img src="/image.png" alt="" className='w-[350px] mt-3'/>
          <input type="file" name="image" id="image" className='mt-3'/>
        </div>
        <div>
          <h2 className='font-bold text-xl'>Image</h2>
          <img src="/template.png" alt="" className='w-[50px] mt-3'/>
          <input type="file" name="image" id="image" className='mt-3'/>
        </div>
        <div>
          <div>
            <h2 className='font-bold text-xl'>Threshold</h2>
            <input type="range" min="0" max="1" step="0.1" value={threshold} onChange={threshChange} className='mt-3'/>
            <p>{threshold}</p>
          </div>
          <div className='mt-5'>
            <h2 className='font-bold text-xl'>Method</h2>
            <select name="method" id="method">
              {methods.map(method => (
                <option>{method}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className='mt-5 flex flex-col items-center'>
        <h2 className='font-bold text-xl text-center'>Result</h2>
        <img src="/image.png" alt="" className='w-[350px] mt-3'/>
      </div>
    </div>
  )
}

export default App
