// Global Variables

const btn = document.querySelector('.btn');
const ques = document.querySelectorAll('.question');
const display = document.querySelector('.result');
let missingAnimated = [];

//post method to get the generate the result based on the input
const postData = async(url,data={})=>{
    const response = await fetch(url,{
        method:'POST',
        credentials : 'same-origin',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(data),
    });
    try{
        const newData = await response.json();
        return newData;
    }catch(error){
        console.log("error",error);
    }
}


btn.addEventListener('click',async()=>{
    console.log('btn clicked ... ');
    for(let i=0;i<missingAnimated.length;i++){
        missingAnimated[i].classList.remove('animate__animated');
        missingAnimated[i].classList.remove('animate__flash');
        //missingAnimated[i].classList.remove('animate__delay-1s');
    }
    missingAnimated = []
    let flag=0;
    let value = []
    for(let i=0;i<ques.length;i++){
        const r1 = ques[i].querySelector('#inlineRadio1');
        const r2 = ques[i].querySelector('#inlineRadio2');
        if(!r1.checked && !r2.checked){
            flag=1;
            ques[i].scrollIntoView({behavior:"smooth",block:'center'});
            missingAnimated.push(ques[i]);
            ques[i].classList.add('animate__animated');
            ques[i].classList.add('animate__flash');
            ques[i].classList.add('animate__delay-1s');
            //alert('You have not filled all the imformation , kindly fill all the fields');
            break;
        }
        else{
            if(r1.checked){
                value.push(1);
            }
            else{
                value.push(0);
            }
        }
    }
    if(flag === 0){
        console.log("Now evaluate the result");
        console.log(value);
        const result = await postData('/detect',{'data':value});
        console.log(result);
        /*const height = document.documentElement.scrollHeight;
        console.log(height+window.innerHeight/2);
        display.style.marginTop = height+window.innerHeight/2;*/
        console.log(result.message);
        if(result.message === 'Safe'){
            display.style.color = 'green';
        }
        display.textContent = result.message;

    }
})