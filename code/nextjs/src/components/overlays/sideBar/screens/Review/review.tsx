import FormWrapper from "@/components/fields/FormWrapper";
import TextInput from "@/components/fields/TextInput";
import Button, {buttonColourGreen} from "@/components/clickeable/Button";
import SelectInput, {emptyOption, Option, ratingOptions} from "@/components/fields/SelectInput";
import FieldWrapper from "@/components/fields/FieldWrapper";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import {addNoti, createNoti, notiType} from "@/components/slice/notification";
import AccountLoginScreen from "@/components/overlays/sideBar/screens/Account/AccountLogin";
import {useEffect, useState} from "react";
import {addToStack, popLatest, sideBarStatesEnum} from "@/components/slice/sideBar";
import {Action} from "@/components/clickeable/types";
import {Hoist} from "@/components/fields/types";
import {postMiddleware} from "@/middleware/middleware";
import {middlewareOptions} from "@/middleware/types";


const ReviewScreen = () => {

  const toilet = useSelector((state:RootState) => state.toiletInterest)
  const userState = useSelector((state:RootState) => state.user)
  const sidebarState = useSelector((state:RootState) => state.sideBar.stack)
  const [userLatch, setUserLatch] = useState<typeof userState>(userState)
  const dispatch = useDispatch()

  const [rating, setRating] = useState<Option>(emptyOption)
  const [review, setReview] = useState<string>("")


  const ratingHoist:Hoist<Option> = (value) => {
    setRating(value)
  }

  const reviewHoist:Hoist<string> = (value) => {
    setReview(value)
  }


  const submitReview:Action = () => {

    const payload:any = {
      longitude: toilet.Address.coordinates.longitude,
      latitude: toilet.Address.coordinates.latitude,
      rating: rating.value,
      comment: review
    }

    console.log(payload)

    const options:middlewareOptions = {
      endpoint: `${process.env.NEXT_PUBLIC_BACKEND}/sg/v1/reviews/create/`,
      params: payload
    }

    postMiddleware(options, true)
      .then(r=>{
        console.log(r)
        if(r?.error_message){
          dispatch(addNoti(createNoti(
            "Already reviewed!",
            "You have already reviewed this toilet!",
            notiType.Notification
          )))
        } else {
          dispatch(addNoti(createNoti(
            "Added review!",
            `We've added your review for ${toilet.Address.name}!`,
            notiType.Notification
          )))
        }
      })
      .catch(e=>{
        console.error(e)
        dispatch(addNoti(createNoti(
          "Error adding review!",
          "Oopsie, lets pretend that this error didn't happen.",
          notiType.Warning
        )))
      })

  }



  useEffect(()=>{
    if(userState!=userLatch && userState.id){
      dispatch(popLatest(sideBarStatesEnum.Account))
      dispatch(addToStack(sideBarStatesEnum.Review))
      setUserLatch(userState)
    }
  }, [userState]) //eslint-disable-line



  if(!userState.name && sidebarState.slice(-1)[0] == sideBarStatesEnum.Review){

    dispatch(addNoti(createNoti(
      "You need to be logged in!",
      "To prevent spam, we require you to be logged in before you write a review.",
      notiType.Warning
    )))

    return(
      <AccountLoginScreen />
    )
  }

  return(
    <FormWrapper action={submitReview}>
      <FieldWrapper>
        <span className={"font-medium text-xl"}>{toilet.Address.name || toilet.Address.address}</span>
      </FieldWrapper>
      <SelectInput placeholder={"Rating"} options={ratingOptions} hoist={ratingHoist}/>
      <TextInput placeholder={"Review"} type={"textarea"} hoist={reviewHoist}/>
      <Button text={"Submit"} colour={buttonColourGreen} />
    </FormWrapper>
  )
}

export default ReviewScreen