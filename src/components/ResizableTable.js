// src/components/ResizableTable.js
import '../components/ResizableTable';
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  chakra,
  Badge,
  useMediaQuery,
} from '@chakra-ui/react';

const data = [
  { id: 1, brand: 'HP', model: '15-ay', category: 'Computer', availability: 'Available' },
  { id: 2, brand: 'HP', model: 'pavilion', category: 'Computer', availability: 'Available' },
  { id: 3, brand: 'Dell', model: 'aspirion', category: 'Computer', availability: 'Out of Stock' },
  { id: 4, brand: 'Acer', model: 'nitro', category: 'Computer', availability: 'Available' },
  { id: 5, brand: 'Acer', model: 'nitro', category: 'Computer', availability: 'Low Stock' },
  { id: 6, brand: 'Samsung', model: 'Galaxy S23', category: 'Mobile', availability: 'Available' },
  { id: 7, brand: 'Apple', model: 'iPhone 15', category: 'Mobile', availability: 'Available' },
  { id: 8, brand: 'Xiaomi', model: 'Redmi Note 12', category: 'Mobile', availability: 'Out of Stock' },
  { id: 9, brand: 'Apple', model: 'iPad Pro', category: 'Tablet', availability: 'Available' },
  { id: 10, brand: 'Samsung', model: 'Galaxy Tab S9', category: 'Tablet', availability: 'Low Stock' },
];

const availabilityColorScheme = {
  'Available': 'green',
  'Out of Stock': 'red',
  'Low Stock': 'yellow'
};

const ResizableTable = () => {
  const [brandFilter, setBrandFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [columnWidths, setColumnWidths] = useState({
    id: 100,
    brand: 150,
    model: 200,
    category: 150,
    availability: 150,
  });
  const [isResizing, setIsResizing] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const tableRef = useRef(null);

  const handleMouseDown = (columnName, e) => {
    setIsResizing(columnName);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnName]);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const newWidth = startWidth + (e.clientX - startX);
    setColumnWidths(prev => ({
      ...prev,
      [isResizing]: Math.max(50, newWidth) // Minimum width of 50px
    }));
  };

  const handleMouseUp = () => {
    setIsResizing(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startX, startWidth]);

  const filteredData = data.filter((item) => {
    const matchesBrand = brandFilter ? item.brand.toLowerCase().includes(brandFilter.toLowerCase()) : true;
    const matchesCategory = categoryFilter ? item.category.toLowerCase() === categoryFilter.toLowerCase() : true;
    return matchesBrand && matchesCategory;
  });

  const uniqueCategories = [...new Set(data.map((item) => item.category))];

  return (
    <Box p={4} maxWidth="1200px" margin="0 auto">
      <Box mb={4} display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems="center" gap={4}>
        <Box flex="1" width={isMobile ? '100%' : 'auto'}>
          <chakra.label display="block" mb={1} fontWeight="medium">
            Search By Brand
          </chakra.label>
          <Input
            placeholder="Type brand name"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            width="100%"
          />
        </Box>
        <Box flex="1" width={isMobile ? '100%' : 'auto'}>
          <chakra.label display="block" mb={1} fontWeight="medium">
            Category
          </chakra.label>
          <Select
            placeholder="All Categories"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            width="100%"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </Box>
      </Box>

      <Box 
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
        ref={tableRef}
      >
        <Table 
          variant="simple" 
          layout="fixed"
          width={isMobile ? '100%' : 'auto'}
          minWidth={`${Object.values(columnWidths).reduce((a, b) => a + b, 0)}px`}
        >
          <Thead>
            <Tr>
              {Object.entries(columnWidths).map(([key, width]) => (
                <Th 
                  key={key}
                  position="relative"
                  width={`${width}px`}
                  minWidth={`${width}px`}
                  maxWidth={`${width}px`}
                  px={2}
                  py={3}
                  fontSize={isMobile ? 'sm' : 'md'}
                  textTransform="uppercase"
                  color="gray.600"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  {key.toUpperCase()}
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    width="4px"
                    cursor="col-resize"
                    onMouseDown={(e) => handleMouseDown(key, e)}
                    _hover={{
                      backgroundColor: 'gray.300',
                    }}
                    _active={{
                      backgroundColor: 'blue.500',
                    }}
                  />
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((item) => (
              <Tr key={item.id} _hover={{ bg: 'gray.50' }}>
                <Td 
                  px={2} 
                  py={3} 
                  fontSize={isMobile ? 'sm' : 'md'}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                >
                  {item.id}
                </Td>
                <Td 
                  px={2} 
                  py={3} 
                  fontSize={isMobile ? 'sm' : 'md'}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                >
                  {item.brand}
                </Td>
                <Td 
                  px={2} 
                  py={3} 
                  fontSize={isMobile ? 'sm' : 'md'}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                >
                  {item.model}
                </Td>
                <Td 
                  px={2} 
                  py={3} 
                  fontSize={isMobile ? 'sm' : 'md'}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                >
                  {item.category}
                </Td>
                <Td 
                  px={2} 
                  py={3} 
                  fontSize={isMobile ? 'sm' : 'md'}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                >
                  <Badge 
                    colorScheme={availabilityColorScheme[item.availability] || 'gray'}
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontSize={isMobile ? 'xs' : 'sm'}
                  >
                    {item.availability}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ResizableTable;