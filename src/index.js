const addPicButton = document.querySelector('#addPicButton')
addPicButton.addEventListener('click', openNewPicForm)
let formOpen = false
const photosContainer = document.querySelector('#photoContainer')
const addPicForm = document.querySelector('#newPicForm')

addPhotosToPhotoDiv()

addPicForm.addEventListener('submit', e=>{
    e.preventDefault()
    console.log(e)
    postFetchPicture(e).then(renderSinglePicture)
})

function openNewPicForm(){
    const newPicFormContainer = document.querySelector('#newPicFormContainer')
    if(formOpen){
        newPicFormContainer.style.height = '0px'
        newPicFormContainer.style.padding = '0px'
    }
    else{
        newPicFormContainer.style.height = '280px'
        newPicFormContainer.style.padding = '20px'
    }
    formOpen = !formOpen
}

//****Start coding below****//

function fetchPhotos(){
    return fetch('http://localhost:3000/photos')
        .then(resp => resp.json())
}

function postFetchPicture(e){
    const bodyObj = {
        name: e.target.name.value,
        photo_image_url: e.target.photo_image_url.value,
        owner: e.target.owner.value
    }
    const configObj = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }, 
        body: JSON.stringify(bodyObj)
    }
    return fetch(`http://localhost:3000/photos`, configObj)
        .then(resp => resp.json())
}

function updateFetch(photoObj, e){
    const photoAttributes = {
        name: e.target.name.value,
        photo_image_url: e.target.photo_image_url.value
    }
    const configObj = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(photoAttributes)
    }
    return fetch(`http://localhost:3000/photos/${photoObj.id}`,configObj)
        .then(resp => resp.json())
}
function deleteFetch(photoObj){
    const configObj = {
        method: 'DELETE'
    }
    return fetch(`http://localhost:3000/photos/${photoObj.id}`,configObj)
        .then(resp => resp.json())
}

function addPhotosToPhotoDiv(){
    fetchPhotos().then(json => {
        json.forEach(renderSinglePicture)
    })
}

function renderSinglePicture(photoObj){
    let photoDiv = document.createElement('div')
    photoDiv.innerHTML = `
    <div class = 'display'>
        <h3>${photoObj.name}</h3>
        <p>By ${photoObj.owner}</p>
        <img src=${photoObj.photo_image_url}>
        <button class="removeButton">Remove</button>
        <button class = 'updateButton'> Update</button>
    </div>
    <div class ='update photo'>
        <div style = "height: 400px; width: 300px">
            <h3> Update Picture</h3>
            <form class = 'update-form'>
                <input type="text" name="name" id="name" placeholder="name"/><br>
                <input type="text" name="photo_image_url" id="photo_image_url" placeholder="photo_image_url"><br>
                <input type="submit" value="Submit"/>
            </form>
            <button class ='back'>Go Back</button>
        </div>
    </div>
    `
    const displayDiv = photoDiv.querySelector('.display')
    const updateDiv = photoDiv.querySelector('.update')
    updateDiv.style.display = 'none'

    const updateButton = photoDiv.querySelector('.updateButton')
    updateButton.addEventListener('click', e=>{
        displayDiv.style.display = 'none'
        updateDiv.style.display = 'block'
    })

    const backButton = photoDiv.querySelector('.back')
    backButton.addEventListener('click', e=>{
        displayDiv.style.display = 'block'
        updateDiv.style.display = 'none'
    })

    const updateForm = photoDiv.querySelector('.update-form')
    updateForm.addEventListener('submit', e=>{
        e.preventDefault()
        updateFetch(photoObj,e).then(json =>{
            const imageName = displayDiv.querySelector('h3')
            const displayImage = displayDiv.querySelector('img')
            imageName.innerText = json.name
            displayImage.src = json.photo_image_url
            displayDiv.style.display = 'block'
            updateDiv.style.display = 'none'
        })
    })

    const deleteButton = photoDiv.querySelector('.removeButton')
    deleteButton.addEventListener('click', e=>{
        deleteFetch(photoObj).then(photoDiv.remove())
    })

    photosContainer.append(photoDiv)
}

