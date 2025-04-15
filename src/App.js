// src/App.js
import { ChakraProvider } from '@chakra-ui/react';
import ResizableTable from './components/ResizableTable';

function App() {
  return (
    <ChakraProvider>
      <ResizableTable />
    </ChakraProvider>
  );
}

export default App;