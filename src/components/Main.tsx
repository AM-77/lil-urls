import React, { useState, ReactElement, FormEvent } from 'react'
import axios from 'axios'
import copy from 'copy-to-clipboard'

export default function Main(): ReactElement {

  const [link, setLink] = useState("")
  const [data, setData] = useState({ url: "", lil: ""})
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const isValidLil = (lil: string) => /[a-zA-Z0-9_-]{5}/.test(lil)

  const onInputChnage = (e: FormEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name
    const value =  e.currentTarget.value 
    setData({...data, [name]: value})
  }

  const getLilURL = (e: FormEvent) => {
    e.preventDefault()

    if (data.lil.length !== 0 && !isValidLil(data.lil)) {
      setError("Invalid custom lil.")
      setTimeout(()=> { setError("") }, 3000)
    } else if (data.url === "") {
      setError("Invalid url.")
      setTimeout(()=> { setError("") }, 3000)
    } else {
      axios.post("https://lil-urls.herokuapp.com", data)
      .then(res => {
        const { code, lil, message } = res.data
        if(code === 405) {
          setError(message)
          setTimeout(()=> { setError("") }, 3000)
        }
        if(code === 200) setLink(`${window.location.origin}/${lil}`)
      })
      .catch(err => {
        setError("A serevr error, please try again.")
        setTimeout(()=> { setError("") }, 3000)
      })
    }  
  }

  const onCopy = () => {
    copy(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="main">
      { 
        (error.length > 0) && 
          <div className="error-container">
            <p className="error">{error}</p>
          </div> 
      }

      { 
        (link.length > 0) && 
          <div className="link-container">
            <p className="title">Your link is ready</p>
            <div onClick={onCopy} className="link">
              <p>{link}</p>
            </div>
            <p className="copy">{copied ? 'copied' : 'click to copy' } to clipboard</p>
          </div> 
      }

      <form className="input-form">
        <div className="input">
          <label htmlFor="url">The URL</label>
          <input id="url" type="text" name="url" onChange={onInputChnage} placeholder="http://dod.whatever.com/cool?am=77" />
        </div>

        <div className="input">
          <label htmlFor="custom">Customized url</label>
          <input id="custom" type="text" name="lil" minLength={5} maxLength={5} onChange={onInputChnage} placeholder="Optional (must be 5 characters)"/>
        </div>
        <div className="submit">
          <button type="submit" onClick={getLilURL}>lil url</button>
        </div>
      </form>
    </div>
  )
}
