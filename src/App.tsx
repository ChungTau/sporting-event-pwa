import {CSSReset, ChakraProvider} from '@chakra-ui/react';
import { BrowserRouter} from 'react-router-dom';
import './App.css';
import Router from './components/Router';
export const authenticated = false;
function App() {
  
  return (
    <ChakraProvider>
      <CSSReset/>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
