import axios from "axios";
import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => props.type === "sm" ? "10px" : "45px"};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;
const Image = styled.img`
  width: 100%;
  height: ${(props) => props.type === "sm" ? "100px" : "202px"};
  background-color: #999;
  flex: 1;
`;
const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;
const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;
const Texts = styled.div``;
const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text}
`;
const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;
const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;


export const Card = ({ type, video }) => { // type viene de la page video.jsx como una prop, video viene de home
  
  const [channel, setChannel] = useState({})

  useEffect(() => {
   const fetchChannel = async () => {
    const resp = await axios.get(`/users/find/${video.userId}`) // Apuntamos al usuario como canal de video
    setChannel( resp.data )                                     // y establecemos el canal en base a ese usuario
  }
  fetchChannel()
}, [video.userId]);


  return (
    // El Link nos envia a la page /video con el param video._id
    <Link to={`/video/${video._id}`} style={{textDecoration: 'none'}}> 
      <Container type={ type }>

        <Image 
          type={ type } 
          src={ video.imgUrl }
        />

        <Details type={ type }>
          <ChannelImage 
            type={ type }  
            src={ channel.img }
          />
          <Texts>
              <Title>{ video.title }</Title>
              <ChannelName>{ channel.name }</ChannelName>
              <Info>{ video.views } views • { format(video.createdAt) }</Info>
          </Texts>
        </Details>

      </Container>
    </Link>
  )
}

export default Card;
