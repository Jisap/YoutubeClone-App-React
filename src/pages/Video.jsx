import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Card from "../components/Card";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios"
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { subscription } from "../redux/userSlice";
import { format } from "timeago.js";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;
const Content = styled.div`
  flex: 5;
`;
// const Recommendation = styled.div`
//   flex: 2;
// `;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;
const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;
const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;
const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;
const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;
const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;
const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;
const Video = () => {

  const { currentUser } = useSelector( (state) => state.user );
  const { currentVideo } = useSelector((state) => state.video );
  const dispatch = useDispatch()
  const path = useLocation().pathname.split("/")[2]; // Obtengo la id del video desde la url
  
  const [channel, setChannel] = useState({})
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await axios.get(`/videos/find/${path}`)                  // Buscamos el video con la id conseguida de la url
        const channelRes = await axios.get(`/users/find/${videoRes.data.userId}`) // Buscamos el channel con la id del usuario contenido en el video                                          
        setChannel( channelRes.data )                                             // Y establecemos el estado del canal  
        dispatch( fetchSuccess(videoRes.data))                                    // Como la petición se realizo correctamente -> accíon para establecer el state de video
      } catch (error) {}                                                          // Con este state dibujamos el video y sus detalles, incluidos su iconos de like y dislike
    }
    fetchData()
  },[path, dispatch])

   const handleLike = async () => {
    await axios.put(`/users/like/${currentVideo._id}`);       // Actualizamos en el video el campo [like] correspondiente al usuario logeado que hizo like
    dispatch(like(currentUser._id));                          // Actualizamos el state de current user
  };

  const handleDislike = async () => {
    await axios.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    currentUser.subscribedUsers.includes(channel._id)   // Si el usuario logueado en su campo subscribedUsers contiene el id del canal ( id del usuario que lo creo)
      ? await axios.put(`/users/unsub/${channel._id}`)  // procedemos a des-subscribirlo
      : await axios.put(`/users/sub/${channel._id}`);   // sino lo subscribimos
    dispatch(subscription(channel._id));
  };

  return (
    <Container>
      
      {/* flex:5 */}
      <Content>
        <VideoWrapper>
          <VideoFrame src={ currentVideo.videoUrl } controls/> 
        </VideoWrapper>
        <Title>{ currentVideo.title }</Title>
        {/* df aic jc:space-between */}
         <Details> 

          <Info>{ currentVideo.views } views • { format(currentVideo.createdAt) }</Info>

              <Buttons>
                <Button onClick={ handleLike }>
                    { currentVideo.likes?.includes(currentUser?._id) ? (<ThumbUpIcon />) : (<ThumbUpOutlinedIcon />)} {""}
                    { currentVideo.likes?.length }  
                </Button>
                <Button onClick={ handleDislike }>
                  {/* El icono de dedo abajo solo aparece relleno si eres el usuario que le dio a like */}
                  {currentVideo.dislikes?.includes(currentUser?._id) ? (<ThumbDownIcon />) : (<ThumbDownOffAltOutlinedIcon />)}{" "}
                  Dislike
                </Button>
                <Button>
                {/* El icono de dedo arriba solo aparece relleno si eres el usuario que le dio a like */}
                  <ReplyOutlinedIcon /> Share
                </Button>
                <Button>
                  <AddTaskOutlinedIcon /> Save
                </Button>
              </Buttons>

        </Details> 
        <Hr />
        {/* df jc:space-between */}
        <Channel>
          {/* df */}
          <ChannelInfo>
            <Image src={ channel.img } />
            {/* df fd:column */}
            <ChannelDetail>
                <ChannelName>{ channel.name }</ChannelName>
                <ChannelCounter>{ channel.subscribers }subscribers</ChannelCounter>
                <Description>
                  { currentVideo.desc }
                </Description>
              </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={ handleSub }>
            { currentUser.subscribedUsers?.includes(channel._id) // Si el usuario logueado tiene en el [subcribedUsers] la id del canal (id del usuario que creo el video)
              ? "SUBSCRIBED"                                     // ponemos suscrito sino subscribete.
              : "SUBSCRIBE" }
          </Subscribe>
        </Channel>

        <Hr />
        <Comments videoId={ currentVideo._id } />

      </Content>
      
      {/* flex:2 */}
       <Recommendation tags={ currentVideo.tags } />
    </Container>
  )
}

export default Video