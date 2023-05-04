function showSnackBar(snack,snackMessage){

    snack.classList.add('show')
    snack.textContent = snackMessage
    setTimeout(()=>{
       
        snack.classList.remove('show')
      },4000)
}
export default showSnackBar