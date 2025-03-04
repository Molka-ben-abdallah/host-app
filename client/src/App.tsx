import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import { getTest } from './functions/apiTest';

function App() {
  const [data, setData] = useState("Hello world");
  useEffect(() => {
    getTest().then((res)=> {
      setData(res.message);
    }).catch((err)=> console.log(err));
  }, []);
  return (
    <div className="App">
     <h1>{data}</h1>
    </div>
  );
}

export default App;
