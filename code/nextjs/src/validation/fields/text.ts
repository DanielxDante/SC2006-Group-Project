

// Takes in user input, then returns error message (if any)
export interface ValidateInputText{
  (input:string):string|false
}



// requires a minimum of 8 characters on input field
export const MinPassLength:ValidateInputText = input => {

  if(input.length<8){
    return "Minimum 8 characters"
  }

  return false
}


// requires at least one letter and one number
export const PassMinCharNum:ValidateInputText = input => {

  const re = new RegExp("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)")

  if(re.test(input) == false){
    return "Passwords require at least one alphabet and one digit"
  }

  return false

}
