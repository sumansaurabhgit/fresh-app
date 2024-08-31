import axios from 'axios'
import Noty from 'noty';

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(fresh){
    axios.post('/update-cart',fresh).then(res=>{
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            timeout:1000,
            text: 'Item added to cart',
            layout:'topLeft'
        }).show();
    })
}
addToCart.forEach((btn) =>{
    btn.addEventListener('click', (e)=>{
        let fresh = JSON.parse(btn.dataset.fresh)
        updateCart(fresh)
        console.log(fresh)
    })
})