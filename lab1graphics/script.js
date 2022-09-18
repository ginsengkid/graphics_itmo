var imgArray = [0,0,0,0];

function showPhoto(){
    imgArray = [0,0,0,0];
    const photo = document.getElementById('photo');
    imgArray[0] = 1;
    photo.innerHTML = '<img src="img/pic1.png" alt="photo)" style="height: 300px; width: 300px;">';
}

function showRandPhoto(){
    imgArray = [0,0,0,0];
    const photo = document.getElementById('photo');
    const photoNumber = Math.floor(Math.random() * 4) + 1;
    const photoPath = 'img/pic' + photoNumber + '.png';
    imgArray[photoNumber-1] = photoNumber;
    photo.innerHTML = `<img src="${photoPath}" alt="photo)" style="height: 300px; width: 300px;">`;
}

function addPhoto(){
    const photo = document.getElementById('photo');
    for (const [i, value] of imgArray.entries()) {
        if (value === 0){
            imgArray[i] = i + 1;
            const photoPath = 'img/pic' + (i + 1) + '.png';
            photo.innerHTML += `<img src="${photoPath}" alt="photo)" style="height: 300px; width: 300px;">`;
            return;
        }
    }
}
