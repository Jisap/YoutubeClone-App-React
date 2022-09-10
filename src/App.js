import React, { useState } from 'react';
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Theme";
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Home } from './pages/Home';
import Video from './pages/Video';
import SignIn from './pages/SignIn';

const Container = styled.div`
  display: flex;
`;
const Main = styled.div`
  flex:7;
  background-color: ${({ theme }) => theme.bg };
`;

const Wrapper = styled.div`
  padding: 22px 96px;
`;



function App() {

  const [darkMode, setDarkMode] = useState(true);


  return (
    <ThemeProvider theme={ darkMode ? darkTheme : lightTheme }>
      
      {/* Display:flex */}
      <Container>
        <BrowserRouter>
          {/* flex:1 */}
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          {/* flex:7 */}
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={ <Home /> } />
                  <Route path="signing" element={ <SignIn /> } />
                  <Route path="video">
                    <Route path=":id" element={ <Video /> }/>
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>

        </BrowserRouter>
      </Container>

    </ThemeProvider>
  );
}

export default App;
