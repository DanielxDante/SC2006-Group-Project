import Logo from "@/components/fields/Logo";
import TextInput from "@/components/fields/TextInput";
import PasswordGroup from "@/components/fields/PasswordGroup";
import Button, {buttonColourBlue} from "@/components/clickeable/Button";
import {Action, btnColour} from "@/components/clickeable/types";
import {useDispatch} from "react-redux";
import {popStack} from "@/components/slice/sideBar";
import LocalRedirect from "@/components/clickeable/LocalRedirect";
import FormWrapper from "@/components/fields/FormWrapper";
import {useState} from "react";
import {Hoist} from "@/components/fields/types";
import {middlewareOptions} from "@/middleware/types";
import {postMiddleware} from "@/middleware/middleware";


const AccountCreateScreen = () => {

  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nameValid, setNameValid] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [passwordValid, setPasswordValid] = useState(false)

  const nameHoist:Hoist<string> = value => {
    setName(value)
  }
  const emailHoist:Hoist<string> = value => {
    setEmail(value)
  }
  const passwordHoist:Hoist<string> = value => {
    setPassword(value)
  }

  const redirectLogin:Action = () => {
    dispatch(popStack())
  }

  const checkSubmittable = ():boolean => {
    return(name.length!=0 && nameValid && email.length!=0 && emailValid && password.length!=0 && passwordValid)
  }

  const formSubmit:Action = () => {
    if(checkSubmittable()){
      const options:middlewareOptions = {
        endpoint: `${process.env.NEXT_PUBLIC_BACKEND}/accounts/create`,
        params: {
          "name": name,
          "emailAddress": email,
          "password": password,
        }
      }
      postMiddleware(options).then(r => console.log(r))
    }
  }

  return(
    <FormWrapper action={formSubmit}>
      <div className={"pt-[56px]"}>
        <Logo />
        <TextInput placeholder={"Name"} required={true} hoist={nameHoist} hoistValid={setNameValid}/>
        <TextInput placeholder={"Email"} required={true} hoist={emailHoist} hoistValid={setEmailValid}/>
        <PasswordGroup hoist={passwordHoist} hoistValid={setPasswordValid}/>
        <Button text={"Create account"} colour={buttonColourBlue} action={formSubmit} />
        <LocalRedirect preText={"Already have an account?"} actionText={"Login here!"} action={redirectLogin} />
      </div>
    </FormWrapper>
  )
}


export default AccountCreateScreen