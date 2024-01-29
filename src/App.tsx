import React from 'react';
import Products from './Component/Products';
import Logo from '../src/assets/logo/logo.png';
import './App.css';


const App = () => {
  return (
    <div className="flex flex-col w-full h-full relative">
      <img src={Logo} width="58" height="58" className='absolute z-30 left-[50px] top-[10px] cursor-pointer'/>
      <Products/>
    </div>
  );
}

export default App;
