import React, { useState } from 'react';


const ImageUplaod = () => {
    const [image, setImage] = useState({preview: '', data: ''});
    const [status, setStatus] = useState(null)
    const [prediction, setPrediction] = useState(null)

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = {
                preview: URL.createObjectURL(event.target.files[0]),
                data: event.target.files[0]
            }
            setImage(img)
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData();
        formData.append('file', image.data)

        const requestOptions = {
            method: 'POST',
            // headers: { 'Content-Type': 'multipart/form-data' },
            body: formData
        };
        const response = await fetch('http://localhost:5000/predict', requestOptions)
        if (response) {
            setStatus(response.statusText)
            response.json().then(data => setPrediction(data.prediction))
        }
    }
    return ( 
        <div>
        <h1>Upload to server</h1>
        {image.preview && <img src={image.preview} width='200' height='200' className='image' />}
        {/* <hr></hr> */}
        <form onSubmit={handleSubmit} className = 'chooseFile'>
          <input type='file' name='file' onChange={onImageChange} className='inputField'></input>
          <button type='submit' className='submitButton'>Submit</button>
        </form>
        {/* {status && <h4>{status}</h4>} */}
        {prediction == 1 && <h2>malignant</h2>}
        {prediction == 0 && <h2>benign</h2>}
      </div>
    );
}



 
export default ImageUplaod;