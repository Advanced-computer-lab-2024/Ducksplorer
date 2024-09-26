import logo from './logo.svg';
import './App.css';
import FormSection from './Components/FormSection.js';
import TextSection from './Components/TextSection.js';
import {useState} from 'react';
import React from 'react';

   /*const [type, updateType] = useState("Tourist");



  const newType = (thisType)=>
  {
    updateType(thisType);
  }

 */
function App() {
  


  return (
    <>
    <FormSection type={"Tourist"}/>
    <TextSection/>
    </>

  );
}



export default App;
export {newType} from "./App.js";
