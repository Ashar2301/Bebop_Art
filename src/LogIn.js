import React from 'react';
import Classes from './LogIn.module.css'
import {Link , withRouter} from 'react-router-dom'
import { useState } from 'react'
import {auth} from './firebase'
import  StyledFirebaseAuth  from 'react-firebaseui/StyledFirebaseAuth'
import firebase  from 'firebase'
import { useHistory } from 'react-router'
import bcrypt from 'bcryptjs'

function LogIn(props) {

    const  [disabled , setDisabled] = useState(true);
    const  [loading , setLoading] = useState(true);
    const [error,setError] = useState("");
    const history = useHistory();

    const  onLogInClick=()=>{
        let email = document.getElementById("email")
        let password = document.getElementById("password")

        if(email.value.length ===0 || password.value.length === 0){
            return setError("All Field Are Neccessary")
        }
            setError("")
            setLoading(true)
            
            const db = firebase.firestore();
            db.collection("Artists").get().then((querySnapshot)=>{
              querySnapshot.forEach((doc)=>{
                let obj = doc.data();
                if(obj.email.toLowerCase().localeCompare(email.value.toLowerCase()) === 0)
                {

                  bcrypt.compare(password.value , obj.password).then((res)=>{
                    if(res)
                    {
                      console.log("res - " + res);
                      if(obj.authorized == true)
                      {
                        window.alert("LOG IN SUCCESSFULL!!")
                        localStorage.setItem("currentUser" , email.value);
                        history.push('/home');
                        window.location.reload();
                      }
                      else
                      {
                        window.alert("Your Account has not been authorized yet");
                        //return;
                      }
                    }
                    else
                    {
                        window.alert("USERNAME OR PASSWORD DO NOT MATCH!!")
                        //return;
                    }
                  })
                  // if(obj.password.indexOf(password.value) !== -1)
                  // {
                  //   if(obj.authorized == true)
                  //   {
                  //     localStorage.setItem("currentUser" , email.value);
                  //     history.push('/home');
                  //     window.location.reload();
                  //   }
                  //   else
                  //   {
                  //     window.alert("Your Account has not been authorized yet");
                  //     return;
                  //   }
                  // }
                  // else
                  // {
                  //   window.alert("USERNAME OR PASSWORD DO NOT MATCH!!")
                  //   return;
                  // }
                }
              })
            })
        setLoading(false)
        
    }

    
   const onEmailChange=(event)=>{
      const value = event.target.value;
      const pattern = /\S+@\S+\.\S+/;
      const test = pattern.test(value);
      if(test){
        document.getElementById("alert").style.display = "none"
       // this.setState({disabled:false})
        setDisabled(false);
      }
      else{
        document.getElementById("alert").style.display = "flex"
        //this.setState({disabled:true})
        setDisabled(true);
      }
    }

    return (
       
        <div className={Classes.SigninMenu}>
                  <h1>Artist Dashboard</h1>
                  <h1>LOG IN</h1>
                  <div className={Classes.elements}>
                    <div className={Classes.alert} id="alert">
                      {/* <img src={exclamationmark} style={{width:'5vh',height:'5vh'}}></img> */}
                      <h1>Enter A Valid Email Address</h1>
                    </div>
                    <input id="email" onChange={onEmailChange} type="email" placeholder="Enter Email Id"></input>
                    <input id="password" type="password" placeholder="Enter Password"></input>
                    
                   
                   <Link to='/'><button disabled={disabled} onClick={onLogInClick} className={Classes.btn}>Log In</button></Link>
                   <Link to='/signup'><button className={Classes.btn2}>Sign Up</button></Link>
                  
                  </div>
                
        </div>
        
    );
}

export default LogIn;