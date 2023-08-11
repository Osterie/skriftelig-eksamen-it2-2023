const input_field = document.getElementById('input')
const button = document.getElementById('button')
const output = document.getElementById('output')

button.addEventListener('click', () =>{
    button_handler(input_field)
})


function button_handler(input) {
    const poengsum = parseInt(input.value)
    // istedenfor console.log endrer jeg innerhtml til et element på nettsiden 
    if (poengsum < 0){
        output.innerHTML = 'Ikke gyldig poengsum'
    }
    else if (poengsum < 50){
        output.innerHTML = 'Ikke bestått'
    }
    else if (69 >= poengsum && poengsum >= 50){
        output.innerHTML = 'Bestått'
    }
    else if (poengsum >= 70 && poengsum <= 89){
        output.innerHTML = 'Godt bestått'
    }
    else if (poengsum >= 90 && poengsum <= 100){
        output.innerHTML = 'Meget godt bestått'
    }
    else{
        output.innerHTML = 'Ikke gyldig poengsum'
    }
}
