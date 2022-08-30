import {React , useState , useEffect}  from 'react';
import firebase  from 'firebase'
import Classes from './Home.module.css'
import Web3 from 'web3'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import { CONTRACT_ABI , CONTRACT_ADDRESS } from './abiConfig';
import { AiOutlineLike , AiFillLike } from "react-icons/ai";
import { IconContext } from "react-icons";
import LoadingOverlay from 'react-loading-overlay';
const Home = () => {

    const [userContent , setUserContent] = useState([]);    
    const [artworkError , setArtworkError] = useState(false);
    const [songError , setSongError] = useState(false);
    const [song , setSong] = useState();
    const [genre , setGenre] = useState();
    const [artwork , setArtwork] = useState();
    const [songName , setSongName] = useState();
    const [contract , setContract] = useState();
    const [account , setAccount] = useState();
    const [balance ,setBalance] = useState(0);
    const [cid , setCID] = useState();
    const [user , setUser] = useState({});
    const [loading , setLoading] = useState(false);
    useEffect(()=>{
        fetchUserContent();
        loadweb3();
    },[])

    const getAccessToken=()=>{
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU4ZWYzMzY0MTFmQzc0QzRFNjg4REY4MjNkQzE4M2FmNmY3REI4NjYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTE0MzM2MjYwNzgsIm5hbWUiOiJUZXN0SVBGUyJ9.zg6TF9-joEhmz1LYaIm0dN5lyE_LE0M-0RapUqe1wgk';
    }

    const updateURLs=(CIDs)=>{
        const db = firebase.firestore();

        db.collection('Songs').doc(songName).set({
            name : songName,
            songURL : 'https://' + CIDs +'.ipfs.dweb.link/'+song.name,
            artworkURL : 'https://' + CIDs +'.ipfs.dweb.link/'+artwork.name,
            artist : user.name,
            likes : 0 ,
            genre : genre
        })
    }

    async function storeWithProgress (files) {
       
        const onRootCidReady = cid => {
          console.log('uploading files with cid:', cid)
          updateURLs(cid)
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

    const loadweb3=async()=>{
        const web3 = new Web3(Web3.givenProvider || "http://https://matic-mumbai.chainstacklabs.com:7545");  
     
        if (window.ethereum) {

        window.ethereum.enable();
        let accs = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(CONTRACT_ABI,CONTRACT_ADDRESS);
       // console.log(contract)
        console.log(accs);
        const bal = await contract.methods.bal(accs[0]).call();
        console.log(bal / (Math.pow(10,18)));
        console.log(localStorage.getItem('currentUser'));
        setBalance(bal / (Math.pow(10,18)))
        setContract(contract);
        setAccount(accs[0]);
        }
    }   
    const onSubmitClick=async()=>{
       
        if(songError)
        {
            window.alert('Only mp3 file format allowed for songs');
            return;
        }
        if(artworkError)
        {
            window.alert('Only png and jpg file format allowed for artworks');
            return;
        }
        if(balance < 5)
        {
            window.alert('Insufficient Crypto Balance');
            return;
        }
        setLoading(true);
        const returnValue = contract.methods.transfer(CONTRACT_ADDRESS ,'5000000000000000000').send({from : account})
        .once('receipt' , (receipt)=>{
            console.log(receipt.events)
            console.log(returnValue)
            const arr = [song , artwork];
            storeWithProgress(arr)
            console.log('https://' + cid +'.ipfs.dweb.link/'+song.name);
            setLoading(false);
           // window.location.reload();
            //window.location.reload();
        })
        .catch((err)=>{
            setLoading(false);
            //window.location.reload();
        })

        
       // console.log(returnValue);
        
    } 
    const fetchUserContent=()=>{
        
        const db = firebase.firestore();
         setUserFn()
       

    }
    const setUserFn=()=>{
        const db = firebase.firestore();
        const currentUser = localStorage.getItem("currentUser");
        db.collection("Artists").where("email" , "==" , currentUser).get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                console.log(doc.data().name);
                setUser(doc.data()); 
                localStorage.setItem("user" , {name : doc.data().name , email : currentUser})
                
                db.collection("Songs").where("artist" , "==" , doc.data().name).get().then((querySnapshot)=>{
                    querySnapshot.forEach((doc)=>{
                        console.log(doc.data());
                        setUserContent(prevResults => [...prevResults , doc.data()]);
                        // setUserContent(prevContent=> [...prevContent , doc.data()]);    
                    })
                })   
            })
            
        })
    }

    const retUserContent=()=>{
        return(
            userContent.map((data,index)=>{
                if(index < userContent.length/2)
                {
                    return(
                        <div className={Classes.songs} >
                            <div className={Classes.artworkDiv}><img src={data.artworkURL} className={Classes.artwork}></img></div>
                            <p className={Classes.title}>{data.name}</p>
                            <div className={Classes.artworkDiv}>
                                    <IconContext.Provider value={{ color: "#EDEDED", size:"1.5vw"  }}>
                                    <AiFillLike/>     
                                    </IconContext.Provider>
                                    <p className={Classes.likes}>{data.likes}</p>
                            </div>
                            
                        </div>
                    )
                }
                
            })
        )
    }
    const onArtworkChange=(event)=>{
        let arr = event.target.value.split('.');
        
        if(arr[arr.length-1] !== 'png' &&  arr[arr.length-1] !== 'jpg')
        {
            setArtworkError(true);return;
        }
        //console.log(event.target.files);
        setArtwork(event.target.files[0]);
    }
    const onSongChange=(event)=>{
        let arr = event.target.value.split('.');
        
        if(arr[arr.length-1] !== 'mp3' )
        {
            setSongError(true);return;
        }
        console.log(event.target.files[0])
        setSong(event.target.files[0]);
    }

    const onSongNameChange=(event)=>{
        console.log(event.target.value);
        setSongName(event.target.value);
    }
    const onSongGenreChange=(event)=>{
        console.log(event.target.value);
        setGenre(event.target.value);
    }
    return (
        <LoadingOverlay
            active={loading}
            spinner
            text='Uploading Data And Waiting For Transaction To Complete...'
            styles={{
                overlay: (base) => ({
                  ...base,
                  width : '100vw',
                  height : '100vh'
                })
              }}
            >
        <div className={Classes.Main}>
            <div className={Classes.Songs}>
                <div className={Classes.artistDiv}>
                    <img src={user.pfp} className={Classes.artistpfp}></img>
                    <div style={{display:'flex' , flexDirection : 'column' , marginTop : '5vh' , marginLeft : '3vh'}}>
                        <p className={Classes.artistName}>{user.name} </p>
                    
                        <p className={Classes.artistLikes}>{user.likes} Likes</p>
                    </div>
                </div>
                <div>
                    <div className={Classes.heading}>
                        <h1 className={Classes.h1}>title</h1>
                        <h1 className={Classes.h2}>likes</h1>
                    </div>
                    {retUserContent()}
                </div>
            </div>
            <div className={Classes.Upload}>
                <h1>Upload Your Songs </h1>
                <input type="text" placeholder="Enter Song Name" onChange={onSongNameChange}></input><br></br>
                <input type="text" placeholder="Enter Song Genre" onChange={onSongGenreChange}></input><br></br>
                <span>Song Artwork</span><input type="file" onChange={onArtworkChange}></input><br></br>
                <span>Song</span><input type="file" onChange={onSongChange}></input><br></br>
                <button className={Classes.submit} onClick={onSubmitClick}>SUBMIT</button>
            </div>
        </div>
        </LoadingOverlay>
    );
};

export default Home;