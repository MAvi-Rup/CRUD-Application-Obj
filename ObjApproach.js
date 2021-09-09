/// Start The Project of OOP-

//Storage
const storage ={
    //get item from loaclstorage
    getItems(){
        let items = ''
        if(localStorage.getItem('productItems')=== null){
            items=[]
        }else{
            items = JSON.parse(localStorage.getItem('productItems'))
        }
        return items
    },

    //Save 
    saveItem(item){
        let items = ''
        if(localStorage.getItem('productItems') === null) {
           items = [] 
           items.push(item)
           localStorage.setItem('productItems',JSON.stringify(items))

        }else{
            items=JSON.parse(localStorage.getItem('productItems'))
            items.push(item)
            localStorage.setItem('productItems',JSON.stringify(items))

        }

    },
	saveItems(){
		localStorage.setItem('productItems', JSON.stringify(items))

	},
	deleteItem(id){
		const items = JSON.parse(localStorage.getItem('productItems'))
		let result = items.filter((productItem)=>{
			return productItem.id !== id
		})
		localStorage.setItem('productItem',JSON.stringify(result))
		UI.resetInput()
		UI.clearUpdateState()
		if(result.length=== 0) location.reload()
	}

}


//data Store
const dataStore = {
	productData: storage.getData(),
    updateItem(id){
        const {priceInputElm, nameInputElm}=UI.loadSelectors()
        let productData = this.productData
        productData = productData.map((productItem) => {
            if (productItem.id === id) {
              return {
                ...productItem,
                name: nameInputElm.value,
                price: priceInputElm.value
              }
            } else {
              return productItem
            }
          })
          storage.saveDataItem(productData)
          return productData
    },
	removeItem(id){
		const productData= this.productData
		return productData.filter((productItem)=>{
			return productItem.id !== id
		})

	},
	findItem(id){
		const productData=this.productData
		return productData.find((productItem)=>productItem.id === id)
	},
	addItem(e){
		e.preventDefault()
		const {nameInputElm,priceInputElm}=UI.loadSelectors()
		const {getData,resetInput,showMessage,validateInput} = UI
		const productData = data.productData
		const name = nameInputElm.value
		const price= priceInputElm.value

		let id
		if(productData.length === 0){
			id = 0
		}else{
			id = productData[productData.length -1 ].id+1
		}
		const inputIsValid = validateInput(name,price)
		if(inputIsValid){
			showMessage('please fill up necessary and valid information')
		}else{
			const data = {
				id,
				name,
				price
			}
			productData.push(data)
			storage.saveItem(data)
			getData.call(UI,productData)
			resetInput()
		}
	},






}

//UI object
const UI={
	loadSelectors(){
		const filterInputElm = document.querySelector('#filter');
        const productListULElm = document.querySelector('.product-collection');
        const nameInputElm = document.querySelector('.product-name');
        const priceInputElm = document.querySelector('.product-price');
        const addBtnElm = document.querySelector('.add-product');
        const deleteBtnElm = document.querySelector('.delete-btn');
        const msgElm = document.querySelector('.msg');
        const form = document.querySelector('form');

		return {
			filterInputElm,
			productListULElm,
			msgElm,
			nameInputElm,
			priceInputElm,
			addBtnElm,
			deleteBtnElm,
			form
		}

	},

	init(){
		const{productListULElm,addBtnElm,filterInputElm}=this.loadSelectors()
		const productData = dataStore.productData
		// productListULElm.addEventListener('click', e=>{
		// 	if(e.target.classList.contains('delete-product')){
		// 		this.removeItem(e)
		// 	}else if(e.target.classList.contains('edit-product')){
		// 		this.editItem(e)
		// 	}
		// });
		productListULElm.addEventListener('click', ()=>{
          if(e.target.classList.contains('edit-product')){
               this.editProduct(e)
		  }else if(e.target.classList.contains('delete-product')){
               this.deleteProduct(e)
		  }
		})
		window.addEventListener('DOMContentLoaded', (e)=>{
			this.getData(productData)
		});
		addBtnElm.addEventListener('click', dataStore.addItem);  
		filterInputElm.addEventListener('keyup', this.filterProduct);
	},
	clearUpdateState(){
		const {addBtnElm}=this.loadSelectors()
		this.resetInput()
		addBtnElm.style.display='block'
		if(document.querySelector('update-product')){
			document.querySelector('update-product').remove()
		}

	},
	resetInput(){
		const{nameInputElm,priceInputElm} = this.loadSelectors()
		nameInputElm.value=''
		priceInputElm.value=''

	},
	getId(e){
		const target = e.target.parentElement.parentElement;
        const id = parseInt(target.id.split('-')[1]);
		return id
	},
	showMessage(message = ''){
		const {msgElm}=this.loadSelectors()
		msgElm.textContent=message

	},
	validateInput(name,price){
		return (
			name !== '' && price !== '' && !isNaN(parseFloat(price)) && isFinite(price)
		)	
	},
	populateInput(name,price){
		const{nameInputElm,priceInputElm}=this.loadSelectors()
		nameInputElm.value=name
		priceInputElm.value=price

	},
	showUpdateState(e,id){
		const {updateItem}=this
		const{form,addBtnElm}=this.loadSelectors()
		let updateBtn
		const updateBtnElm = `<Button type='submit' class='btn btn-info update-product btn-block'>Update</Button>`
		form.insertAdjacentHTML('beforeend',updateBtnElm)
		// clean submit
		addBtnElm.style.display='none'
		//hide edit btn
		e.target.style.display='none'

		updateBtn = document.querySelector('.update-product')
		updateBtn.addEventListener('click', function (e) {
		  e.preventDefault()
		  updateItem.call(UI, id)
		})


	},
	getData(productList) {
	   const {productListULElm} = this.loadSelectors()
        
	   productListULElm.innerHTML = '';
	  if(productList.length > 0){
		this.showMessage()
		productList.forEach(({id,name,price}) => {
		let li = document.createElement('li');
		li.className = 'list-group-item collection-item';
		li.id = `product-${id}`;
		li.innerHTML=`
		<strong>${name}</strong>-
        <span class="price">$${price}</span>
        <i class="fa fa-trash delete-btn ml-auto float-right" id="icon"></i>
		<i class="fa fa-pencil-alt mr-1 edit-product float-right" id="icon"></i>

		`;
		productListULElm.appendChild(li);

	});

	}else{
		// msg.innerHTML = 'No Product to show';
		// showMessage(true,null);
		this.showMessage('Add item to your catalouge');
	}
    },
	
	updateItem(id){
		//e.preventDefault()
		const {getData} = this
		const {nameInputElm,priceInputElm}=this.loadSelectors()
		//get Input


		const isInputOk = this.validateInput(nameInputElm.value,priceInputElm.value)
		if(!isInputOk){
			this.showMessage('Please fill the nessary filled properly')
            
		}else{
			getData.call(this,dataStore.updateProduct)
			this.resetInput()
			this.clearUpdateState.call(UI)

		}

		// this.getData(dataStore.productData)
		// this.resetInput()


	},
	removeItem(e){
		let productData=dataStore.productData
		const id = this.getId
		const target= e.target.parentElement.parentElement
		e.target.parentElement.parentElement.parentElement.removeChild(target)
        productData = dataStore.removeItem(id)
		storage.deleteItem(id)

	},
	editItem(e){
		const id = this.getId
		const foundItem = dataStore.findItem(id)
		if(!foundItem){
		  this.showMessage ('some Unknown occured')
		}
		else{
			this.populateInput(foundItem.name,foundItem.price,id)
		}
	},
	filterProduct(e){
		const text = e.target.value.tolowerCase()
		let itemLength = 0
		document.querySelectorAll('.collection .collection-item')
		.forEach((item)=>{
			const productName = item.firstElementChild.textContent.toLowerCase()
			if(productName.indexOf(text)===1){
				item.style.display = 'none'
			}else{
				item.style.display = 'block'
				++itemLength
			}
		})
		itemLength > 0 ? this.showMessage() : this.showMessage('No item found')
	},	
}



UI.init()