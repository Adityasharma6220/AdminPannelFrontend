import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing ,BackendURL} from 'store/constant';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import {  Grid,Card, CardContent, Checkbox, FormControl, Input, InputLabel,Button, Stack } from '@mui/material';
const animals =[
    { name: 'Ostrich', code: '01-02-03-04' },
    { name: 'Eagle', code: '05-06-07-08' },
    { name: 'Donkey', code: '09-10-11-12' },
    { name: 'Butterfly', code: '13-14-15-16' },
    { name: 'Dog', code: '17-18-19-20' },
    { name: 'Goat', code: '21-22-23-24' },
    { name: 'Sheep', code: '25-26-27-28' },
    { name: 'Camel', code: '29-30-31-32' },
    { name: 'Snake', code: '33-34-35-36' },
    { name: 'Rabbit', code: '37-38-39-40' },
    { name: 'Horse', code: '41-42-43-44' },
    { name: 'Elephant', code: '45-46-47-48' },
    { name: 'Cock', code: '49-50-51-52' },
    { name: 'Cat', code: '53-54-55-56' },
    { name: 'Alligator', code: '57-58-59-60' },
    { name: 'Lion', code: '61-62-63-64' },
    { name: 'Monkey', code: '65-66-67-68' },
    { name: 'Pig', code: '69-70-71-72' },
    { name: 'Peacock', code: '73-74-75-76' },
    { name: 'Turkey', code: '77-78-79-80' },
    { name: 'Bull', code: '81-82-83-84' },
    { name: 'Tiger', code: '85-86-87-88' },
    { name: 'Bear', code: '89-90-91-92' },
    { name: 'Deer', code: '93-94-95-96' },
    { name: 'Cow', code: '97-98-99-00' }
  ]
  
  function AddResult() {
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const navigate = useNavigate();
    const {id} =useParams()

    const backBtn = () => {
      navigate(-1);
    };
  
    const handleAnimalSelect = (animalName, isChecked) => {
        if (isChecked) {
          setSelectedAnimals(prevState => {
            if (prevState.length < 8) {
              // Check if the animal is already in selectedAnimals
              const isAnimalSelected = prevState.find(animal => animal.name === animalName);
              // If the animal is not already selected, add it
              if (!isAnimalSelected) {
                return [...prevState, { name: animalName, code: "" }];
              }
            }
            return prevState;
          });
        } else {
          setSelectedAnimals(prevState => prevState.filter(animal => animal.name !== animalName));
        }
      };
  
    const handleCodeChange = (animalName, newCode) => {
        
      if (/^\d{0,2}$/.test(newCode)) { // Only accept two-digit values
        setSelectedAnimals(prevState => {
          const updatedAnimals = [...prevState];
          const index = updatedAnimals.findIndex(animal => animal.name === animalName);
          updatedAnimals[index] = { ...updatedAnimals[index], code: newCode };
          return updatedAnimals;
        });
      }
    };
  
    const renderAnimalCards = () => {
      return animals.map(animal => (
        <Grid key={animal.name} item xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{ backgroundColor: selectedAnimals.some(selected => selected.name === animal.name) ? '#a3d3ff' : 'white' }}
            onClick={(e) => handleAnimalSelect(animal.name, !selectedAnimals.some(selected => selected.name === animal.name))}
          >
            <CardContent>
              <Checkbox
                checked={selectedAnimals.some(selected => selected.name === animal.name)}
                onChange={(e) => {
                  e.stopPropagation(); // Stop event propagation to prevent interference with input field
                  handleAnimalSelect(animal.name, e.target.checked);
                }}
              />
              <span>{animal.name}</span><br />
              <span>{animal.code}</span>
              {selectedAnimals.some(selected => selected.name === animal.name) && (
                <FormControl>
                  <InputLabel htmlFor={`${animal.name}-code`}>Code</InputLabel>
                  <Input
                    id={`${animal.name}-code`}
                    value={selectedAnimals.find(selected => selected.name === animal.name).code}
                    onChange={(e) => handleCodeChange(animal.name, e.target.value)}
                    onClick={(e) => e.stopPropagation()} // Prevent event propagation from the input field
                    disabled={!selectedAnimals.some(selected => selected.name === animal.name)}
                    inputProps={{ maxLength: 2 }}
                    required={true}
                  />
                </FormControl>
              )}
              {selectedAnimals.some(selected => selected.name === animal.name) && (
                <span>{selectedAnimals.find(selected => selected.name === animal.name).code.slice(2)}</span>
              )}
            </CardContent>
          </Card>
        </Grid>
      ));
    };
  
    const handleSave = async() => {
        console.log(id)
        // Validate selection
        if (selectedAnimals.length !== 8) { // Changed condition to exactly 8
            toast.error("Please select exactly 8 animals.")
          return;
        }

        // Validate code fields
        const invalidCode = selectedAnimals.some((animal) => animal.code.length !== 2);
        if (invalidCode) {
          toast.error('Please fill in all code fields.');
          return;
        }

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          };
      
          try {
            let inputObj = {
                selectedAnimals,
                id
            }
            let response = await axios.post(`${BackendURL}v2/lottery/lottery-rooms/saveResultForRoom`, inputObj, { headers });
            if (response.data.status === true) {
              toast.success('Lottery result added successfully!');
              navigate('/admin/lottery/rooms/all');
            }
          } catch (error) {
            handleRequestError(error);
          }
        };
      
        const handleRequestError = (error) => {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
          }
          toast.error('Something went wrong on the server!');
          console.error('Error:', error);
        };
      return (
        <Grid container spacing={2}>
          {renderAnimalCards()}
          <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
                      <Button variant="contained" color="primary"  style={{ width: '100px' }} onClick={handleSave}>
                        Save
                      </Button>
                      <Button variant="contained" color="warning" onClick={backBtn} style={{ width: '100px' }}>
                        Back
                      </Button>
                    </Stack>
          </Grid>
        </Grid>
      );
    
  }
  
  
  export default AddResult;
