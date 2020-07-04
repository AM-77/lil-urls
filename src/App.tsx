import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Footer from './components/Footer'
import Main from './components/Main'
import Loader from './components/Loader'

const isValidPathname = (pathname:string): boolean => (pathname.lastIndexOf("/") === 0)

function App() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const { pathname } =  window.location
    if (pathname.length > 1) {
      if (isValidPathname(pathname)) {
        axios.get("https://lil-urls.herokuapp.com" + pathname)
          .then((res) => {
            const { code, url } = res.data
            if(code === 200) { 
              window.location.href = url 
            } else if(code === 404) { 
              setLoaded(true) 
              setError("URL does not exist.")  
              setTimeout(() => { window.location.href = window.location.origin }, 1500)
            } else setLoaded(true)
          })
          .catch((err) => console.log(err))
      } else {
        setError("URL does not exist.")  
        setLoaded(true)
        setTimeout(() => { window.location.href = window.location.origin }, 1500)
      }
    } else {
      setLoaded(true)
    }    
  }, [])

  return (
      loaded ? 
        <div className="app-container">
          {
            error.length > 0 ? 
              <div className="redirect-error">
                <p>{error}</p>
              </div>
            : <React.Fragment>
                <Header />
                <Main />
                <Footer />
              </React.Fragment> 
          }
        </div>
        :
        <Loader />
  )
}

export default App