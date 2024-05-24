
import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Icon,
  Center,
  Spacer,
} from '@chakra-ui/react'
import { Trash2Icon } from 'lucide-react'
const TableUI = ({ tableData , setTableData}) => {
  const ProdQtyData = tableData.filter(obj => Object.keys(obj).length === 2 && obj.hasOwnProperty('product')  && obj.hasOwnProperty('qty'));
  const AllPropData = tableData.filter(obj => !ProdQtyData.includes(obj));
  console.log("prod qty", ProdQtyData, AllPropData)
  const handleDelete = (idx)=>{
    const newData = [...tableData]; // Create a copy of the array
    newData.splice(idx, 1); // Remove the element at the specified index
    setTableData(newData); // Update the state with the new array
  }
  console.log(tableData, tableData.length)
  return tableData.length > 0 ?
    (<>
    {AllPropData?.length > 0  &&    
    <TableContainer>
      <Table size={"lg"} w={"100vw"} variant='striped'>
        <TableCaption>Items added to the list</TableCaption>
        <Thead alignContent={"center"}>
          <Tr>
            <Th>Destination</Th>
            <Th>Source</Th>
            <Th>Mode </Th>
            <Th>Product </Th>
            <Th>Quantity</Th>
            <Th> More</Th>
          </Tr>
        </Thead>
        <Tbody>
          {AllPropData.map((table, idx) => (
            <Tr>
              <Td>{table.source}</Td>
              <Td>{table.destination}</Td>
              <Td>{table.mode}</Td>
              <Td>{table.product}</Td>
              <Td>{table.qty}</Td>
              <Td>
                <Button onClick={()=> handleDelete(idx)} colorScheme='red' variant={"outline"} gap={2}>
                  <Trash2Icon />
                  Delete
                </Button>
              </Td>
            </Tr>

          ))}
        </Tbody>
      </Table>
    </TableContainer>}
 
    
  
<Spacer/>
{console.log(ProdQtyData, "is prod qty data || table data", tableData, )}
{ProdQtyData?.length > 0  &&   <TableContainer>
    <Table variant='simple'>
      <TableCaption>Items added to the list</TableCaption>
      <Thead>
        <Tr>
          <Th>Product </Th>
          <Th>Quantity</Th>
          <Th> More</Th>
        </Tr>
      </Thead>
      <Tbody>
        {ProdQtyData.map((table, idx) => (
          <Tr>
            <Td>{table.product}</Td>
            <Td>{table.qty}</Td>
            <Td>
              <Button onClick={()=> handleDelete(idx)} colorScheme='red' variant={"outline"} gap={2}>
                <Trash2Icon />
                Delete
              </Button>
            </Td>
          </Tr>

        ))}
      </Tbody>
    </Table>
  </TableContainer>}
  
</>
  ) : (<Center>No items present</Center>)

}

export default TableUI