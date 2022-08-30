import {Link} from 'react-router-dom'
import {useState} from 'react'
import firebase from 'firebase/app';
import { useHistory } from 'react-router'
import Classes from './SignUp.module.css'
import 'firebase/firestore';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import bcrypt from 'bcryptjs'
import LoadingOverlay from 'react-loading-overlay';

const SignUp=()=>{

    const [email , setEmail] = useState(true)
    const [pswd , setPswd] = useState(true)
    const [cpswd , setCpswd] = useState(true)
    const [name , setName] = useState(true)
    const [wallet , setWallet] = useState(true)
    const [pfp , setPfp] = useState();
    const [cid , setCID] = useState();
    const [error,setError] = useState("");
    const history = useHistory();
    const [loading,setLoading] = useState(false);
    const [password,setPassword] = useState(true);

    const getAccessToken=()=>{
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU4ZWYzMzY0MTFmQzc0QzRFNjg4REY4MjNkQzE4M2FmNmY3REI4NjYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTE0MzM2MjYwNzgsIm5hbWUiOiJUZXN0SVBGUyJ9.zg6TF9-joEhmz1LYaIm0dN5lyE_LE0M-0RapUqe1wgk';
    }

    async function storeWithProgress (files) {
       
        const onRootCidReady = cid => {
          console.log('uploading files with cid:', cid)
         // updateURLs(cid)
          setCID(cid);
        }
      
        const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
        let uploaded = 0
      
        const onStoredChunk = size => {
          uploaded += size
          const pct = totalSize / uploaded
          console.log(`Uploading... ${pct.toFixed(2)}% complete`)
        }
      
        const client = new Web3Storage({token : getAccessToken()});
       return client.put(files, { onRootCidReady, onStoredChunk })
      }

    const onSignInClick=async()=>{
        let emailRef = document.getElementById("email");
        let nameRef = document.getElementById("name");
        let passwordRef = document.getElementById("password");
        let cpasswordRef = document.getElementById("cpassword");
        let walletRef = document.getElementById("wallet");
        if(passwordRef.value !== cpasswordRef.value){
            return setError("Passwords Do Not Match Error")
        }
        else if(emailRef.value.length === 0 ||nameRef.value.length === 0 ||passwordRef.value.length === 0 ||cpasswordRef.value.length === 0 || walletRef.value.length === 0 ){
           
            return setError("All Fields Are Neccessary")
        }
        
            
            setError("");
            setLoading(true);
            const  temp = await storeWithProgress([pfp]);
            console.log( temp);
            const db = firebase.firestore();
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(passwordRef.value , salt);
            console.log(hash);
            db.collection("Artists").doc(nameRef.value).set({
                email : emailRef.value,
                name : nameRef.value,
                password : hash,
                authorized : false,
                pfp : 'https://' + temp +'.ipfs.dweb.link/'+pfp.name,
                wallet : walletRef.value,
                likes : 0           
            })
            .then((id)=>{
                console.log("added " + id)
                window.alert("Sign In Successfull . Redirecting To Log In Page")
                    history.push('/');
                    window.location.reload();
            })
            .catch((err)=>{
                console.log(err)
            })
            
            setLoading(false);  
        
    }

    const onPfpChange=(event)=>{
        
        
        console.log(event.target.files[0])
        setPfp(event.target.files[0]);
    }

   const onEmailChange=(event)=>{
        const value = event.target.value;
        const pattern = /\S+@\S+\.\S+/;
        const test = pattern.test(value);
        if(test){
          document.getElementById("emailAlert").style.display = "none"
          setEmail(false)
        }
        else{
          document.getElementById("emailAlert").style.display = "flex"
          setEmail(true)
        }
      }

    const onPswdChange=(event)=>{
        
        if(event.target.value.length < 6)
        {
            document.getElementById("pswdAlert").style.display = "flex"
            setPswd(true)
        }
        else{
            document.getElementById("pswdAlert").style.display = "none"
            setPswd(false)
        }
    }
    const onCPswdChange=(event)=>{
        const pswd = document.getElementById('password').value;
       // console.log(pswd + " " + event.target.value)
        if(event.target.value !== pswd)
        {
            document.getElementById("cpswdAlert").style.display = "flex"
            setCpswd(true)
        }
        else{
            document.getElementById("cpswdAlert").style.display = "none"
            setCpswd(false)
        }
    }
    const onNameChange=(event)=>{
        if(event.target.value.length > 0)
        {
            setName(false)
            document.getElementById('nameAlert').style.display = "none"
        }
        else{
            setName(true);
            document.getElementById('nameAlert').style.display = "flex"
        }
    }
    const onWalletChange=(event)=>{
        if(event.target.value.length > 0)
        {
            setWallet(false)
            document.getElementById('walletAlert').style.display = "none"
        }
        else{
            setWallet(true);
            document.getElementById('walletAlert').style.display = "flex"
        }
    }
   
    return(
        
        <LoadingOverlay
            active={loading}
            spinner
            text='Uploading Data...'
            styles={{
                overlay: (base) => ({
                  ...base,
                  width : '100vw',
                  height : '100vh'
                })
              }}
            >
        <div className={Classes.SigninMenu}>
            
            {/* <p>Some content or children or something.</p> */}
           
            <h1>SIGN UP</h1>
            <div className={Classes.elements}>
                         <div className={Classes.emailAlert} id="nameAlert">
                          {/* <img src={exclamationmark} style={{width:'5vh',height:'5vh'}}></img> */}
                          <h1>Enter Your Name</h1>
                        </div>
                         <input id="name" type="text" onChange={onNameChange} placeholder="Enter Artist's Name"></input>
                         <div className={Classes.emailAlert} id="emailAlert">
                          {/* <img src={exclamationmark} style={{width:'5vh',height:'5vh'}}></img> */}
                          <h1>Enter A Valid Email Address</h1>
                        </div>
                        <input onChange={onEmailChange} id="email" type="email" placeholder="Enter Email Id"></input>
                        <div className={Classes.emailAlert} id="pswdAlert">
                          {/* <img src={exclamationmark} style={{width:'5vh',height:'5vh'}}></img> */}
                          <h1>Password Must Be Atleast 6 Characters Long</h1>
                        </div>
                        <div className={Classes.emailAlert} id="walletAlert">
                          {/* <img src={exclamationmark} style={{width:'5vh',height:'5vh'}}></img> */}
                          <h1>Enter Your Metamask Wallet Account</h1>
                        </div>
                        <input id="wallet" type="text" onChange={onWalletChange} placeholder="Enter Metamask Wallet Account"></input>
                        <input id="password" onChange={onPswdChange} type="password" placeholder="Enter Password"></input>
                        <div className={Classes.emailAlert} id="cpswdAlert">
                          {/* <img src={exclamationmark} style={{width:'5vh',height:'5vh'}}></img> */}
                          <h1>Passwords Do Not Match</h1>
                        </div>
                        <input id="cpassword" type="password" onChange={onCPswdChange} placeholder="Confirm Password"></input>
                        <div className={Classes.textonly}>Choose a Profile Pic</div><input type="file" onChange={onPfpChange}></input><br></br>
                      
                       <button onClick={onSignInClick} disabled={name || email || pswd || cpswd} className={Classes.btn}>Sign Up</button>
                      
            </div>
           
                    
         </div>
         </LoadingOverlay>
    )


}

export default SignUp;