
// Global Variables

const btn = document.querySelector('.btn');
const ques = document.querySelectorAll('.question');
const display = document.querySelector('.result');
let missingAnimated = [];
missingAnimated.push(ques[0]);
missingAnimated.push(ques[1]);




// Creating scrolling animations helper function 
const screenHeight = window.innerHeight;
const check = ele => {
    const bound = ele.getBoundingClientRect();
    if(bound.top < screenHeight*0.8 && bound.top >0){
        return true;
    }
    else{
        return false;
    }

}

let tracker = []
for(let j=0;j<ques.length;j++){
    tracker.push(0);
    
}

for(let j=2;j<ques.length;j++){
    ques[j].classList.add('invisible');
}

document.addEventListener('scroll',()=>{
    for(let i=2;i<ques.length;i++){
        if(check(ques[i]) && tracker[i]==0){
            ques[i].classList.remove('invisible');
            let name = ' animate__animated';
            
            if(i%2==0){
                name+=" animate__fadeInRight";
            }
            else{
                name+=" animate__fadeInLeft";
            }
            ques[i].className+=name;
            tracker[i]=1;
        }
    }
});


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



// Handles the event of button click to fetch and display the result
btn.addEventListener('click',async()=>{
    for(let i=0;i<missingAnimated.length;i++){
        //missingAnimated[i].classList.remove('animate__animated');
        //missingAnimated[i].classList.remove('animate__flash');
        //missingAnimated[i].classList.remove('animate__delay-1s');
        missingAnimated[i].className = `q${i} question animate__animated`;
    }
    missingAnimated = []
    let flag=0;
    let value = []
    for(let i=0;i<ques.length;i++){
        const r1 = ques[i].querySelector('input[value="1"]');
        const r2 = ques[i].querySelector('input[value="0"]');
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
        btn.innerHTML = `<div class="spinner-border text-light" role="status">
  <span class="sr-only">Loading...</span>
</div>`;
        const result = await postData('/detect',{'data':value});
        let message = result.message;
        if(result.message === 'Safe'){
            message = 'You are Safe ';
            display.style.color = 'green';
        }
        else if(result.message ==='Confirmed'){
            message = 'Confirmed Case';
            display.style.color = '8B0000';
        }
        else{
            message = 'You are in '+result.message;
            display.style.color = 'red';
        }

        
        display.textContent = message;
        
        display.classList.add('animate__animated');
        display.classList.add('animate__flipInX');
        display.classList.add('animate__delay-0.8s');
        display.classList.remove('invisible');
        display.scrollIntoView({behavior:"smooth",block:'center'})
        btn.innerHTML = `Evaluate`;

    }
})