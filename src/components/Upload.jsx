import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;

const Upload = ({ setOpen }) => {

  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate()

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);                                // Instancia de almacenamiento en firebase app
    const fileName = new Date().getTime() + file.name;              // Nombre del archivo que se sube, personalizado con la fecha de subida
    const storageRef = ref(storage, fileName);                      // Referencia para el sitio donde vamos a almacenar el archivo        
    const uploadTask = uploadBytesResumable(storageRef, file);      // Indicador de lo que falta por subir

    uploadTask.on(                                                  // El uploadTask estará a la escucha del evento que indique que su estado cambio
      "state_changed",                                              // El evento a escuchar se llama "state_changed"    
      (snapshot) => {                                               // Entonces se optendrá un snapshot del estado una vez cambio. Este estado contendrá :
        
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;                        // progress = % de bytes cargados
        urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));    // Si lo que se sube = img mostramos el % de imagen cargado, sino el % de video cargado
        
        switch (snapshot.state) {                                                                        // Si el state del snapshot cambia a "paused", mensaje de "upload pause"       
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":                                                                                // Si el state del snapshot cambia a "running", mensaje de "upload is running"   
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => { // Este cb devuelve la dirección para el archivo subido y se guarda en el state de inputs
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {                             // Cada vez que video cambie en su state ( se sube un file )
    video && uploadFile(video , "videoUrl");    // llamamos uploadFile y le enviamos el video y el typo de archivo en este caso videoUrl
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e)=>{
    e.preventDefault();
    console.log(inputs, tags)
    const res = await axios.post("/videos", {...inputs, tags})
    setOpen(false)
    res.status===200 && navigate(`/video/${res.data._id}`)
  }


  return (
    <Container>
        <Wrapper>
            <Close onClick={() => setOpen( false )}>X</Close>
            <Title>Upload a new video</Title>
            <Label>Video:</Label>
            { videoPerc > 0 ? (                                     // Si el % de video subido > 0 mostramos lo subido
                "Uploading:" + videoPerc
            ) : (                                                   // Si no mostramos la caja del imput 
              <Input 
                type="file" 
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}    
            />)}
            <Input 
                type="text" 
                placeholder="Title"
                name="title"
                onChange={ handleChange }
            />
            <Desc 
                placeholder="Description"
                name="desc" 
                rows={ 8 }
                onChange={ handleChange }
            />
            <Input 
                type="text" 
                placeholder="Separate the tags with commas"
                onChange={ handleTags }    
            />
            <Label>Image:</Label>
            { imgPerc > 0 ? (
                "Uploading:" + imgPerc + "%"
            ) : (
                <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImg(e.target.files[0])}    
                />
            )}
            <Button onClick={ handleUpload }>Upload</Button>
        </Wrapper>
    </Container>
  )
}

export default Upload