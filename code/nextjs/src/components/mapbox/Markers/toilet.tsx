import {useEffect, useState} from "react";
import {Marker, Popup} from "react-map-gl";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {addNoti, createNoti, notiType} from "@/components/slice/notification";
import {v4} from "uuid";
import {Action} from "@/components/clickeable/types";
import {addToStack, popLatest, popStack, setState, sideBarStatesEnum} from "@/components/slice/sideBar";
import {RootState} from "@/store";
import {setToiletInterest} from "@/components/slice/toiletInterest";
import {middlewareOptions} from "@/middleware/types";
import {postMiddleware} from "@/middleware/middleware";


export type ToiletInfo = {
  averageRating: number;
  Address: {
    name: string,
    address: string,
    postalCode: string,
    floorNumber: string,
    unitNumber: string,
    coordinates: {
      longitude: number,
      latitude: number,
    },
    Description: {
      locationType: string,
      isPublic: boolean,
      description: string,
    },
    reviews?: [],

  },
}



// @ts-ignore
async function getToilets():Promise<ToiletInfo[]> {

  try{
    const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/settings/retrievetoilet/`)
    return data.toilets
  } catch (e) {
    console.error(e)
  }
}



const PopupButton = ({children, name, action=()=>{}}:{children:any, name?:string, action?:Action}) => {

  return(
    <div className={"rounded-sm transition-all bg-white md:hover:bg-gray-50 p-1 flex-grow-0 md:hover:cursor-pointer"} onClick={action}>
      <span className={"opacity-50"}>
        {children}
      </span>
    </div>
  )
}


const ToiletPopup = ({toilet}:{toilet:ToiletInfo}) => {


  const dispatch = useDispatch()
  const sidebarState = useSelector((state:RootState) => state.sideBar)
  const userState = useSelector((state:RootState) => state.user)


  const reviewToilet:Action = () => {

    console.log(toilet)

    if(sidebarState.state == sideBarStatesEnum.None){
      dispatch(popStack())
    }

    dispatch(setToiletInterest(toilet))
    dispatch(setState(sideBarStatesEnum.Review))
    dispatch(popLatest(sideBarStatesEnum.Review))
    dispatch(addToStack(sideBarStatesEnum.Review))
  }



  const addFavToilet:Action = () => {
    if(userState.id==""){
      dispatch(addNoti(createNoti(
        "Not logged in!",
        "In order to add to favourites, you have to be logged in!",
        notiType.Warning
      )))
    } else {
      const options:middlewareOptions = {
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND}/toilets/addfavourite/`,
        params: {
          userID: userState.id,
          latitude: toilet.Address.coordinates.latitude,
          longitude: toilet.Address.coordinates.longitude
        },
      }

      postMiddleware(options)
        .then(r=>{
          if(r?.error_message){
            console.error(r)
            dispatch(addNoti(createNoti(
              "Toilet already in favourites!",
              "Already added to your list.",
              notiType.Notification
            )))
          } else {
            console.log(r)
            dispatch(addNoti(createNoti(
              "Added to favourites!",
              "Access your favourite toilets using the favourites menu item!",
              notiType.Notification
            )))
          }
        })
        .catch(e=>{
          console.error(e)
          dispatch(addNoti(createNoti(
            "Oops! Error adding to favourite!",
            "Lets pretend this didn't happen.",
            notiType.Warning
          )))
        })
    }
  }


  const unitLine = ():string => {
    if(toilet.Address.floorNumber && toilet.Address.unitNumber){
      return `#${toilet.Address.floorNumber}-${toilet.Address.unitNumber}`
    }

    if(toilet.Address.floorNumber && !toilet.Address.unitNumber){
      return `Level ${toilet.Address.floorNumber}`
    }

    if(!toilet.Address.floorNumber && toilet.Address.unitNumber) {
      return `#${toilet.Address.unitNumber}`
    }

    return ""
  }

  return(
    <Popup
      longitude={toilet.Address.coordinates.longitude}
      latitude={toilet.Address.coordinates.latitude}
      anchor={"bottom"}
      closeOnClick={false}
      closeOnMove={false}
      closeButton={false}
      offset={12}
    >
      <div className={"flex flex-col justify-center items-center max-w-[45ch]"}>
        <div className={"top flex flex-col justify-between items-start"}>
          <div className={"flex flex-row w-full justify-between items-start gap-x-2"}>
            <span className={"text-shadow font-medium text-md"}>{toilet.Address.name.length>0? toilet.Address.name : "Toilet"}</span>
            <span className={"flex-shrink-0 text-xl"}>{toilet.averageRating>0?`${'⭐'.repeat(parseInt(`${toilet.averageRating}`))} `:""}</span>
            {/*<span>{toilet.averageRating}</span>*/}
          </div>
          <div className={"flex flex-col"}>
            <span>{toilet.Address.address}</span>
            <span>{unitLine()}</span>
          </div>
        </div>
        <div className={"description w-full text-opacity-75 text-shadow mt-2"}>
          <p>{toilet.Address.Description.description}</p>
        </div>
        <div className={"action flex flex-row justify-end items-center w-full"}>
          <PopupButton name={"review"} action={reviewToilet}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </PopupButton>
          <PopupButton action={addFavToilet}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </PopupButton>
        </div>
      </div>
    </Popup>
  )
}





const ToiletMarker = ({toilet}:{toilet:ToiletInfo}) => {

  const [open, setOpen] = useState<boolean>(false)

  const toggle = () => {
    setOpen(!open)
  }

  //
  // useEffect(()=>{
  //   if(open){
  //     console.log(toilet)
  //   }
  // },[open])

  return(
    <>
      <Marker longitude={toilet.Address.coordinates.longitude} latitude={toilet.Address.coordinates.latitude} onClick={toggle}>
        <div className={`transition-all rounded-full border-2 border-white w-7 h-7 flex flex-row justify-center items-center ${open?"bg-rust":"bg-violet"}`}>
          <span className={"font-bold text-lg text-white"}>T</span>
        </div>
      </Marker>
      {open && <ToiletPopup toilet={toilet} /> }
    </>
  )
}



const Toilets = () => {

  const dispatch = useDispatch()
  const [toilets, setToilets] = useState<ToiletInfo[]>([])

  useEffect(()=>{
    getToilets()
      .then(r=>{
        setToilets(r)
      })
      .catch(()=>{
        dispatch(addNoti(createNoti(
          "Error getting toilets!",
          "We could not sync the data with the backend, sorry about that.",
          notiType.Warning
        )))
      })
  },[]) //eslint-disable-line

  return(
    <>
      {
        toilets.map(toilet=>{
          return(
            // <></>
            <ToiletMarker toilet={toilet} key={v4()}/>
          )
        })
      }
    </>
  )
}

export default Toilets