import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux';
import styled from "styled-components"
import Comment from './Comment';

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;
const Comments = ({ videoId }) => {// Comentario para el video que se esta visionando
  console.log({videoId})
  const { currentUser } = useSelector((state) => state.user);  // Usuario logueado

  const [comments, setComments] = useState([]);                // State para los comments 

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);   // Petición para obtener los comentarios de un video
        console.log(res.data);
        setComments(res.data);                                 // Estado para los comments []
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);
  
  


  return (
    <Container>

      <NewComment>
        <Avatar src={ currentUser.img } />
        <Input placeholder="Add a comment..." />
      </NewComment>

      { comments.map(comment => (                             // mapeamos los comentarios
        <Comment key={ comment._id } comment={ comment }/>    // y los mostramos. ( Enviamos el id del comentario y el { comment })
      ))}

    </Container>
  )
}

export default Comments