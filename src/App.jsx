import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.css'

function App() {
  const [threshold, setThreshold] = useState(0.5)
  const [image, setImage] = useState(null)
  const [template, setTemplate] = useState(null)

  const methods = [
    'TM_CCORR',
    'TM_CCORR_NORMED',
    'TM_CCOEFF',
    'TM_CCOEFF_NORMED',
    'TM_SODIM',
    'TM_SODIM_NORMED',
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
    if (image && template) {
      const data = new FormData();
      data.append('image', image);
      data.append('template', template);
      fetch("http://localhost:5000/api/tm", {
        method: 'POST',
        // headers: {
        //   'Accept': 'application/json',
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        body: data
      }).then((response) => {
        return response.text();
      }).then((data) => {
        console.log(data)
      })
    }
  }, [image, template])

  return (
    <div className="container mx-auto py-5">
      <h1 className='text-center font-bold text-3xl'>Template Matching Simulator</h1>
      <div className="flex flex-row items-start mt-5 justify-between">
        <div>
          <h2 className='font-bold text-xl'>Image</h2>
          {/* <img src="/image.png" alt="" className='w-[350px] mt-3'/> */}
          {image && (
            <img src={URL.createObjectURL(image)} alt="not found" className='w-[350px] mt-3' />
          )}
          <input type="file" name="image" id="image" className='mt-3' onChange={imageChange} />
        </div>
        <div>
          <h2 className='font-bold text-xl'>Template</h2>
          {template && (
            <img src={URL.createObjectURL(template)} alt="not found" className='w-[50px] mt-3' />
          )}
          <input type="file" name="image" id="image" className='mt-3' onChange={templateChange} />
        </div>
        <div>
          <div>
            <h2 className='font-bold text-xl'>Threshold</h2>
            <input type="range" min="0" max="1" step="0.1" value={threshold} onChange={threshChange} className='mt-3' />
            <p>{threshold}</p>
          </div>
          <div className='mt-5'>
            <h2 className='font-bold text-xl'>Method</h2>
            <select name="method" id="method">
              {methods.map((method, index) => (
                <option key={index}>{method}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className='mt-5 flex flex-col items-center'>
        <h2 className='font-bold text-xl text-center'>Result</h2>
        <img src="/image.png" alt="" className='w-[350px] mt-3' />
      </div>
    </div>
  )
}

export default App
