import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.css'

function App() {
  const [threshold, setThreshold] = useState(0.5)
  const [image, setImage] = useState(null)
  const [template, setTemplate] = useState(null)
  const [method, setMethod] = useState(1)
  const [type, setType] = useState(0)
  const [result, setResult] = useState(null)
  const [detected, setDetected] = useState(null)

  const methods = [
    'TM_SQDIFF',
    'TM_SQDIFF_NORMED',
    'TM_CCORR',
    'TM_CCORR_NORMED',
    'TM_CCOEFF',
    'TM_CCOEFF_NORMED',
  ]

  const threshChange = (e) => {
    setThreshold(e.target.value)
  }
  const imageChange = (e) => {
    setImage(e.target.files[0])
  }
  const templateChange = (e) => {
    setTemplate(e.target.files[0])
  }
  const methodChange = (e) => {
    setMethod(e.target.value)
  }
  const typeChange = (e) => {
    setType(parseInt(e.target.value))
  }


  const getFileBlob = function (url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function () {
      cb(xhr.response);
    });
    xhr.send();
  };

  const blobToFile = function (blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
  };

  const getFileObject = function (filePathOrUrl, cb) {
    getFileBlob(filePathOrUrl, function (blob) {
      cb(blobToFile(blob, 'image.png'));
    });
  };

  // useEffect(() => {
  //   console.log(image)
  //   // var imageInit = new File('blob:/image.png', 'file')
  //   // console.log(imageInit)
  // }, [image])

  useEffect(() => {
    getFileObject('/image.png', function (fileObject) {
      // console.log(fileObject);
      setImage(new File([fileObject], 'image.png'))
    });
    getFileObject('/template.png', function (fileObject) {
      // console.log(fileObject);
      setTemplate(new File([fileObject], 'template.png'))
    });
  }, [])

  useEffect(() => {
    if (image && template && threshold && method) {
      const data = new FormData();
      data.append('image', image);
      data.append('template', template);
      data.append('threshold', threshold);
      data.append('method', method - 1);
      data.append('type', type)
      fetch("http://localhost:5000/api/tm", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
      }).then((response) => {
        // return response.blob();
        return response.json()
      }).then((data) => {
        // console.log(data)
        // setResult(new File([data], 'image.png'))
        setResult(`data:image/png;base64,${data.img}`)
        setDetected(data.detected)
      })
    }
  }, [image, template, threshold, method, type])

  return (
    <div className="container mx-auto flex flex-col items-center">
      <h1 className='text-center font-bold text-2xl m-9'>Template Matching Simulator</h1>
      <div className="flex flex-row items-stretch justify-between space-x-5 self-stretch">
        <div className='bg-white p-6 rounded-lg w-full'>
          <h2 className='font-bold text-xl'>Image</h2>
          {/* <img src="/image.png" alt="" className='w-[350px] mt-3'/> */}
          {image && (
            <img src={URL.createObjectURL(image)} alt="not found" className='w-[350px] mt-3' />
          )}
          <input type="file" name="image" id="image" className='mt-3' onChange={imageChange} />
        </div>
        <div className='bg-white p-6 rounded-lg w-full'>
          <div>
            <h2 className='font-bold text-xl'>Template</h2>
            {template && (
              <img src={URL.createObjectURL(template)} alt="not found" className='w-[50px] mt-3' />
            )}
            <input type="file" name="image" id="image" className='mt-3' onChange={templateChange} />
          </div>
          <div className='mt-5'>
            <h2 className='font-bold text-xl'>Type</h2>
            <select name="type" id="type" value={type} onChange={typeChange}>
              <option value="0">SINGLE</option>
              <option value="1">MULTIPLE</option>
            </select>
          </div>
          <div className='mt-5'>
            <h2 className='font-bold text-xl'>Method</h2>
            <select name="method" id="method" value={method} onChange={methodChange}>
              {methods.map((method, index) => (
                <option key={index} value={index + 1}>{method}</option>
              ))}
            </select>
          </div>
          {!!type && (
            <div className='mt-5'>
              <h2 className='font-bold text-xl'>Threshold</h2>
              <input type="range" min="0" max="1" step="0.1" value={threshold} onChange={threshChange} className='mt-3' />
              <p>{threshold}</p>
            </div>
          )}
        </div>
        <div className='bg-white p-6 rounded-lg w-full'>
          <h2 className='font-bold text-xl text-center'>Result</h2>
          {/* <img src="/image.png" alt="" className='w-[350px] mt-3' /> */}
          {result && (
            <img src={result} alt="not found" className='w-[350px] mt-3' />
          )}
          {!!detected && (
            <p className='mt-3 font-semibold text-emerald-600'>Detected object: {detected}</p>
          )}
        </div>
      </div>
      <a href="http://github.com" target="_blank" rel="noopener noreferrer" className='border border-black rounded-lg mt-5 p-4 text-lg'><span></span>Repo</a>
    </div>
  )
}

export default App
